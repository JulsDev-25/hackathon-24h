from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json
from .utils.jwt import generate_jwt

@csrf_exempt
@require_http_methods(["POST"])
def register_view(request):
    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        confirm_password = data.get("confirmPassword")
        first_name = data.get("firstname")
        last_name = data.get("lastname")
        email = data.get("email")

        # Vérifications
        if not all([username, password, confirm_password, first_name, email]):
            return JsonResponse({"error": "Tous les champs sont requis"}, status=400)
        
        if password != confirm_password:
            return JsonResponse({"error": "Les mots de passe ne correspondent pas"}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Nom d'utilisateur déjà pris"}, status=409)

        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "Email déjà utilisé"}, status=409)

        # Création de l'utilisateur
        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email
        )

        return JsonResponse({"message": "Utilisateur enregistré avec succès"}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@csrf_exempt
@require_http_methods(["POST"])    
def login_view(request):
    try:
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)
        if user is None:
            return JsonResponse({"error": "Email ou mot de passe incorrect !"}, status=401)

        token = generate_jwt(user)
        return JsonResponse({"token": token}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def me_view(request):
    user = getattr(request, 'user', None)

    if not user or not user.is_authenticated:
        return JsonResponse({"error": "Non autorisé"}, status=401)

    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "email": user.email
    })
