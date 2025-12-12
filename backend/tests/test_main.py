import pytest
from fastapi.testclient import TestClient
from app.main import app, db_base
from app.database import SessionLocal
from app.auth import authenticate_user, get_hash_password
from app.utils import get_hash_password


class TestMain:
    def setup(self):
        self.client = TestClient(app)
        self.session = SessionLocal()
        self.session.add(User(username="testuser", email="test@example.com", hashed_password=get_hash_password("testpassword")))
        self.session.commit()

    def teardown(self):
        self.session.query(User).delete()
        self.session.commit()
        self.session.close()

    def test_get_health(self):
        response = self.client.get("/api/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok", "message": "api is working"}

    def test_login(self):
        response = self.client.post("/api/auth/login", data={"username": "testuser", "password": "testpassword"})
        assert response.status_code == 200
        assert "access_token" in response.json()

    def test_register(self):
        response = self.client.post("/api/auth/register", data={"username": "testuser2", "email": "test2@example.com", "password": "testpassword"})
        assert response.status_code == 200
        assert "access_token" in response.json()

    def test_get_users(self):
        response = self.client.get("/api/users")
        assert response.status_code == 200
        assert len(response.json()["users"]) == 1

    def test_get_user(self):
        response = self.client.get("/api/users/1")
        assert response.status_code == 200
        assert response.json()["user"]["username"] == "testuser"

    def test_create_item(self):
        response = self.client.post("/api/items", data={"title": "testitem", "description": "testdescription"})
        assert response.status_code == 200
        assert "item" in response.json()

    def test_get_items(self):
        response = self.client.get("/api/items")
        assert response.status_code == 200
        assert len(response.json()["items"]) == 1

    def test_update_item(self):
        response = self.client.put("/api/items/1", data={"title": "testitem2", "description": "testdescription2"})
        assert response.status_code == 200
        assert response.json()["item"]["title"] == "testitem2"

    def test_delete_item(self):
        response = self.client.delete("/api/items/1")
        assert response.status_code == 200
        assert response.json()["message"] == "Item deleted"
