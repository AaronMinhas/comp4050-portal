"""Portal data models.

Field names follow the PascalCase JSON format used across Dynamic Fit, mapped to
snake_case Python attributes by alias.

`Item` and `BoxType` implement the agreed OpenAPI contract. Dimensions are in
millimetres, and `BoxType` dimensions are internal measurements. All weights are
in kilograms.

`Order` is provisional. Ticket #15 covers the FastAPI application structure and
validation infrastructure only; the Portal domain contract is defined in ticket
#17.
"""

from pydantic import BaseModel, ConfigDict, Field


class PortalModel(BaseModel):
    """Shared validation behaviour for all Portal models."""

    model_config = ConfigDict(
        populate_by_name=True,
        extra="forbid",
        str_strip_whitespace=True,
    )


class Item(PortalModel):
    """An item to be packed."""

    item_code: str = Field(alias="ItemCode", min_length=1)
    item_reference: str = Field(alias="ItemReference", min_length=1)
    width: int = Field(alias="Width", gt=0)
    length: int = Field(alias="Length", gt=0)
    depth: int = Field(alias="Depth", gt=0)
    weight: float = Field(alias="Weight", gt=0)
    box_group: str | None = Field(default=None, alias="BoxGroup", min_length=1)


class BoxType(PortalModel):
    """Box type reference data.

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
    """ TEMP . A non-empty list of items.

    Order contract currently empty. Will be defined in ticket
    #17. Order ID/reference assignment will be defined in ticket #18. Nothing
    should depend on this model until then.
    """

    items: list[Item] = Field(alias="Items", min_length=1)
