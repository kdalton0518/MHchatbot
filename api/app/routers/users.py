from fastapi import APIRouter, HTTPException, Body, Depends
from typing import List, Optional, Any
from uuid import UUID
from pydantic.networks import EmailStr
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError


from .. import schemas, models
from ..auth import get_hashed_password, get_current_active_superuser, get_current_active_user
from ..utils import postgres_userpass_conn, supabase_urlkey_conn


supabase_client = supabase_urlkey_conn()
router = APIRouter()


@router.post("", response_model=schemas.User)
async def register_user(
    password: str = Body(...),
    email: EmailStr = Body(...),
    first_name: str = Body(None),
    last_name: str = Body(None),
):
    """
    Register a new user.
    """
    hashed_password = get_hashed_password(password)
    try:
        response = supabase_client.from_("users").insert({
            "email": email,
            "hashed_password": hashed_password,
            "first_name": first_name,
            "last_name": last_name,
        }).execute()
        if response.error:
            raise HTTPException(
                status_code=400,
                detail="User with that email already exists."
            )
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("", response_model=List[schemas.User])
async def get_users(
    limit: Optional[int] = 10,
    offset: Optional[int] = 0,
    admin_user: models.User = Depends(get_current_active_superuser),
):
    try:
        response = supabase_client.from_("users").select("*").range(offset, offset + limit - 1).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching users")
    return response.data


@router.get("/me", response_model=schemas.User)
async def get_profile(
    current_user: models.User = Depends(get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user


@router.patch("/me", response_model=schemas.User)
async def update_profile(
    updateschema: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_active_user),
) -> Any:
    """
    Update current user.
    """
    try:
        response = supabase_client.from_("users").update(
            updateschema.dict(exclude={"is_active", "is_superuser"}, exclude_unset=True)
        ).eq("uuid", current_user.uuid).execute()

        if response.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail="User with that email already exists."
            )
        return response.data[0]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/me", response_model=schemas.User)
async def delete_me(user: models.User = Depends(get_current_active_user)):
    response = supabase_client.from_("users").delete().eq("uuid", user.uuid).execute()
    if response.error:
        raise HTTPException(status_code=400, detail="User not found")
    return user


@router.patch("/{userid}", response_model=schemas.User)
async def update_user(
    userid: UUID,
    update: schemas.UserUpdate,
    admin_user: models.User = Depends(get_current_active_superuser),
) -> Any:
    """
    Update a user.

    ** Restricted to superuser **

    Parameters
    ----------
    userid : UUID
        the user's UUID
    update : schemas.UserUpdate
        the update data
    current_user : models.User, optional
        the current superuser, by default Depends(get_current_active_superuser)
    """
    response = supabase_client.from_("users").update(
        update.model_dump(exclude_unset=True)
    ).eq("uuid", userid).execute()
    if response.status_code != 200:
        raise HTTPException(
            status_code=400,
            detail="User with that email already exists."
        )
    return response.data[0]


@router.get("/{userid}", response_model=schemas.User)
async def get_user(
    userid: UUID, admin_user: models.User = Depends(get_current_active_superuser)
):
    response = supabase_client.from_("users").select("*").eq("uuid", userid).execute()
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="User not found")
    return response.data[0]


@router.delete("/{userid}", response_model=schemas.User)
async def delete_user(
    userid: UUID, admin_user: models.User = Depends(get_current_active_superuser)
):
    response = supabase_client.from_("users").delete().eq("uuid", userid).execute()
    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="User not found")
    return response.data[0]

