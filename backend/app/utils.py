from passlib.context import CryptContext
from app.auth import get_hash_password

crypt = CryptContext(schemes=["bcrypt"])