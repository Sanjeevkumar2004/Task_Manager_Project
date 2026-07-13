from django.urls import path
from . import views

urlpatterns = [

    # Employee Login
    path(
        "login/",
        views.employee_login,
        name="employee_login"
    ),

    # Get All Employees (Manager)
    path(
        "",
        views.get_employees,
        name="get_employees"
    ),

    # Create Employee
    path(
        "create/",
        views.create_employee,
        name="create_employee"
    ),

    # Employee Profile
    path(
        "<str:employee_id>/",
        views.employee_profile,
        name="employee_profile"
    ),

    # Update Employee (Manager & Employee)
    path(
        "update/<str:employee_id>/",
        views.update_employee,
        name="update_employee"
    ),

    # Delete Employee
    path(
        "delete/<str:employee_id>/",
        views.delete_employee,
        name="delete_employee"
    ),

    # Employee Tasks
    path(
        "tasks/",
        views.employee_tasks,
        name="employee_tasks"
    ),

    # Update Task Status
    path(
        "task/update/<int:task_id>/",
        views.update_task_status,
        name="update_task_status"
    ),
path(
    "change-password/",
    views.change_password,
    name="change_password"
),
path(
    "notifications/",
    views.employee_notifications,
    name="employee_notifications"
),
path(
    "notifications/unread/",
    views.unread_notifications,
    name="unread_notifications"
),

path(
    "notifications/read/<int:notification_id>/",
    views.mark_notification_read,
    name="mark_notification_read"
),

path(
    "notifications/read-all/",
    views.mark_all_notifications_read,
    name="mark_all_notifications_read"
),

path(
    "notifications/delete/<int:notification_id>/",
    views.delete_notification,
    name="delete_notification"
),

path(
    "notifications/clear/",
    views.clear_notifications,
    name="clear_notifications"
),

path(
    "notifications/search/",
    views.search_notifications,
    name="search_notifications"
),

path(
    "task/statistics/",
    views.employee_task_statistics,
    name="employee_task_statistics"
),
]