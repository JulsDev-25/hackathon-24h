from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
from ..models import Project, Task
from ..utils.jwt_auth import login_required_jwt
import json

@require_http_methods(["GET", "POST"])
@login_required_jwt
def project_tasks_view(request, project_id):
    try:
        project = Project.objects.get(id=project_id, created_by=request.user)
    except Project.DoesNotExist:
        return JsonResponse({"error": "Projet non trouvé"}, status=404)

    if request.method == "GET":
        tasks = Task.objects.filter(project=project)
        data = [{
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "status": t.status,
        } for t in tasks]
        return JsonResponse(data, safe=False, status=200)

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            title = data.get("title")
            description = data.get("description", "")
            if not title:
                return JsonResponse({"error": "Le titre est requis"}, status=400)
            task = Task.objects.create(
                title=title,
                description=description,
                project=project
            )
            return JsonResponse({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status,
            }, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
