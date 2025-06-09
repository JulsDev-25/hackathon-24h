# from django.shortcuts import render

from django.http import JsonResponse, HttpResponseNotAllowed, HttpResponseBadRequest, Http404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.models import User
from .models import Task, Project
import json
import jwt
from django.conf import settings

@csrf_exempt
@require_http_methods(["GET", "POST"])
def tasks_view(request):
    if request.method == "GET":
        tasks = list(Task.objects.all().values())
        return JsonResponse(tasks, safe=False)
    
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            title = data.get("title")
            description = data.get("description", "")
            status = data.get("status", "TODO")
            assigned_to_id = data.get("assigned_to")
            project_id = data.get("project")

            if not title or not project_id:
                return HttpResponseBadRequest("Title and projet are required !")
            
            project = Project.objects.get(id=project_id)
            assigned_to = User.objects.get(id=assigned_to_id) if assigned_to_id else None

            task = Task.objects.create(
                title=title,
                description=description,
                status=status,
                assigned_to=assigned_to_id,
                project=project_id
            )

            return JsonResponse({
                "id": task.id,
                "message": "Task created succesfully"
            }, status=201)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
def task_detail_view(request, task_id):
    try:
        task = Task.objects.get(pk=task_id)
    except Task.DoesNotExist:
        return Http404("Task not found")
    
    if request.method == "GET":
        return JsonResponse({
            "id": task.id,
            "title":task.title,
            "description": task.description,
            "status": task.status,
            "assigned_to": task.assigned_to,
            "project": task.project,
            "created_at": task.created_at
        })
    
    if request.method == "PUT":
        try:
            data = json.loads(request.body)
            task.title = data.get("title", task.title)
            task.description = data.get("description", task.description)
            task.status = data.get("status", task.status)
            assigned_to_id = data.get("assigned_to")
            if assigned_to_id:
                task.assigned_to = User.objects.get(id=assigned_to_id)
            task.save()
            return JsonResponse({"message": "Task updated successfully"})
        except Exception as e:
            return JsonResponse ({"error": str(e)}, status=400)
        
    if request.method == "DELETE":
        task.delete()
        return JsonResponse({"message": "Task deleted successfully"})
    

@csrf_exempt
@require_http_methods(['GET'])
def dashboard_view(request):
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    if not auth_header.startswith('Bearer '):
        return JsonResponse({"error": "Token manquant"}, status=401)
    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        user = User.objects.get(id=payload['id'])
    except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
        return JsonResponse({"error": "Token invalide ou expiré"}, status=401)

    projects = Project.objects.filter(created_by=user).values("id", "name", "description", "created_at")
    projects_data = []
    for project in projects:
        tasks = Task.objects.filter(project=project["id"]).values("id", "title", "status", "assigned_to")
        project_dict = dict(project)
        project_dict["tasks"] = list(tasks)
        projects_data.append(project_dict)

    return JsonResponse({
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        },
        "projects": projects_data
    })