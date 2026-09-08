"""Portal data models.

Field names follow the PascalCase JSON format used across Dynamic Fit, mapped to
snake_case Python attributes by alias.

`Item` and `BoxType` implement the agreed OpenAPI contract. Dimensions are in
millimetres, and `BoxType` dimensions are internal measurements. All weights are
in kilograms.

Items are supplied per optimisation request, so an `Order` carries its own
items. Box types are reusable reference data and are therefore kept independent
of orders.
"""

from datetime import datetime, timezone
import re
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

# Draft until packed, Packed once a solution exists.
OrderStatus = Literal["Draft", "Packed"]

ITEM_CODE_PATTERN = re.compile(r"^(?:ITM-)?(\d+)$", re.IGNORECASE)


class PortalModel(BaseModel):
    """Shared validation behaviour for all Portal models."""

    model_config = ConfigDict(
        populate_by_name=True,
        extra="forbid",
        str_strip_whitespace=True,
    )


class Item(PortalModel):
    """An item to pack. Quantity defaults to 1; Hazardous defaults to false."""

    item_code: str = Field(alias="ItemCode", min_length=1, pattern=r"^ITM-\d{3,}$")
    item_reference: str = Field(alias="ItemReference", min_length=1)
    width: int = Field(alias="Width", gt=0)
    length: int = Field(alias="Length", gt=0)
    depth: int = Field(alias="Depth", gt=0)
    weight: float = Field(alias="Weight", gt=0, le=32)
    box_group: str | None = Field(default=None, alias="BoxGroup", min_length=1)
    quantity: int = Field(default=1, alias="Quantity", ge=1)
    hazardous: bool = Field(default=False, alias="Hazardous")

    @field_validator("item_code", mode="before")
    @classmethod
    def normalise_item_code(cls, value: object) -> object:
        """Accept numeric shorthand but always retain a canonical item code."""
        if not isinstance(value, str):
            return value
        match = ITEM_CODE_PATTERN.fullmatch(value.strip())
        if not match:
            raise ValueError("ItemCode must be a number or ITM- followed by a number")
        return f"ITM-{match.group(1).zfill(3)}"

    @field_validator("box_group", mode="before")
    @classmethod
    def empty_box_group_is_none(cls, value: object) -> object:
        """Blank BoxGroup is treated as omitted."""
        if value is None:
            return None
        if isinstance(value, str) and not value.strip():
            return None
        return value


# TODO(#30): Persist reusable BoxType data in Supabase independently from
# orders. Box types are reference data shared across orders, not order content.
class BoxType(PortalModel):
    """Reusable box type reference data, independent of any single order.

    Omitted optional fields carry meaning: no `max_weight` means no weight
    limit, no `box_weight` means empty-box weight is not considered, and no
    `maximum_boxes` means unlimited quantity.
    """

    reference: str = Field(alias="Reference", min_length=1)
    width: float = Field(alias="Width", gt=0)
    length: float = Field(alias="Length", gt=0)
    depth: float = Field(alias="Depth", gt=0)
    max_weight: float | None = Field(default=None, alias="MaxWeight", gt=0)
    box_weight: float | None = Field(default=None, alias="BoxWeight", gt=0)
    active: bool = Field(default=True, alias="Active")
    maximum_boxes: int | None = Field(default=None, alias="MaximumBoxes", gt=0)


class Order(PortalModel):
    """Create-order request. Portal assigns identity after validation."""

    items: list[Item] = Field(alias="Items", min_length=1)


class StoredOrder(Order):
    """A stored order. Identity and lifecycle fields are assigned by Portal."""

    order_id: str = Field(alias="OrderId")
    reference: str = Field(alias="Reference", min_length=1)
    status: OrderStatus = Field(default="Draft", alias="Status")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc), alias="CreatedAt"
    )
