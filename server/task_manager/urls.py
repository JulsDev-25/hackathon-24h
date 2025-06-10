# server/task_manager/urls.py
from django.urls import path
from . import views_auth
from .views import project_views
from .views.task_views import project_tasks_view

urlpatterns = [
    # vues d'authentification
    path("api/register/", views_auth.register_view),
    path("api/login/", views_auth.login_view),
    path("api/me/", views_auth.me_view),
    
    # vue gestion Projets
    path("api/projects/", project_views.project_list_or_create_view),
    path("api/projects/<int:project_id>/", project_views.project_detail_update_delete_view),
    
    #vue gestion des taches
    path("api/projects/<int:project_id>/tasks/", project_tasks_view, name="project_tasks"),
]


