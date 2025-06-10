from functools import wraps
from django.http import JsonResponse
from django.contrib.auth import get_user_model
from .jwt import decode_jwt

User = get_user_model()

def login_required_jwt(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return JsonResponse({"error": "Token manquant"}, status=401)

        token = auth_header.split(" ")[1]
        payload = decode_jwt(token)

        if not payload:
            return JsonResponse({"error": "Token invalide ou expiré"}, status=401)

        try:
            user = User.objects.get(id=payload["user_id"])
        except User.DoesNotExist:
            return JsonResponse({"error": "Utilisateur introuvable"}, status=404)

        request.user = user  # Injection de l'utilisateur dans la requête
        return view_func(request, *args, **kwargs)

    return wrapper
