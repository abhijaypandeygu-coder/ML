from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.core.security import create_access_token
from app.schemas.auth import Token
from datetime import timedelta

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["auth"],
)

@router.post("/login", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Mock hardcoded users for MVP
    users = {
        "admin@freightquant.com": {"password": "admin", "role": "ADMIN"},
        "analyst@freightquant.com": {"password": "analyst", "role": "ANALYST"},
        "viewer@freightquant.com": {"password": "viewer", "role": "VIEWER"}
    }
    
    user = users.get(form_data.username)
    if not user or user["password"] != form_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=60)
    access_token = create_access_token(
        data={"sub": form_data.username, "role": user["role"]},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
