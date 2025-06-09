import jwt
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.conf import settings

class JWTAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')

        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user = User.objects.get(id=payload['id'])
                request.user = user  # Injection de l'utilisateur
            except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
                return JsonResponse({'error': 'Token invalide ou expiré'}, status=401)
        else:
            request.user = None  # Utilisateur anonyme si pas de token

        return self.get_response(request)
