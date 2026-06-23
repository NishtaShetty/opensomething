"""
decision_engine.py — Platform Decision Rules for Samriddhi

Takes a ClassificationResult and the reported_category from the app,
applies the decision matrix from the taxonomy plan, and returns a
structured DecisionOutput with a platform action and human-readable reason.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional

from classifier import ClassificationResult


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# Minimum confidence to accept a classification
ACCEPT_THRESHOLD = 0.22       # CLIP cosine scores are typically 0.15–0.35
FLAG_THRESHOLD = 0.17          # Below this → human review
REJECT_CAT15_THRESHOLD = 0.20  # If CAT015 scores above this → reject

# Categories that always auto-escalate to RED
AUTO_ESCALATE_CATEGORIES = {"CAT004", "CAT005"}

# Subcategories that force RED severity regardless of category
AUTO_ESCALATE_SUBCATEGORIES = {
    "CAT001-05",  # Electrical Hazard Near Water
    "CAT001-06",  # Access Blocked
    "CAT002-01",  # Sewage Overflow
    "CAT004-02",  # Sparking / Arcing
    "CAT004-08",  # Water Near Electrical
    "CAT005-01",  # Active Fire
    "CAT005-02",  # Smoke
    "CAT006-04",  # Column / Beam Damage
    "CAT007-01",  # Stuck / Trapped
    "CAT009-07",  # Snake Sighting
    "CAT011-06",  # Suspicious Object
    "CAT013-03",  # Fallen Tree / Branch
    "CAT014-02",  # Broken Playground Equipment
}


# ---------------------------------------------------------------------------
# Output
# ---------------------------------------------------------------------------

@dataclass
class Alert:
    level: str      # "INFO" | "WARNING" | "CRITICAL"
    message: str


@dataclass
class DecisionOutput:
    action: str                          # "ACCEPT" | "FLAG" | "REJECT"
    reason: str                          # Human-readable reason
    predicted_category_id: str
    predicted_category_name: str
    predicted_subcategory_id: str
    predicted_subcategory_name: str
    confidence: float
    severity: str                        # RED | YELLOW | INFO | REJECT
    workflow_stage: Optional[str]        # Detected workflow stage tag
    alerts: List[Alert] = field(default_factory=list)
    mismatch_detected: bool = False
    reported_category_id: Optional[str] = None
    full_result: Optional[ClassificationResult] = None


# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------

class DecisionEngine:
    """
    Applies the Samriddhi decision matrix to a ClassificationResult.

    Parameters
    ----------
    result : ClassificationResult
        Output from SamriddhiCLIPClassifier.classify()
    reported_category_id : str | None
        The category the resident/FM said they were uploading for (e.g. "CAT001").
        Pass None if not known (e.g. during initial upload before category selection).
    incident_status : str | None
        Current incident status from the platform.
        Values: "REPORTED" | "TRIAGED" | "IN_PROGRESS" | "VERIFIED" | "CLOSED"
    """

    def __init__(
        self,
        result: ClassificationResult,
        reported_category_id: Optional[str] = None,
        incident_status: Optional[str] = None,
    ) -> None:
        self._result = result
        self._reported_cat = reported_category_id
        self._status = incident_status

    def evaluate(self) -> DecisionOutput:
        result = self._result
        alerts: List[Alert] = []
        mismatch = False

        # ------------------------------------------------------------------ #
        # Step 1: Check for irrelevant upload (CAT015)
        # ------------------------------------------------------------------ #
        cat15_score = self._get_category_score("CAT015")
        top_cat = result.top_categories[0]

        if top_cat.category_id == "CAT015" and cat15_score >= REJECT_CAT15_THRESHOLD:
            return DecisionOutput(
                action="REJECT",
                reason=(
                    f"This image appears to be '{top_cat.top_subcategory.subcategory_name}' "
                    "and is not related to any valid incident category. "
                    "Please upload a photo of the actual problem."
                ),
                predicted_category_id="CAT015",
                predicted_category_name="Wrong / Irrelevant Upload",
                predicted_subcategory_id=top_cat.top_subcategory.subcategory_id,
                predicted_subcategory_name=top_cat.top_subcategory.subcategory_name,
                confidence=cat15_score,
                severity="REJECT",
                workflow_stage=None,
                alerts=[Alert("CRITICAL", "Image rejected as irrelevant/wrong upload.")],
                mismatch_detected=False,
                reported_category_id=self._reported_cat,
                full_result=result,
            )

        # ------------------------------------------------------------------ #
        # Step 2: Check confidence — too low → flag for human review
        # ------------------------------------------------------------------ #
        if result.confidence < FLAG_THRESHOLD:
            return DecisionOutput(
                action="FLAG",
                reason=(
                    f"Unable to confidently classify this image (confidence: "
                    f"{result.confidence:.2f}). Flagged for manual review."
                ),
                predicted_category_id=top_cat.category_id,
                predicted_category_name=top_cat.category_name,
                predicted_subcategory_id=top_cat.top_subcategory.subcategory_id,
                predicted_subcategory_name=top_cat.top_subcategory.subcategory_name,
                confidence=result.confidence,
                severity=result.predicted_severity,
                workflow_stage=self._top_workflow_stage(),
                alerts=[Alert("WARNING", "Low confidence — requires manual review.")],
                mismatch_detected=False,
                reported_category_id=self._reported_cat,
                full_result=result,
            )

        # ------------------------------------------------------------------ #
        # Step 3: Check mismatch between predicted and reported category
        # ------------------------------------------------------------------ #
        if self._reported_cat and top_cat.category_id != self._reported_cat:
            mismatch = True
            alerts.append(Alert(
                "WARNING",
                (
                    f"Image appears to show '{top_cat.category_name}' "
                    f"(predicted), but incident was reported as '{self._reported_cat}'. "
                    "Please verify the incident category."
                )
            ))

        # ------------------------------------------------------------------ #
        # Step 4: Safety-critical auto-escalation
        # ------------------------------------------------------------------ #
        severity = result.predicted_severity
        top_sub = result.top_subcategories[0] if result.top_subcategories else None

        if top_cat.category_id in AUTO_ESCALATE_CATEGORIES:
            severity = "RED"
            alerts.append(Alert(
                "CRITICAL",
                f"Category '{top_cat.category_name}' is safety-critical. "
                "Severity auto-escalated to RED. PMC notified immediately."
            ))

        if top_sub and top_sub.subcategory_id in AUTO_ESCALATE_SUBCATEGORIES:
            severity = "RED"
            alerts.append(Alert(
                "CRITICAL",
                f"Detected '{top_sub.subcategory_name}' — auto-escalated to RED. "
                "Immediate attention required."
            ))

        # ------------------------------------------------------------------ #
        # Step 5: Severity upgrade — predicted RED but incident marked YELLOW
        # ------------------------------------------------------------------ #
        # (The caller can use the returned severity to update the incident.)

        # ------------------------------------------------------------------ #
        # Step 6: Workflow stage mismatch checks
        # ------------------------------------------------------------------ #
        wf_stage = self._top_workflow_stage()

        if wf_stage == "WF-03" and self._status in ("REPORTED", "TRIAGED"):
            alerts.append(Alert(
                "WARNING",
                "Post-repair photo uploaded but incident hasn't been assigned yet. "
                "Possible recycled or wrong image."
            ))

        if wf_stage == "WF-01" and self._status in ("VERIFIED", "CLOSED"):
            alerts.append(Alert(
                "WARNING",
                "Pre-repair photo uploaded after incident closure. "
                "Possible fraud — flagged for review."
            ))

        # ------------------------------------------------------------------ #
        # Final decision
        # ------------------------------------------------------------------ #
        action = "ACCEPT"
        reason = (
            f"Image classified as '{top_cat.category_name}' "
            f"({top_cat.top_subcategory.subcategory_name}) "
            f"with confidence {result.confidence:.2f}."
        )

        if mismatch:
            action = "REJECT"
            reason = f"Category mismatch: The uploaded image appears to show '{top_cat.category_name}' ({top_cat.top_subcategory.subcategory_name}), which does not match the reported category."

        return DecisionOutput(
            action=action,
            reason=reason,
            predicted_category_id=top_cat.category_id,
            predicted_category_name=top_cat.category_name,
            predicted_subcategory_id=top_cat.top_subcategory.subcategory_id,
            predicted_subcategory_name=top_cat.top_subcategory.subcategory_name,
            confidence=result.confidence,
            severity=severity,
            workflow_stage=wf_stage,
            alerts=alerts,
            mismatch_detected=mismatch,
            reported_category_id=self._reported_cat,
            full_result=result,
        )

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _get_category_score(self, cat_id: str) -> float:
        for cat in self._result.top_categories:
            if cat.category_id == cat_id:
                return cat.score
        return 0.0

    def _top_workflow_stage(self) -> Optional[str]:
        if self._result.workflow_stages:
            best = self._result.workflow_stages[0]
            if best.score > ACCEPT_THRESHOLD:
                return best.subcategory_id
        return None
