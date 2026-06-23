"""
classifier.py — CLIP-based Image Classifier for Samriddhi

Loads a CLIP model and encodes all taxonomy prompts upfront.
For each input image it computes cosine similarity scores and
returns top-K category/subcategory matches with confidence scores.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import numpy as np
import torch
from PIL import Image

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Minimal runtime imports — defer heavy imports until model load
# ---------------------------------------------------------------------------

try:
    import open_clip  # preferred: open_clip-torch
    _BACKEND = "open_clip"
except ImportError:
    try:
        from transformers import CLIPModel, CLIPProcessor  # fallback: HF transformers
        _BACKEND = "transformers"
    except ImportError:
        raise ImportError(
            "Install either 'open-clip-torch' or 'transformers[torch]'.\n"
            "  pip install open-clip-torch torch Pillow\n"
            "  OR\n"
            "  pip install transformers[torch] Pillow"
        )


# ---------------------------------------------------------------------------
# Data Structures
# ---------------------------------------------------------------------------

@dataclass
class SubcategoryScore:
    subcategory_id: str
    subcategory_name: str
    category_id: str
    category_name: str
    score: float          # cosine similarity (0–1)
    severity: str         # RED / YELLOW / INFO / REJECT
    prompts_used: List[str]


@dataclass
class CategoryScore:
    category_id: str
    category_name: str
    score: float          # max score across subcategories in this category
    top_subcategory: SubcategoryScore


@dataclass
class ClassificationResult:
    """Full output from the classifier for one image."""
    image_path: str
    top_categories: List[CategoryScore]          # ranked by score
    top_subcategories: List[SubcategoryScore]    # ranked by score
    workflow_stages: List[SubcategoryScore]      # workflow tag matches
    predicted_category_id: str                  # top-1 category
    predicted_severity: str                     # RED / YELLOW / INFO / REJECT
    confidence: float                           # top-1 score
    all_scores: Dict[str, float]                # prompt → score (for debugging)


# ---------------------------------------------------------------------------
# Classifier
# ---------------------------------------------------------------------------

class SamriddhiCLIPClassifier:
    """
    Zero-shot CLIP classifier for Samriddhi incident image validation.

    Usage
    -----
    clf = SamriddhiCLIPClassifier()
    result = clf.classify("path/to/image.jpg", reported_category="CAT001")
    """

    # Default model — ViT-L-14 has higher accuracy for zero-shot tasks
    DEFAULT_MODEL = "ViT-L-14"
    DEFAULT_PRETRAINED = "openai"  # for open_clip

    # HF fallback model
    HF_MODEL = "openai/clip-vit-large-patch14"

    def __init__(
        self,
        model_name: str = DEFAULT_MODEL,
        pretrained: str = DEFAULT_PRETRAINED,
        device: Optional[str] = None,
    ) -> None:
        self.device = device or ("cuda" if torch.cuda.is_available() else "cpu")
        logger.info("Using device: %s", self.device)
        logger.info("CLIP backend: %s", _BACKEND)

        self._model, self._preprocess, self._tokenizer = self._load_model(
            model_name, pretrained
        )

        # Import taxonomy here to avoid circular imports
        from taxonomy import (
            CATEGORIES,
            WORKFLOW_STAGE_TAGS,
            build_prompt_to_subcategory_map,
            build_subcategory_to_category_map,
        )

        self._categories = CATEGORIES
        self._workflow_tags = WORKFLOW_STAGE_TAGS
        self._prompt_to_sub = build_prompt_to_subcategory_map()
        self._sub_to_cat = build_subcategory_to_category_map()

        # Pre-encode ALL text prompts once
        logger.info("Pre-encoding %d text prompts …", len(self._prompt_to_sub))
        self._all_prompts: List[str] = list(self._prompt_to_sub.keys())
        self._text_features: torch.Tensor = self._encode_texts(self._all_prompts)
        logger.info("Classifier ready.")

    # ------------------------------------------------------------------
    # Model Loading
    # ------------------------------------------------------------------

    def _load_model(
        self, model_name: str, pretrained: str
    ) -> Tuple:
        if _BACKEND == "open_clip":
            import open_clip
            model, _, preprocess = open_clip.create_model_and_transforms(
                model_name, pretrained=pretrained
            )
            tokenizer = open_clip.get_tokenizer(model_name)
            model = model.to(self.device).eval()
            return model, preprocess, tokenizer

        else:  # transformers fallback
            from transformers import CLIPModel, CLIPProcessor
            model = CLIPModel.from_pretrained(self.HF_MODEL).to(self.device).eval()
            processor = CLIPProcessor.from_pretrained(self.HF_MODEL)
            return model, processor, None  # processor handles both image + text

    # ------------------------------------------------------------------
    # Encoding
    # ------------------------------------------------------------------

    @torch.no_grad()
    def _encode_texts(self, texts: List[str]) -> torch.Tensor:
        if _BACKEND == "open_clip":
            tokens = self._tokenizer(texts).to(self.device)
            features = self._model.encode_text(tokens)
        else:
            inputs = self._preprocess(
                text=texts, return_tensors="pt", padding=True, truncation=True
            ).to(self.device)
            features = self._model.get_text_features(**inputs)

        # L2-normalize
        features = features / features.norm(dim=-1, keepdim=True)
        return features.cpu().float()

    @torch.no_grad()
    def _encode_image(self, image_path: str) -> torch.Tensor:
        img = Image.open(image_path).convert("RGB")

        if _BACKEND == "open_clip":
            tensor = self._preprocess(img).unsqueeze(0).to(self.device)
            features = self._model.encode_image(tensor)
        else:
            inputs = self._preprocess(
                images=img, return_tensors="pt"
            ).to(self.device)
            features = self._model.get_image_features(**inputs)

        features = features / features.norm(dim=-1, keepdim=True)
        return features.cpu().float()

    # ------------------------------------------------------------------
    # Classification
    # ------------------------------------------------------------------

    def classify(
        self,
        image_path: str,
        top_k_subcategories: int = 10,
        top_k_categories: int = 5,
    ) -> ClassificationResult:
        """
        Classify an image against the full taxonomy.

        Parameters
        ----------
        image_path : str
            Path to the image file.
        top_k_subcategories : int
            How many top subcategory matches to return.
        top_k_categories : int
            How many top category matches to return.

        Returns
        -------
        ClassificationResult
        """
        image_features = self._encode_image(image_path)

        # Cosine similarity: image (1, D) × text (N, D)^T → (1, N)
        similarities: np.ndarray = (
            (image_features @ self._text_features.T).squeeze(0).numpy()
        )

        # Map prompt index → score
        prompt_scores: Dict[str, float] = {
            prompt: float(similarities[i])
            for i, prompt in enumerate(self._all_prompts)
        }

        # ----------------------------------------------------------
        # Aggregate: for each subcategory, take mean of its prompts
        # ----------------------------------------------------------
        from taxonomy import CATEGORIES, WORKFLOW_STAGE_TAGS

        sub_scores: Dict[str, SubcategoryScore] = {}
        for cat in CATEGORIES:
            for sub in cat.subcategories:
                scores_for_sub = [prompt_scores.get(p, 0.0) for p in sub.prompts]
                max_score = float(np.max(scores_for_sub))
                sub_scores[sub.id] = SubcategoryScore(
                    subcategory_id=sub.id,
                    subcategory_name=sub.name,
                    category_id=cat.id,
                    category_name=cat.name,
                    score=max_score,
                    severity=sub.severity,
                    prompts_used=sub.prompts,
                )

        # Workflow stage scores
        wf_scores: List[SubcategoryScore] = []
        for wf in WORKFLOW_STAGE_TAGS:
            scores_for_wf = [prompt_scores.get(p, 0.0) for p in wf.prompts]
            wf_scores.append(
                SubcategoryScore(
                    subcategory_id=wf.id,
                    subcategory_name=wf.name,
                    category_id="WORKFLOW",
                    category_name="Workflow Stage",
                    score=float(np.max(scores_for_wf)),
                    severity=wf.severity,
                    prompts_used=wf.prompts,
                )
            )

        # Top subcategories (excluding workflow)
        sorted_subs = sorted(
            sub_scores.values(), key=lambda x: x.score, reverse=True
        )
        top_subcategories = sorted_subs[:top_k_subcategories]

        # Top workflow stages
        top_wf = sorted(wf_scores, key=lambda x: x.score, reverse=True)

        # ----------------------------------------------------------
        # Aggregate: for each category, take MAX subcategory score
        # ----------------------------------------------------------
        cat_scores: Dict[str, CategoryScore] = {}
        for cat in CATEGORIES:
            cat_subs = [sub_scores[sub.id] for sub in cat.subcategories]
            best_sub = max(cat_subs, key=lambda x: x.score)
            cat_scores[cat.id] = CategoryScore(
                category_id=cat.id,
                category_name=cat.name,
                score=best_sub.score,
                top_subcategory=best_sub,
            )

        sorted_cats = sorted(
            cat_scores.values(), key=lambda x: x.score, reverse=True
        )
        top_categories = sorted_cats[:top_k_categories]

        # ----------------------------------------------------------
        # Predicted category & severity
        # ----------------------------------------------------------
        predicted_cat = top_categories[0]
        predicted_sub = predicted_cat.top_subcategory

        # Upgrade severity if any safety-critical subcategory scores high
        severity = predicted_sub.severity
        for sub in sorted_subs[:5]:
            if sub.severity == "RED":
                severity = "RED"
                break

        return ClassificationResult(
            image_path=image_path,
            top_categories=top_categories,
            top_subcategories=top_subcategories,
            workflow_stages=top_wf[:3],
            predicted_category_id=predicted_cat.category_id,
            predicted_severity=severity,
            confidence=predicted_cat.score,
            all_scores=prompt_scores,
        )
