from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase, BaseModel):
    password: str

class UserOut(UserBase, BaseModel):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
        
        
class BudgetBase(BaseModel):
    id: int
            
class BudgetCreate(BaseModel):
    user_id: int
    amount: int

class BudgetOut(BudgetCreate, BaseModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]
    deleted_at: Optional[datetime]
    
class BudgetUpdate(BaseModel):
    amount: int
    

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    id: Optional[int] = None