from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_access_token
from app.schemas.auth import TokenData

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenData:
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    username: str = payload.get("sub")
    role: str = payload.get("role")
    if username is None or role is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    return TokenData(username=username, role=role)

def require_analyst_or_admin(current_user: TokenData = Depends(get_current_user)):
    if current_user.role not in ["ADMIN", "ANALYST"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    return current_user
