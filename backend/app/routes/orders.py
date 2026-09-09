"""Order API. POST assigns OrderId and Reference; routes continue using OrderId."""

from fastapi import APIRouter, HTTPException, status

from app import store
from app.models import Order, StoredOrder

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post(
    "",
    response_model=StoredOrder,
    response_model_exclude_none=True,
    status_code=status.HTTP_201_CREATED,
    summary="Create an order",
)
def create_order(order: Order) -> StoredOrder:
    return store.save_order(order)


def require_order(order_id: str) -> StoredOrder:
    stored = store.find_order(order_id)
    if stored is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    return stored


@router.post(
    "/{order_id}/submit",
    response_model=StoredOrder,
    response_model_exclude_none=True,
    summary="Submit a draft order for optimisation",
)
def submit_order(order_id: str) -> StoredOrder:
    stored = require_order(order_id)
    if stored.status != "DRAFT":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Only draft orders can be submitted for optimisation",
        )

    stored.status = "AWAITING_OPTIMISATION"
    return store.update_order(stored)


@router.put(
    "/{order_id}",
    response_model=StoredOrder,
    response_model_exclude_none=True,
    summary="Replace an order's items",
)
def update_order(order_id: str, order: Order) -> StoredOrder:
    stored = require_order(order_id)
    stored.items = order.items
    stored.status = "DRAFT"
    store.invalidate_solution(order_id)
    return store.update_order(stored)


@router.get(
    "",
    response_model=list[StoredOrder],
    response_model_exclude_none=True,
    summary="List orders, newest first",
)
def list_orders() -> list[StoredOrder]:
    return store.list_orders()


@router.get(
    "/{order_id}",
    response_model=StoredOrder,
    response_model_exclude_none=True,
    summary="Retrieve an order",
)
def get_order(order_id: str) -> StoredOrder:
    return require_order(order_id)
