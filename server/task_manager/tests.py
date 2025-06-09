from django.test import TestCase, Client
from django.contrib.auth.models import User
import json

class AuthTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.login_url = "/api/login/"
        self.dashboard_url = "/api/dashboard/"
        self.user = User.objects.create_user(username="testuser", password="testpass")

    def test_login_success(self):
        response = self.client.post(self.login_url, data=json.dumps({
            "username": "testuser",
            "password": "testpass"
        }), content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.json())

    def test_dashboard_requires_token(self):
        response = self.client.get(self.dashboard_url)
        self.assertEqual(response.status_code, 401)
        self.assertIn("error", response.json())
