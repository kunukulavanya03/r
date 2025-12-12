from fastapi import FastAPI, HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, scoped_session
from sqlalchemy.orm.session import sessionmaker
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from jose import jwt, JWTError
from passlib.context import CryptContext
from typing import List, Optional
from app.models import User, Item, Base
from app.auth import authenticate_user, create_access_token
from app.config import Settings
from app.database import get_db
from app.utils import get_hash_password
from app.dependencies import get_current_user


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./app.db"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30


app = FastAPI(
    title="FastAPI Backend",
    description="FastAPI backend for React frontend",
    version="1.0.0",
    contact={
        "name": "Your Name",
        "email": "your@email.com",
    },
    license={
        "name": "MIT License",
    },
)


cors = [
    {
        "allow_origins": [
            "*"
        ],
        "allow_credentials": True,
        "allow_methods": ["*"],
        "allow_headers": ["*"],
    },
]

app.add_middleware(CORSMiddleware, **cors)

db_base = declarative_base()
class User(db_base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class Item(db_base):
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship('User')

db_url = Settings().DATABASE_URL
engine = create_engine(db_url)
db_base.metadata.create_all(bind=engine)


@app.get("/api/health")
def get_health():
    return {"status": "ok", "message": "api is working"}


@app.post("/api/auth/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/api/auth/register")
def register(username: str, email: str, password: str):
    hashed_password = get_hash_password(password)
    new_user = User(username=username, email=email, hashed_password=hashed_password)
    session.add(new_user)
    session.commit()
    access_token = create_access_token(data={"sub": new_user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/users")
def get_users():
    users = session.query(User).all()
    return {"users": users}


@app.get("/api/users/{id}")
def get_user(id: int):
    user = session.query(User).get(id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user": user}


@app.post("/api/items")
def create_item(title: str, description: str, current_user: User = Depends(get_current_user)):
    new_item = Item(title=title, description=description, user_id=current_user.id)
    session.add(new_item)
    session.commit()
    return {"item": new_item}


@app.get("/api/items")
def get_items():
    items = session.query(Item).all()
    return {"items": items}


@app.put("/api/items/{id}")
def update_item(id: int, title: str, description: str, current_user: User = Depends(get_current_user)):
    item = session.query(Item).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item.title = title
    item.description = description
    session.commit()
    return {"item": item}


@app.delete("/api/items/{id}")
def delete_item(id: int, current_user: User = Depends(get_current_user)):
    item = session.query(Item).get(id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    session.delete(item)
    session.commit()
    return {"message": "Item deleted"}
