"""Temporary mock identity and central role authorisation helpers."""

from collections.abc import Callable
from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from pydantic import BaseModel

from app.models import Role

MOCK_ROLE_HEADER = "X-FitPortal-Mock-Role"


class MockIdentity(BaseModel):
    """Development-only caller identity; not an authentication credential."""

    role: Role


def get_current_identity(
    mock_role: Annotated[str | None, Header(alias=MOCK_ROLE_HEADER)] = None,
) -> MockIdentity:
    """Resolve the temporary header into the identity used by route policies.

    TODO: Replace this header resolver with real session/JWT authentication. Route
    policies should continue to consume the resolved identity dependency.
    """
    if mock_role is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Temporary mock identity header {MOCK_ROLE_HEADER} is required",
        )

    try:
        role = Role(mock_role.strip().upper())
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role in {MOCK_ROLE_HEADER}",
        ) from exc

    return MockIdentity(role=role)


def require_roles(*allowed_roles: Role) -> Callable[..., MockIdentity]:
    """Build a reusable route dependency for a role policy."""

    def require_role(
        identity: Annotated[MockIdentity, Depends(get_current_identity)],
    ) -> MockIdentity:
        if identity.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your role does not have permission to perform this action",
            )
        return identity

    return require_role


require_solver_identity = require_roles(Role.SUPERVISOR, Role.ADMINISTRATOR)
require_inventory_manager_identity = require_roles(
    Role.SUPERVISOR, Role.ADMINISTRATOR
)
