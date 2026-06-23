# Samriddhi CLIP Validator

The `clip_validator` is a local AI classification and validation engine for the Samriddhi RWA incident platform. It uses a pre-trained **CLIP (Contrastive Language-Image Pretraining)** model (`ViT-L-14`) to analyze image uploads, match them against a taxonomy of incident categories, and generate structured validation decisions (`ACCEPT`, `FLAG`, or `REJECT`) with confidence scores and safety alerts.

---

## 📁 Repository Contents

- **`classifier.py`**: Handles loading the CLIP model and runs similarity matching between the input image and pre-computed text taxonomy prompt embeddings.
- **`decision_engine.py`**: Executes platform business rules (confidence thresholds, safety critical auto-escalations, and mismatch detections).
- **`taxonomy.py`**: Defines the 15 categories, 149 subcategories, and 456 prompts representing various RWA issues (Waterlogging, Electrical, Lift Breakdown, Fire Safety, etc.).
- **`requirements.txt`**: Minimal Python package dependencies.

---

## 🚀 Setup & Execution

### 1. Prerequisites
Ensure you have **Python 3.12** installed on your system.

### 2. Install Dependencies
Install the required packages in your environment:
```bash
python3.12 -m pip install -r requirements.txt --break-system-packages
```

### 3. Run Validation via CLI
To validate an image directly using the command line:
```bash
python3.12 classifier.py --image path/to/image.jpg --category Waterlogging
```

## 🤖 Responsible & Evident AI Design

This validation system implements **Responsible and Evident AI** concepts by ensuring transparency, explainability, and safety safeguards:

### 1. Evident & Explainable Decisions (No Black Box)
* Rather than providing a simple "yes/no" classification, the system outputs a structured rationale detailing **why** an action was taken.
* The decision engine validates the image against **456 descriptive prompts** mapped to the 15 categories.
* The reasoning is exposed directly in the UI as a clear explanation (e.g. `[CLIP ViT-L-14] Category mismatch: The uploaded image appears to show 'Electrical Hazard', which does not match the reported category. | Decision: REJECT | Confidence: 84%`).

### 2. Guardrails Against Irrelevant Uploads
* The system is explicitly trained to recognize non-incident images (e.g., selfies, random documents, objects, or text screenshots) using the **`CAT015 — Wrong / Irrelevant Upload`** category.
* Any upload matching `CAT015` with a confidence score exceeding `0.20` is immediately rejected.

### 3. Category Mismatch Triage
* If a resident reports a specific issue (e.g., *Waterlogging*) but uploads a completely different image (e.g., *Sparking wires*), the system detects the category mismatch.
* It automatically changes the action to `REJECT` and flags the discrepancy so users can correct the category before submitting.

### 4. Safety-Critical Auto-Escalation
* Dangerous or life-threatening situations (e.g., `CAT004 — Electrical Hazard`, `CAT005 — Fire Safety`, active smoke, or a trapped elevator) are automatically flagged as **Critical (RED)** severity.
* This overrides any default score weights, prompting immediate notifications to the Estate Management Team.
