from django.urls import path

from . import views

urlpatterns = [

    # Create Task
    path(
        "create/",
        views.create_task_api,
        name="create_task_api"
    ),
    path(
    "suggest-employee/",
    views.suggest_employee_api,
    name="suggest_employee_api"
),

    # Get All Tasks
    path(
        "list/",
        views.get_tasks_api,
        name="get_tasks_api"
    ),
path(
    "",
    views.get_tasks_api,
    name="get_tasks_root"
),
    # Update Task
    path(
        "update/<int:task_id>/",
        views.update_task_api,
        name="update_task_api"
    ),

    # Delete Task
    path(
        "delete/<int:task_id>/",
        views.delete_task_api,
        name="delete_task_api"
    ),

    # Dashboard
    path(
        "dashboard/",
        views.dashboard_api,
        name="dashboard_api"
    ),

    # Reports
    path(
        "priority-report/",
        views.priority_report_api,
        name="priority_report_api"
    ),
]