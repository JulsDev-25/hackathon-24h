from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from .utils.jwt_auth import login_required_jwt
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json
from .utils.jwt import generate_jwt, decode_jwt  # Assure-toi d'avoir decode_jwt

User = get_user_model()  # Utilise le modèle d'utilisateur personnalisé défini dans settings.py

@csrf_exempt
@require_http_methods(["POST"])
def register_view(request):
    try:
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")
        confirm_password = data.get("confirmPassword")
        first_name = data.get("firstName")  # <-- harmoniser avec camelCase
        last_name = data.get("lastName")
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

        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name or "",
            email=email
        )

        return JsonResponse({"message": "Utilisateur enregistré avec succès"}, status=201)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Requête invalide"}, status=400)
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
            return JsonResponse({"error": "Nom d'utilisateur ou mot de passe incorrect"}, status=401)

        token = generate_jwt(user)
        return JsonResponse({
            "token": token,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "firstName": user.first_name,
                "lastName": user.last_name,
            }
        }, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Requête invalide"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@login_required_jwt
def me_view(request):
    user = request.user
    return JsonResponse({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "firstName": user.first_name,
        "lastName": user.last_name,
    })