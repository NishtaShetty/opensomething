"""
taxonomy.py — Samriddhi CLIP Image Validation Taxonomy

Defines all 15 categories (CAT001–CAT015), their subcategories,
and associated CLIP text prompts. Also defines workflow stage tags
and L3 attribute tags.
"""

from dataclasses import dataclass, field
from typing import List, Optional


# ---------------------------------------------------------------------------
# Data Structures
# ---------------------------------------------------------------------------

@dataclass
class Subcategory:
    id: str
    name: str
    prompts: List[str]
    severity: str  # "RED", "YELLOW", "INFO", "REJECT"
    purpose: str


@dataclass
class Category:
    id: str            # e.g. "CAT001"
    name: str          # e.g. "Waterlogging / Flooding"
    subcategories: List[Subcategory] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Workflow Stage Tags
# ---------------------------------------------------------------------------

WORKFLOW_STAGE_TAGS: List[Subcategory] = [
    Subcategory(
        id="WF-01", name="Before Photo",
        prompts=[
            "damage before repair",
            "problem area before vendor arrival",
            "original condition showing issue",
        ],
        severity="INFO", purpose="Pre-repair documentation"
    ),
    Subcategory(
        id="WF-02", name="During Repair",
        prompts=[
            "worker performing repair",
            "technician fixing equipment",
            "active maintenance work in progress",
        ],
        severity="INFO", purpose="Progress tracking"
    ),
    Subcategory(
        id="WF-03", name="After Photo",
        prompts=[
            "area after repair completion",
            "fixed and clean after maintenance",
            "restored to normal condition",
        ],
        severity="INFO", purpose="Post-repair verification"
    ),
    Subcategory(
        id="WF-04", name="QR Code Visible",
        prompts=[
            "QR code visible in photo next to repair site",
            "work order QR code next to incident area",
        ],
        severity="INFO", purpose="Fraud prevention"
    ),
    Subcategory(
        id="WF-05", name="PPE / Safety Gear",
        prompts=[
            "worker wearing gloves and mask",
            "safety helmet on technician",
            "protective equipment during maintenance work",
        ],
        severity="INFO", purpose="Safety compliance"
    ),
]


# ---------------------------------------------------------------------------
# Category Definitions
# ---------------------------------------------------------------------------

