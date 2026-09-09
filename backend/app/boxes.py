"""In-memory deployment-wide Box Inventory and reusable box fixtures."""

from __future__ import annotations

from app.models import BoxType, BoxTypeUpdate

# Solver test fixtures only; these do not bootstrap production inventory.
# Chosen so portal.to_contract yields the fixture inner_dims:
#   BOX-S [220, 160, 120], BOX-M [320, 240, 180], BOX-L [450, 350, 300]
DEFAULT_BOX_TYPES: list[BoxType] = [
    BoxType(
        Reference="BOX-S",
        Width=220,
        Length=160,
        Depth=120,
        MaxWeight=15.0,
        BoxWeight=0.12,
        Active=True,
        MaximumBoxes=100,
    ),
    BoxType(
        Reference="BOX-M",
        Width=320,
        Length=240,
        Depth=180,
        MaxWeight=25.0,
        BoxWeight=0.21,
        Active=True,
        MaximumBoxes=100,
    ),
    BoxType(
        Reference="BOX-L",
        Width=450,
        Length=350,
        Depth=300,
        MaxWeight=32.0,
        BoxWeight=0.38,
        Active=True,
        MaximumBoxes=100,
    ),
]

_box_types: dict[str, BoxType] = {}


class DuplicateBoxReferenceError(ValueError):
    """Raised when an inventory record already uses a reference."""


class DuplicateImportReferenceError(ValueError):
    """Raised defensively if an import contains a duplicate reference."""


class InventoryConsumptionError(ValueError):
    """Raised with every stock issue before any inventory is mutated."""

    def __init__(self, issues: list[str]):
        self.issues = issues
        super().__init__(" ".join(issues))


def reset_box_inventory() -> None:
    """Clear inventory, matching a fresh deployment before boxes.json import."""
    _box_types.clear()


def list_box_types() -> list[BoxType]:
    return [box.model_copy(deep=True) for box in _box_types.values()]


def find_box_type(reference: str) -> BoxType | None:
    box = _box_types.get(reference)
    return box.model_copy(deep=True) if box else None


def add_box_type(box: BoxType) -> BoxType:
    if box.reference in _box_types:
        raise DuplicateBoxReferenceError(box.reference)
    _box_types[box.reference] = box.model_copy(deep=True)
    return box.model_copy(deep=True)


def update_box_type(reference: str, changes: BoxTypeUpdate) -> BoxType | None:
    if reference not in _box_types:
        return None
    updated = BoxType(Reference=reference, **changes.model_dump(by_alias=True))
    _box_types[reference] = updated
    return updated.model_copy(deep=True)


def import_box_types(imported: list[BoxType]) -> list[BoxType]:
    """Atomically create or replace reviewed records, leaving others untouched."""
    references = [box.reference for box in imported]
    if len(references) != len(set(references)):
        raise DuplicateImportReferenceError

    proposed = {
        reference: box.model_copy(deep=True)
        for reference, box in _box_types.items()
    }
    for box in imported:
        proposed[box.reference] = box.model_copy(deep=True)

    _box_types.clear()
    _box_types.update(proposed)
    return [box.model_copy(deep=True) for box in imported]


def active_box_types() -> list[BoxType]:
    """Active, in-stock boxes available at the FitSolver boundary."""
    return [
        box
        for box in list_box_types()
        if box.active and box.maximum_boxes > 0
    ]


def consume_box_stock(required: dict[str, int]) -> list[BoxType]:
    """Validate all requirements, then deduct them as one logical operation."""
    issues: list[str] = []
    for reference, quantity in required.items():
        box = _box_types.get(reference)
        required_label = f"{quantity} {reference} box{'es' if quantity != 1 else ''}"
        if box is None:
            issues.append(
                f"The current solution requires {required_label}, "
                "but that box type is missing from inventory."
            )
        elif not box.active:
            issues.append(
                f"The current solution requires {required_label}, "
                "but that box type is inactive."
            )
        elif box.maximum_boxes < quantity:
            available_verb = "is" if box.maximum_boxes == 1 else "are"
            issues.append(
                f"The current solution requires {required_label}, but only "
                f"{box.maximum_boxes} {available_verb} available."
            )

    if issues:
        raise InventoryConsumptionError(issues)

    updated: list[BoxType] = []
    for reference, quantity in required.items():
        box = _box_types[reference]
        consumed = box.model_copy(
            update={"maximum_boxes": box.maximum_boxes - quantity}
        )
        _box_types[reference] = consumed
        updated.append(consumed.model_copy(deep=True))
    return updated


# TODO: Replace this process-local inventory with persistent deployment storage.
