import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
from ..models import Project
from ..utils.jwt_auth import login_required_jwt

@csrf_exempt
@login_required_jwt
def project_list_or_create_view(request):
    user = request.user

    if request.method == "GET":
        projects = Project.objects.filter(created_by=user).order_by('-created_at')
        data = [{"id": p.id, "name": p.name, "description": p.description} for p in projects]
        return JsonResponse(data, safe=False, status=200)

    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            description = data.get("description", "")
            if not name:
                return JsonResponse({"error": "Le nom est requis"}, status=400)

            project = Project.objects.create(name=name, description=description, created_by=user)
            return JsonResponse({"id": project.id, "message": "Projet créé"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Méthode non autorisée"}, status=405)


@login_required_jwt
@require_http_methods(["GET"])
def project_detail(request, project_id):
    project = get_object_or_404(Project, id=project_id, created_by=request.user)

    return JsonResponse({
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "created_at": project.created_at,
    }, status=200)


@csrf_exempt
@login_required_jwt
def project_detail_update_delete_view(request, project_id):
    user = request.user

    try:
        project = Project.objects.get(id=project_id, created_by=user)
    except Project.DoesNotExist:
        return JsonResponse({"error": "Projet non trouvé"}, status=404)

    if request.method == "GET":
        return JsonResponse({
            "id": project.id,
            "name": project.name,
            "description": project.description,
            "created_at": project.created_at,
        }, status=200)

    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            project.name = data.get("name", project.name)
            project.description = data.get("description", project.description)
            project.save()
            return JsonResponse({"message": "Projet mis à jour"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    elif request.method == "DELETE":
        try:
            project.delete()
            return JsonResponse({"message": "Projet supprimé"}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Méthode non autorisée"}, status=405)

