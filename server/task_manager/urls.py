# server/task_manager/urls.py
from django.urls import path
from . import views, views_auth

urlpatterns = [
    path('api/tasks/', views.tasks_view, name='tasks'),
    path('api/tasks/<int:task_id>/', views.task_detail_view, name='task_detail'),
    path("api/register/", views_auth.register_view),
    path("api/login/", views_auth.login_view),
    path("api/me/", views_auth.me_view),
    path("api/dashboard/", views.dashboard_view, name="dashboard"),
]