CATEGORIES: List[Category] = [

    # ------------------------------------------------------------------ #
    # CAT001 — Waterlogging / Flooding
    # ------------------------------------------------------------------ #
    Category(
        id="CAT001", name="Waterlogging / Flooding",
        subcategories=[
            Subcategory("CAT001-01", "Standing Water",
                prompts=[
                    "standing water on basement floor",
                    "flooded basement parking area",
                    "water puddles on concrete floor",
                    "water accumulated on ground level",
                ],
                severity="YELLOW", purpose="Core detection"),
            Subcategory("CAT001-02", "Submerged Objects",
                prompts=[
                    "cars partially submerged in basement water",
                    "furniture submerged in flood water",
                    "items floating in flooded room",
                ],
                severity="RED", purpose="Property damage"),
            Subcategory("CAT001-03", "Shallow Water Depth",
                prompts=[
                    "thin layer of water on floor",
                    "wet floor with shallow puddles",
                    "damp floor with small water pools",
                ],
                severity="YELLOW", purpose="Minor severity"),
            Subcategory("CAT001-04", "Deep Water Depth",
                prompts=[
                    "knee-deep water in basement",
                    "deep flooding blocking access to area",
                    "basement fully flooded with deep water",
                ],
                severity="RED", purpose="High severity flooding"),
            Subcategory("CAT001-05", "Electrical Hazard Near Water",
                prompts=[
                    "electrical panel near flood water",
                    "exposed wires near standing water",
                    "submerged electrical outlets in water",
                    "electrical switchboard flooded",
                ],
                severity="RED", purpose="Auto-escalation trigger"),
            Subcategory("CAT001-06", "Access Blocked",
                prompts=[
                    "basement entry blocked by water",
                    "stairway flooded preventing access",
                    "ramp submerged in water blocking path",
                ],
                severity="RED", purpose="Access blocked"),
            Subcategory("CAT001-07", "Wall Seepage",
                prompts=[
                    "water seeping through basement wall",
                    "damp patches on concrete wall",
                    "moisture stains on building wall",
                ],
                severity="YELLOW", purpose="Seepage triage"),
            Subcategory("CAT001-08", "Sump Overflow",
                prompts=[
                    "overflowing sump pit",
                    "sump pump area flooded",
                    "water overflowing from underground sump",
                ],
                severity="RED", purpose="Root cause hint"),
            Subcategory("CAT001-09", "Drain Blockage",
                prompts=[
                    "blocked basement drain with debris",
                    "clogged floor drain with water backup",
                    "drain cover with leaves and trash causing blockage",
                ],
                severity="YELLOW", purpose="Root cause hint"),
            Subcategory("CAT001-10", "Pump Failure",
                prompts=[
                    "non-functioning sump pump",
                    "broken water pump in basement",
                    "pump motor in flooded pit",
                ],
                severity="YELLOW", purpose="Root cause hint"),
            Subcategory("CAT001-11", "After Repair",
                prompts=[
                    "dry basement floor after cleanup",
                    "cleaned and drained basement parking",
                    "clear drain after unclogging",
                ],
                severity="INFO", purpose="Post-repair verification"),
        ]
    ),

    # ------------------------------------------------------------------ #
    # CAT002 — Sewage / Drainage
    # ------------------------------------------------------------------ #
    Category(
        id="CAT002", name="Sewage / Drainage",
        subcategories=[
            Subcategory("CAT002-01", "Sewage Overflow",
                prompts=[
                    "sewage overflow from toilet",
                    "sewage water spilling from manhole",
                    "black water overflowing from drain",
                ],
                severity="RED", purpose="Core detection"),
            Subcategory("CAT002-02", "Blocked Toilet",
                prompts=[
                    "clogged toilet with sewage backup",
                    "toilet not flushing with waste visible",
                    "blocked toilet bowl overflowing",
                ],
                severity="RED", purpose="Toilet-specific"),
            Subcategory("CAT002-03", "Shaft Leak",
                prompts=[
                    "sewage leaking from pipe shaft",
                    "dark water dripping from vertical shaft",
                    "stained pipe shaft with sewage drip",
                ],
                severity="RED", purpose="Shaft issue"),
            Subcategory("CAT002-04", "Floor Contamination",
                prompts=[
                    "sewage water on bathroom floor",
                    "contaminated floor with dark foul water",
                    "black water pooling on tile floor",
                ],
                severity="RED", purpose="Health hazard"),
            Subcategory("CAT002-05", "Wall Stain",
                prompts=[
                    "sewage stain on wall near pipe",
                    "brown stain from leaking sewage pipe",
                    "discolored wall from sewage seepage",
                ],
                severity="YELLOW", purpose="Recurring indicator"),
            Subcategory("CAT002-06", "Manhole Issue",
                prompts=[
                    "open manhole with sewage visible",
                    "overflowing manhole cover",
                    "sewage bubbling from manhole",
                ],
                severity="RED", purpose="External infrastructure"),
            Subcategory("CAT002-07", "Pipe Damage",
                prompts=[
                    "cracked sewage pipe",
                    "broken PVC pipe with sewage leak",
                    "corroded cast iron sewage pipe",
                ],
                severity="YELLOW", purpose="Root cause — pipe"),
            Subcategory("CAT002-08", "Grease Buildup",
                prompts=[
                    "grease-clogged drain pipe",
                    "fatty deposit in sewage line",
                    "grease trap overflowing",
                ],
                severity="YELLOW", purpose="Root cause — grease"),
            Subcategory("CAT002-09", "Tree Root Infiltration",
                prompts=[
                    "tree roots inside broken pipe",
                    "root growth cracking sewage pipe",
                    "roots blocking underground drainage pipe",
                ],
                severity="YELLOW", purpose="Root cause — roots"),
            Subcategory("CAT002-10", "Open Drain / Gutter",
                prompts=[
                    "open storm drain with debris",
                    "uncovered drainage gutter with stagnant water",
                    "clogged open drain in compound",
                ],
                severity="YELLOW", purpose="Drainage infrastructure"),
            Subcategory("CAT002-11", "Cleanup In Progress",
                prompts=[
                    "worker cleaning sewage spill with PPE",
                    "mopping sewage contaminated floor",
                    "disinfecting area after sewage leak",
                ],
                severity="INFO", purpose="Housekeeping tracking"),
            Subcategory("CAT002-12", "After Repair",
                prompts=[
                    "clean toilet after repair",
                    "clear flowing drain after unclogging",
                    "repaired pipe shaft with no leaks",
                ],
                severity="INFO", purpose="Post-repair verification"),
        ]
    ),

    # ------------------------------------------------------------------ #
    # CAT003 — Plumbing Leakage
    # ------------------------------------------------------------------ #
    Category(
        id="CAT003", name="Plumbing Leakage",
        subcategories=[
            Subcategory("CAT003-01", "Pipe Leak",
                prompts=[
                    "water leaking from pipe joint",
                    "dripping pipe under sink",
                    "burst pipe spraying water",
                ],
                severity="YELLOW", purpose="Core detection"),
            Subcategory("CAT003-02", "Tap / Faucet Leak",
                prompts=[
                    "dripping tap",
                    "leaking faucet handle",
                    "water dripping continuously from kitchen tap",
                ],
                severity="YELLOW", purpose="Minor plumbing"),
            Subcategory("CAT003-03", "Ceiling Leak",
                prompts=[
                    "water dripping from ceiling",
                    "water stain on ceiling from leak above",
                    "wet ceiling with active water drip",
                ],
                severity="RED", purpose="Cross-floor impact"),
            Subcategory("CAT003-04", "Wall Leak",
                prompts=[
                    "water seeping through wall from pipe",
                    "wet patch on wall from hidden pipe leak",
                    "bubbling paint from wall moisture",
                ],
                severity="YELLOW", purpose="Hidden leak"),
            Subcategory("CAT003-05", "Water Heater / Geyser Leak",
                prompts=[
                    "leaking water heater",
                    "geyser dripping from bottom",
                    "water pooling under geyser",
                ],
                severity="YELLOW", purpose="Appliance"),
            Subcategory("CAT003-06", "Toilet Tank Leak",
                prompts=[
                    "toilet cistern leaking at base",
                    "water running continuously from toilet tank",
                    "cracked toilet flush tank",
                ],
                severity="YELLOW", purpose="Toilet plumbing"),
            Subcategory("CAT003-07", "Water Meter / Valve Leak",
                prompts=[
                    "leaking water meter",
                    "water dripping from main valve",
                    "corroded shut-off valve with leak",
                ],
                severity="YELLOW", purpose="Infrastructure"),
            Subcategory("CAT003-08", "Overhead Tank Overflow",
                prompts=[
                    "rooftop water tank overflowing",
                    "overhead tank spilling water down building",
                    "water running down building exterior from tank",
                ],
                severity="RED", purpose="Building-level issue"),
            Subcategory("CAT003-09", "Wet Floor from Leak",
                prompts=[
                    "wet floor from plumbing leak",
                    "water trail on floor from pipe",
                    "puddle forming under leaking pipe",
                ],
                severity="YELLOW", purpose="Slip hazard"),
            Subcategory("CAT003-10", "After Repair",
                prompts=[
                    "repaired pipe joint with no leak",
                    "new tap installed",
                    "dry ceiling after leak repair",
                ],
                severity="INFO", purpose="Post-repair verification"),
        ]
    ),

    # ------------------------------------------------------------------ #
    # CAT004 — Electrical Hazard
    # ------------------------------------------------------------------ #
    Category(
        id="CAT004", name="Electrical Hazard",
        subcategories=[
            Subcategory("CAT004-01", "Exposed Wiring",
                prompts=[
                    "exposed electrical wires in common area",
                    "dangling wires from ceiling",
                    "unshielded cables hanging from wall",
                ],
                severity="RED", purpose="Safety hazard"),
            Subcategory("CAT004-02", "Sparking / Arcing",
                prompts=[
                    "electrical sparking from outlet",
                    "sparks from switch board",
                    "arcing at electrical junction box",
                ],
                severity="RED", purpose="Fire risk"),
            Subcategory("CAT004-03", "Burnt / Melted Components",
                prompts=[
                    "burnt electrical switch",
                    "melted wire insulation",
                    "charred circuit breaker",
                    "blackened electrical panel",
                ],
                severity="RED", purpose="Fire risk"),
            Subcategory("CAT004-04", "Damaged Switch / Socket",
                prompts=[
                    "broken electrical switch plate",
                    "cracked power outlet",
                    "loose socket hanging from wall",
                ],
                severity="YELLOW", purpose="Minor damage"),
            Subcategory("CAT004-05", "Tripped Breaker / MCB",
                prompts=[
                    "tripped MCB in electrical panel",
                    "circuit breaker in off position",
                    "electrical panel with tripped switches",
                ],
                severity="YELLOW", purpose="Diagnostic"),
            Subcategory("CAT004-06", "Outdoor Lighting Failure",
                prompts=[
                    "non-working street light in compound",
                    "dark parking area with broken light",
                    "failed outdoor lighting pole",
                ],
                severity="YELLOW", purpose="Security concern"),
            Subcategory("CAT004-07", "Common Area Lighting Failure",
                prompts=[
                    "non-working light in corridor",
                    "dark stairwell with broken light",
                    "flickering tube light in lobby",
                ],
                severity="YELLOW", purpose="Maintenance"),
            Subcategory("CAT004-08", "Water Near Electrical",
                prompts=[
                    "water pooling near electrical panel",
                    "wet floor under switch board",
                    "rain water leaking onto electrical box",
                ],
                severity="RED", purpose="Auto-escalate"),
            Subcategory("CAT004-09", "Generator / DG Set Issue",
                prompts=[
                    "smoking diesel generator",
                    "leaking DG set",
                    "generator with visible damage or burning smell",
                ],
                severity="RED", purpose="Infrastructure"),
            Subcategory("CAT004-10", "Transformer Issue",
                prompts=[
                    "damaged society transformer",
                    "oil leaking from transformer",
                    "transformer with visible burn marks",
                ],
                severity="RED", purpose="Utility-level"),
            Subcategory("CAT004-11", "After Repair",
                prompts=[
                    "repaired electrical panel",
                    "new wiring installed properly",
                    "fixed switch board with cover on",
                ],
                severity="INFO", purpose="Post-repair verification"),
        ]
    ),

    # ------------------------------------------------------------------ #
    # CAT005 — Fire / Smoke
    # ------------------------------------------------------------------ #
    Category(
        id="CAT005", name="Fire / Smoke",
        subcategories=[
            Subcategory("CAT005-01", "Active Fire",
                prompts=[
                    "fire burning in building",
                    "flames visible in room",
                    "active fire in electrical panel",
                ],
                severity="RED", purpose="Emergency"),
            Subcategory("CAT005-02", "Smoke",
                prompts=[
                    "smoke coming from room",
                    "thick smoke in corridor",
                    "smoke billowing from building window",
                ],
                severity="RED", purpose="Emergency"),
            Subcategory("CAT005-03", "Burnt Area / Fire Damage",
                prompts=[
                    "fire-damaged room",
                    "charred walls after fire",
                    "burnt furniture and debris",
                ],
                severity="RED", purpose="Post-incident documentation"),
            Subcategory("CAT005-04", "Electrical Fire",
                prompts=[
                    "fire from short circuit",
                    "burning electrical panel",
                    "flames from overloaded outlet",
                ],
                severity="RED", purpose="Type-specific"),
            Subcategory("CAT005-05", "Kitchen Fire",
                prompts=[
                    "cooking fire in kitchen",
                    "oil fire on stove",
                    "kitchen area with fire damage",
                ],
                severity="RED", purpose="Type-specific"),
            Subcategory("CAT005-06", "Gas Leak Indicator",
                prompts=[
                    "gas cylinder with visible damage",
                    "hissing gas pipe connection",
                    "gas leak detector alarm triggered",
                ],
                severity="RED", purpose="Pre-fire hazard"),
            Subcategory("CAT005-07", "Fire Extinguisher Issue",
                prompts=[
                    "empty fire extinguisher",
                    "expired fire extinguisher",
                    "missing fire extinguisher from holder",
                ],
                severity="YELLOW", purpose="Safety compliance"),
            Subcategory("CAT005-08", "Fire Alarm / Detector",
                prompts=[
                    "fire alarm pulled",
                    "smoke detector triggered",
                    "fire safety panel showing alarm",
                ],
                severity="RED", purpose="Detection evidence"),
            Subcategory("CAT005-09", "Burn Marks / Scorch",
                prompts=[
                    "scorch marks on wall",
                    "burn marks on ceiling",
                    "heat damage on surface without active fire",
                ],
                severity="YELLOW", purpose="Evidence of past incident"),
            Subcategory("CAT005-10", "After Repair",
                prompts=[
                    "repaired area after fire damage",
                    "newly painted wall after fire restoration",
                    "replaced electrical panel after fire",
                ],
                severity="INFO", purpose="Post-repair verification"),
        ]
    ),

    # ------------------------------------------------------------------ #
    # CAT006 — Structural Damage
    # ------------------------------------------------------------------ #
    Category(
        id="CAT006", name="Structural Damage",
        subcategories=[
            Subcategory("CAT006-01", "Wall Crack",
                prompts=[
                    "crack in building wall",
                    "hairline crack on plastered wall",
                    "large structural crack in concrete wall",
                ],
                severity="YELLOW", purpose="Core detection"),
            Subcategory("CAT006-02", "Ceiling Crack / Collapse",
                prompts=[
                    "crack on ceiling",
                    "ceiling plaster falling",
                    "collapsed ceiling section",
                    "sagging ceiling",
                ],
                severity="RED", purpose="Active collapse risk"),
            Subcategory("CAT006-03", "Floor Crack / Damage",
                prompts=[
                    "cracked floor tile",
                    "broken concrete floor",
                    "sunken floor section",
                ],
                severity="YELLOW", purpose="Floor damage"),
            Subcategory("CAT006-04", "Column / Beam Damage",
                prompts=[
                    "cracked concrete pillar",
                    "exposed rebar in beam",
                    "damaged support column",
                ],
                severity="RED", purpose="Structural integrity"),
            Subcategory("CAT006-05", "Railing / Parapet Damage",
                prompts=[
                    "broken balcony railing",
                    "damaged staircase handrail",
                    "collapsed parapet wall",
                ],
                severity="RED", purpose="Fall hazard"),
            Subcategory("CAT006-06", "Slab Leakage",
                prompts=[
                    "water seeping through concrete slab",
                    "wet ceiling from slab above",
                    "slab waterproofing failure",
                ],
                severity="YELLOW", purpose="Cross-floor"),
            Subcategory("CAT006-07", "Tile Dislodgement",
                prompts=[
                    "loose wall tile",
                    "fallen tiles on floor",
                    "broken tile on building exterior",
                ],
                severity="YELLOW", purpose="Maintenance"),
            Subcategory("CAT006-08", "Door / Window Frame Damage",
                prompts=[
                    "broken door frame",
                    "damaged window frame",
                    "cracked glass in window",
                ],
                severity="YELLOW", purpose="Minor damage"),
            Subcategory("CAT006-09", "Foundation Issue",
                prompts=[
                    "visible foundation crack",
                    "sinking ground near building base",
                    "water erosion around building foundation",
                ],
                severity="RED", purpose="Critical"),
            Subcategory("CAT006-10", "Plaster Peeling / Spalling",
                prompts=[
                    "peeling paint and plaster on wall",
                    "concrete spalling exposing rebar",
                    "deteriorating building exterior",
                ],
                severity="YELLOW", purpose="Maintenance"),
            Subcategory("CAT006-11", "After Repair",
                prompts=[
                    "repaired wall crack with new plaster",
                    "fixed railing",
                    "new tiles installed after damage",
                ],
                severity="INFO", purpose="Post-repair verification"),
        ]
    ),

    # ------------------------------------------------------------------ #
    # CAT007 — Lift / Elevator
    # ------------------------------------------------------------------ #
    Category(
        id="CAT007", name="Lift / Elevator",
        subcategories=[
            Subcategory("CAT007-01", "Stuck / Trapped",
                prompts=[
                    "person stuck in elevator",
                    "elevator doors not opening with person inside",
                    "lift stopped between floors",
                ],
                severity="RED", purpose="Emergency"),
            Subcategory("CAT007-02", "Door Malfunction",
                prompts=[
                    "elevator door not closing properly",
                    "lift door jammed open",
                    "damaged elevator door track",
                ],
                severity="YELLOW", purpose="Door issue"),
            Subcategory("CAT007-03", "Unusual Noise / Vibration",
                prompts=[
                    "elevator making grinding noise",
                    "lift shaking during operation",
                    "elevator cable noise issue",
                ],
                severity="YELLOW", purpose="Diagnostic"),
            Subcategory("CAT007-04", "Display / Button Failure",
                prompts=[
                    "elevator display not working",
                    "broken lift call button",
                    "non-responsive elevator panel",
                ],
                severity="YELLOW", purpose="UI failure"),
            Subcategory("CAT007-05", "Water in Elevator",
                prompts=[
                    "water leaking into elevator shaft",
                    "wet elevator floor",
                    "water dripping inside lift",
                ],
                severity="RED", purpose="Electrical + water"),
            Subcategory("CAT007-06", "Misalignment",
                prompts=[
                    "elevator not level with floor",
                    "lift stopping above or below floor level",
                    "gap between lift and landing",
                ],
                severity="RED", purpose="Safety hazard"),
            Subcategory("CAT007-07", "Out of Service",
                prompts=[
                    "elevator out of order sign",
                    "lift maintenance in progress",
                    "elevator shut down notice",
                ],
                severity="INFO", purpose="Information"),
            Subcategory("CAT007-08", "Interior Damage",
                prompts=[
                    "scratched elevator interior",
                    "damaged lift mirror",
                    "broken elevator handrail",
                    "vandalized lift interior",
                ],
                severity="YELLOW", purpose="Vandalism / wear"),
            Subcategory("CAT007-09", "Shaft / Machinery",
                prompts=[
                    "elevator motor room",
                    "lift shaft visible",
                    "elevator cable and pulley system",
                ],
                severity="INFO", purpose="Maintenance evidence"),
            Subcategory("CAT007-10", "After Repair",
                prompts=[
                    "elevator back in service",
                    "repaired lift door mechanism",
                    "new elevator panel installed",
                ],
                severity="INFO", purpose="Post-repair verification"),
        ]
    ),

    # ------------------------------------------------------------------ #
    # CAT008 — Waste Management
    # ------------------------------------------------------------------ #
    Category(
        id="CAT008", name="Waste Management",
        subcategories=[
            Subcategory("CAT008-01", "Overflowing Dustbin",
                prompts=[
                    "overflowing garbage bin",
                    "trash spilling from dustbin",
                    "full community waste bin with garbage on ground",
                ],
                severity="YELLOW", purpose="Core detection"),
            Subcategory("CAT008-02", "Improper Waste Dumping",
                prompts=[
                    "garbage dumped in open area",
                    "waste thrown near building",
                    "littering in common area",
                ],
                severity="YELLOW", purpose="Violation"),
            Subcategory("CAT008-03", "Garbage Collection Missed",
                prompts=[
                    "uncollected garbage bags piled up",
                    "full dumpster not emptied",
                    "waste not picked up on schedule",
                ],
                severity="YELLOW", purpose="SLA tracking"),
            Subcategory("CAT008-04", "Construction Debris",
                prompts=[
                    "construction rubble dumped in compound",
                    "concrete debris near building",
                    "renovation waste in common area",
                ],
                severity="YELLOW", purpose="Type-specific"),
            Subcategory("CAT008-05", "Wet Waste / Organic Rot",
                prompts=[
                    "rotting food waste in open",
                    "foul-smelling organic waste",
                    "decomposing garbage attracting flies",
                ],
                severity="RED", purpose="Health hazard"),
            Subcategory("CAT008-06", "Hazardous Waste",
                prompts=[
                    "electronic waste dumped openly",
                    "chemical containers in garbage",
                    "medical waste in common bin",
                ],
                severity="RED", purpose="Special handling"),
            Subcategory("CAT008-07", "Damaged Waste Bin",
                prompts=[
                    "broken dustbin lid",
                    "cracked garbage container",
                    "damaged waste segregation bin",
                ],
                severity="YELLOW", purpose="Infrastructure"),
            Subcategory("CAT008-08", "Waste Segregation Violation",
                prompts=[
                    "mixed waste in segregated bins",
                    "dry waste in wet waste bin",
                    "recyclables in general waste bin",
                ],
                severity="YELLOW", purpose="Compliance"),
            Subcategory("CAT008-09", "Bulk Waste / Large Items",
                prompts=[
                    "abandoned sofa near dumpster",
                    "old mattress dumped in compound",
                    "large appliance left in common area",
                ],
                severity="YELLOW", purpose="Special pickup"),
            Subcategory("CAT008-10", "After Cleanup",
                prompts=[
                    "clean area after garbage removal",
                    "empty and cleaned dustbin",
                    "cleared construction debris area",
                ],
                severity="INFO", purpose="Post-action verification"),
        ]
    ),

    # ------------------------------------------------------------------ #
    # CAT009 — Pest Infestation
    # ------------------------------------------------------------------ #
    Category(
        id="CAT009", name="Pest Infestation",
        subcategories=[
            Subcategory("CAT009-01", "Cockroach Infestation",
                prompts=[
                    "cockroaches in kitchen",
                    "cockroach nest in drain area",
                    "multiple cockroaches on wall",
                ],
                severity="YELLOW", purpose="Core detection"),
            Subcategory("CAT009-02", "Rodent / Rat",
                prompts=[
                    "rat in building common area",
                    "mouse droppings on floor",
                    "rodent damage on wires",
                    "rat burrow near building",
                ],
                severity="RED", purpose="Health + electrical risk"),
            Subcategory("CAT009-03", "Mosquito Breeding",
                prompts=[
                    "stagnant water with mosquito larvae",
                    "mosquito breeding in flower pot",
                    "waterlogged area with mosquitoes",
                ],
                severity="RED", purpose="Health hazard"),
            Subcategory("CAT009-04", "Ant Infestation",
                prompts=[
                    "ant trail on wall",
                    "ant colony near building",
                    "ants swarming food area",
                ],
                severity="YELLOW", purpose="Minor pest"),
            Subcategory("CAT009-05", "Termite Damage",
                prompts=[
                    "termite damage on wooden door",
                    "termite mud tubes on wall",
                    "termite-infested furniture",
                ],
                severity="YELLOW", purpose="Property damage"),
            Subcategory("CAT009-06", "Bee / Wasp Nest",
                prompts=[
                    "beehive on building exterior",
                    "wasp nest on balcony",
                    "honeybee colony on building wall",
                ],
                severity="RED", purpose="Safety hazard"),
            Subcategory("CAT009-07", "Snake Sighting",
                prompts=[
                    "snake in garden area",
                    "snake in basement parking",
                    "snake near building entrance",
                ],
                severity="RED", purpose="Safety"),
            Subcategory("CAT009-08", "Bird Nuisance",
                prompts=[
                    "pigeon droppings on balcony",
                    "bird nest blocking drain",
                    "pigeon nesting on building ledge",
                ],
                severity="YELLOW", purpose="Nuisance"),
            Subcategory("CAT009-09", "Stray Animal",
                prompts=[
                    "stray dog in compound",
                    "stray cat in parking area",
                    "stray animals near garbage bins",
                ],
                severity="YELLOW", purpose="Safety / hygiene"),
            Subcategory("CAT009-10", "After Treatment",
                prompts=[
                    "pest control spray being applied",
                    "fumigation in progress",
                    "area after pest treatment completion",
                ],
                severity="INFO", purpose="Post-treatment verification"),
        ]
    ),

    # ------------------------------------------------------------------ #
    # CAT010 — Housekeeping Issue
    # ------------------------------------------------------------------ #
    Category(
        id="CAT010", name="Housekeeping Issue",
        subcategories=[
            Subcategory("CAT010-01", "Dirty Common Area",
                prompts=[
                    "dirty lobby floor",
                    "dusty corridor",
                    "unclean building entrance",
                    "grimy staircase",
                ],
                severity="YELLOW", purpose="Core detection"),
            Subcategory("CAT010-02", "Dirty Restroom",
                prompts=[
                    "unclean public toilet",
                    "dirty washroom mirror and basin",
                    "unhygienic community restroom",
                ],
                severity="YELLOW", purpose="Health / hygiene"),
            Subcategory("CAT010-03", "Stagnant Water (Non-flood)",
                prompts=[
                    "small puddle in corridor from mopping",
                    "water left on stairs after cleaning",
                    "stagnant water in planter tray",
                ],
                severity="YELLOW", purpose="Slip hazard"),
            Subcategory("CAT010-04", "Cobwebs / Dust Accumulation",
                prompts=[
                    "cobwebs in ceiling corner",
                    "thick dust on light fixtures",
                    "dusty window sills in corridor",
                ],
                severity="YELLOW", purpose="Neglected maintenance"),
            Subcategory("CAT010-05", "Stained Walls / Surfaces",
                prompts=[
                    "paan stain on building wall",
                    "graffiti on common wall",
                    "stained elevator wall",
                ],
                severity="YELLOW", purpose="Cleanliness"),
            Subcategory("CAT010-06", "Foul Odor Area",
                prompts=[
                    "garbage area with visible flies",
                    "wet mop left standing creating odor",
                    "stagnant water near drain",
                ],
                severity="YELLOW", purpose="Odor evidence"),
            Subcategory("CAT010-07", "Cleaning Equipment Issue",
                prompts=[
                    "broken mop in cleaning area",
                    "empty cleaning supply shelf",
                    "damaged vacuum cleaner",
                ],
                severity="YELLOW", purpose="Resource tracking"),
            Subcategory("CAT010-08", "After Cleaning",
                prompts=[
                    "freshly mopped clean floor",
                    "sparkling clean lobby",
                    "clean restroom after maintenance",
                ],
                severity="INFO", purpose="Post-action verification"),
        ]
    ),

    # ------------------------------------------------------------------ #
    # CAT011 — Security Incident
    # ------------------------------------------------------------------ #
    Category(
        id="CAT011", name="Security Incident",
        subcategories=[
            Subcategory("CAT011-01", "Broken Gate / Barrier",
                prompts=[
                    "broken compound gate",
                    "damaged boom barrier at parking entrance",
                    "forced-open society gate",
                ],
                severity="RED", purpose="Perimeter breach"),
            Subcategory("CAT011-02", "Broken Lock / Access Control",
                prompts=[
                    "broken door lock on common room",
                    "damaged access card reader",
                    "forced open letterbox",
                ],
                severity="RED", purpose="Security compromise"),
            Subcategory("CAT011-03", "Vandalism",
                prompts=[
                    "vandalized building wall",
                    "broken glass in common area",
                    "graffiti or property defacement",
                ],
                severity="YELLOW", purpose="Property damage"),
            Subcategory("CAT011-04", "CCTV Issue",
                prompts=[
                    "damaged CCTV camera",
                    "CCTV camera tilted or displaced",
                    "broken security camera",
                ],
                severity="RED", purpose="Surveillance gap"),
            Subcategory("CAT011-05", "Trespassing Evidence",
                prompts=[
                    "cut fence in compound wall",
                    "unauthorized entry marks at boundary",
                    "broken compound wall section",
                ],
                severity="RED", purpose="Perimeter breach"),
            Subcategory("CAT011-06", "Suspicious Object",
                prompts=[
                    "unattended bag in common area",
                    "suspicious package near entrance",
                    "unknown item left in parking",
                ],
                severity="RED", purpose="Emergency"),
            Subcategory("CAT011-07", "Guard Post Issue",
                prompts=[
                    "empty security guard booth",
                    "damaged guard post",
                    "security booth without equipment",
                ],
                severity="YELLOW", purpose="SLA compliance"),
            Subcategory("CAT011-08", "Unauthorized Parking",
                prompts=[
                    "unknown vehicle parked in reserved spot",
                    "unauthorized car inside compound",
                    "unfamiliar vehicle blocking entrance",
                ],
                severity="YELLOW", purpose="Violation"),
            Subcategory("CAT011-09", "Fire Safety Tampering",
                prompts=[
                    "tampered fire hose reel",
                    "missing fire extinguisher from post",
                    "broken fire alarm glass",
                ],
                severity="RED", purpose="Safety compliance"),
            Subcategory("CAT011-10", "After Resolution",
                prompts=[
                    "repaired gate",
                    "new lock installed",
                    "restored CCTV camera",
                ],
                severity="INFO", purpose="Post-action verification"),
        ]
    ),

    # ------------------------------------------------------------------ #
    # CAT012 — Parking Issue
    # ------------------------------------------------------------------ #
    Category(
        id="CAT012", name="Parking Issue",
        subcategories=[
            Subcategory("CAT012-01", "Wrong Parking / Encroachment",
                prompts=[
                    "car parked in someone else's spot",
                    "vehicle blocking another car",
                    "double parking in basement",
                ],
                severity="YELLOW", purpose="Core detection"),
            Subcategory("CAT012-02", "Damaged Parking Infrastructure",
                prompts=[
                    "broken parking bollard",
                    "cracked speed bump",
                    "damaged parking lot curb",
                ],
                severity="YELLOW", purpose="Infrastructure"),
            Subcategory("CAT012-03", "Parking Light Failure",
                prompts=[
                    "dark parking area with broken light",
                    "non-working basement parking light",
                    "dim parking lot without illumination",
                ],
                severity="YELLOW", purpose="Safety"),
            Subcategory("CAT012-04", "Vehicle Damage in Parking",
                prompts=[
                    "scratched car in parking",
                    "dented vehicle in basement",
                    "vehicle with damage in parking area",
                ],
                severity="YELLOW", purpose="Documentation"),
            Subcategory("CAT012-05", "Abandoned Vehicle",
                prompts=[
                    "dust-covered abandoned car",
                    "vehicle with flat tires left for months",
                    "abandoned two-wheeler in parking",
                ],
                severity="YELLOW", purpose="Action needed"),
            Subcategory("CAT012-06", "EV Charging Station Issue",
                prompts=[
                    "damaged electric vehicle charging station",
                    "non-working EV charger",
                    "EV charging cable damage",
                ],
                severity="YELLOW", purpose="Infrastructure"),
            Subcategory("CAT012-07", "Parking Floor Damage",
                prompts=[
                    "cracked parking floor",
                    "pothole in parking area",
                    "uneven basement parking surface",
                ],
                severity="YELLOW", purpose="Structural"),
            Subcategory("CAT012-08", "After Resolution",
                prompts=[
                    "cleared parking spot",
                    "repaired parking bollard",
                    "working parking light restored",
                ],
                severity="INFO", purpose="Post-action verification"),
        ]
    ),

    # ------------------------------------------------------------------ #
    # CAT013 — Landscape / Gardening
    # ------------------------------------------------------------------ #
    Category(
        id="CAT013", name="Landscape / Gardening",
        subcategories=[
            Subcategory("CAT013-01", "Overgrown Vegetation",
                prompts=[
                    "overgrown grass in compound",
                    "untrimmed hedges blocking pathway",
                    "wild bushes overgrown in garden",
                ],
                severity="YELLOW", purpose="Core detection"),
            Subcategory("CAT013-02", "Dead / Dying Plants",
                prompts=[
                    "dead plants in garden bed",
                    "dried-up shrubs in compound",
                    "dying tree in society",
                ],
                severity="YELLOW", purpose="Maintenance"),
            Subcategory("CAT013-03", "Fallen Tree / Branch",
                prompts=[
                    "fallen tree blocking path",
                    "large branch fallen on car",
                    "broken tree branch on road",
                ],
                severity="RED", purpose="Access blocked"),
            Subcategory("CAT013-04", "Irrigation Issue",
                prompts=[
                    "broken sprinkler head",
                    "leaking garden pipe",
                    "dry patches in lawn from no water",
                ],
                severity="YELLOW", purpose="Infrastructure"),
            Subcategory("CAT013-05", "Garden Path Damage",
                prompts=[
                    "broken garden pathway tiles",
                    "cracked walking path in garden",
                    "uneven garden walkway",
                ],
                severity="YELLOW", purpose="Safety hazard"),
            Subcategory("CAT013-06", "Unauthorized Planting",
                prompts=[
                    "personal garden in common area",
                    "pots blocking common pathway",
                    "unauthorized plantation in compound",
                ],
                severity="YELLOW", purpose="Violation"),
            Subcategory("CAT013-07", "Soil Erosion",
                prompts=[
                    "soil erosion in garden slope",
                    "exposed roots from soil washout",
                    "mudslide in compound garden",
                ],
                severity="YELLOW", purpose="Structural risk"),
            Subcategory("CAT013-08", "After Maintenance",
                prompts=[
                    "freshly trimmed garden",
                    "newly planted flower beds",
                    "cleaned garden pathway",
                ],
                severity="INFO", purpose="Post-action verification"),
        ]
    ),

    # ------------------------------------------------------------------ #
    # CAT014 — Common Area Damage
    # ------------------------------------------------------------------ #
    Category(
        id="CAT014", name="Common Area Damage",
        subcategories=[
            Subcategory("CAT014-01", "Damaged Furniture",
                prompts=[
                    "broken bench in common area",
                    "damaged clubhouse furniture",
                    "torn seating in community hall",
                ],
                severity="YELLOW", purpose="Core detection"),
            Subcategory("CAT014-02", "Broken Playground Equipment",
                prompts=[
                    "broken swing in children's play area",
                    "damaged slide in playground",
                    "unsafe playground equipment for children",
                ],
                severity="RED", purpose="Child safety"),
            Subcategory("CAT014-03", "Swimming Pool Issue",
                prompts=[
                    "green algae in swimming pool",
                    "cracked pool tiles",
                    "non-functioning pool pump",
                    "dirty pool water",
                ],
                severity="RED", purpose="Health / safety"),
            Subcategory("CAT014-04", "Gym Equipment Damage",
                prompts=[
                    "broken gym treadmill",
                    "damaged gym equipment",
                    "torn gym bench upholstery",
                ],
                severity="YELLOW", purpose="Minor damage"),
            Subcategory("CAT014-05", "Community Hall Damage",
                prompts=[
                    "damaged community hall floor",
                    "broken stage in function hall",
                    "ceiling damage in community center",
                ],
                severity="YELLOW", purpose="Minor damage"),
            Subcategory("CAT014-06", "Signage Damage",
                prompts=[
                    "broken society name board",
                    "damaged directional sign",
                    "faded or fallen notice board",
                ],
                severity="YELLOW", purpose="Aesthetic"),
            Subcategory("CAT014-07", "Pathway / Walkway Damage",
                prompts=[
                    "cracked compound walkway",
                    "broken paver tiles on path",
                    "uneven footpath in compound",
                ],
                severity="YELLOW", purpose="Trip hazard"),
            Subcategory("CAT014-08", "Boundary Wall Damage",
                prompts=[
                    "cracked compound wall",
                    "damaged boundary wall section",
                    "leaning compound wall",
                ],
                severity="RED", purpose="Security + structural"),
            Subcategory("CAT014-09", "Water Feature / Fountain Issue",
                prompts=[
                    "non-working fountain",
                    "green algae in decorative pond",
                    "broken water feature pump",
                ],
                severity="YELLOW", purpose="Aesthetic"),
            Subcategory("CAT014-10", "After Repair",
                prompts=[
                    "repaired playground equipment",
                    "fixed gym machine",
                    "restored community hall",
                ],
                severity="INFO", purpose="Post-action verification"),
        ]
    ),

    # ------------------------------------------------------------------ #
    # CAT015 — Wrong / Irrelevant Upload
    # ------------------------------------------------------------------ #
    Category(
        id="CAT015", name="Wrong / Irrelevant Upload",
        subcategories=[
            Subcategory("CAT015-01", "Selfie / Portrait",
                prompts=[
                    "person taking selfie",
                    "face close-up photo",
                    "group photo of people posing",
                ],
                severity="REJECT", purpose="Spam"),
            Subcategory("CAT015-02", "Screenshot",
                prompts=[
                    "phone screenshot of WhatsApp chat",
                    "screenshot of text message",
                    "screen capture of social media",
                ],
                severity="REJECT", purpose="Wrong upload"),
            Subcategory("CAT015-03", "Meme / Joke",
                prompts=[
                    "internet meme image",
                    "funny cartoon picture",
                    "social media joke image",
                ],
                severity="REJECT", purpose="Spam"),
            Subcategory("CAT015-04", "Unrelated Outdoor",
                prompts=[
                    "beach landscape photo",
                    "mountain scenery",
                    "city traffic photo",
                    "sunset sky",
                ],
                severity="REJECT", purpose="Irrelevant"),
            Subcategory("CAT015-05", "Unrelated Indoor",
                prompts=[
                    "restaurant food photo",
                    "living room interior design",
                    "bedroom photo",
                ],
                severity="REJECT", purpose="Irrelevant"),
            Subcategory("CAT015-06", "Document / Receipt",
                prompts=[
                    "paper document photo",
                    "printed bill or receipt",
                    "invoice photo",
                    "visiting card",
                ],
                severity="REJECT", purpose="Wrong type"),
            Subcategory("CAT015-07", "Blurry / Black / Unusable",
                prompts=[
                    "completely blurry photo",
                    "pitch black image",
                    "accidental photo of pocket or floor",
                ],
                severity="REJECT", purpose="Quality rejection"),
            Subcategory("CAT015-08", "Random Object",
                prompts=[
                    "close-up of random household object",
                    "photo of phone screen",
                    "picture of food plate",
                ],
                severity="REJECT", purpose="Irrelevant"),
            Subcategory("CAT015-09", "Duplicate / Recycled",
                prompts=[
                    "photo with visible old date watermark",
                    "stock image with watermark",
                ],
                severity="REJECT", purpose="Fraud detection"),
            Subcategory("CAT015-10", "Promotional / Ad",
                prompts=[
                    "advertisement poster",
                    "product promotion image",
                    "commercial flyer photo",
                ],
                severity="REJECT", purpose="Spam"),
        ]
    ),
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_all_prompts() -> List[str]:
    """Return a flat list of all prompts across all categories."""
    prompts = []
    for cat in CATEGORIES:
        for sub in cat.subcategories:
            prompts.extend(sub.prompts)
    return prompts


def get_category_by_id(cat_id: str) -> Optional[Category]:
    for cat in CATEGORIES:
        if cat.id == cat_id:
            return cat
    return None


def get_subcategory_by_id(sub_id: str) -> Optional[Subcategory]:
    for cat in CATEGORIES:
        for sub in cat.subcategories:
            if sub.id == sub_id:
                return sub
    return None


def build_prompt_to_subcategory_map() -> dict:
    """Returns {prompt_text: subcategory} for all subcategories."""
    mapping = {}
    for cat in CATEGORIES:
        for sub in cat.subcategories:
            for prompt in sub.prompts:
                mapping[prompt] = sub
    # Also include workflow tags
    for wf in WORKFLOW_STAGE_TAGS:
        for prompt in wf.prompts:
            mapping[prompt] = wf
    return mapping


def build_subcategory_to_category_map() -> dict:
    """Returns {subcategory_id: category} for all subcategories."""
    mapping = {}
    for cat in CATEGORIES:
        for sub in cat.subcategories:
            mapping[sub.id] = cat
    return mapping
