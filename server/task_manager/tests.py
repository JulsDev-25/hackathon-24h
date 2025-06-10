from django.test import TestCase, Client
from django.contrib.auth import get_user_model
import json

User = get_user_model()

class AuthViewsTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.register_url = "/api/register/"
        self.login_url = "/api/login/"
        self.user_data = {
            "username": "testuser",
            "password": "strongpassword123",
            "confirmPassword": "strongpassword123",
            "firstName": "Test",
            "lastName": "User",
            "email": "test@example.com"
        }

    def test_register_success(self):
        response = self.client.post(
            self.register_url,
            data=json.dumps(self.user_data),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 201)
        self.assertIn("message", response.json())
        self.assertTrue(User.objects.filter(username="testuser").exists())

    def test_register_password_mismatch(self):
        data = self.user_data.copy()
        data["confirmPassword"] = "wrongpassword"
        response = self.client.post(
            self.register_url,
            data=json.dumps(data),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json())

    def test_login_success(self):
        # D'abord, on crée l'utilisateur
        User.objects.create_user(
            username="testuser",
            password="strongpassword123",
            first_name="Test",
            last_name="User",
            email="test@example.com"
        )
        response = self.client.post(
            self.login_url,
            data=json.dumps({
                "username": "testuser",
                "password": "strongpassword123"
            }),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.json())
        self.assertIn("user", response.json())

    def test_login_wrong_password(self):
        User.objects.create_user(
            username="testuser",
            password="strongpassword123"
        )
        response = self.client.post(
            self.login_url,
            data=json.dumps({
                "username": "testuser",
                "password": "wrongpassword"
            }),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, 401)
        self.assertIn("error", response.json())