from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Employee

from rest_framework.decorators import api_view
from rest_framework.response import Response

from datetime import date
import json

from .models import Employee, Notification
from .serializers import (
    EmployeeSerializer,
    NotificationSerializer
)

from tasks.models import Task
from accounts.models import ManagerNotification


# ============================================================
# CREATE EMPLOYEE
# ============================================================

@csrf_exempt
def create_employee(request):

    if request.method != "POST":
        return JsonResponse(
            {
                "success": False,
                "message": "POST request required"
            },
            status=405
        )

    try:

        data = json.loads(request.body)

        experience = str(
            data.get("experience", "0")
        )

        experience = (
            experience
            .replace("Years", "")
            .replace("Year", "")
            .strip()
        )

        if experience == "":
            experience = "0"

        if Employee.objects.filter(
            email=data.get("email")
        ).exists():

            return JsonResponse(
                {
                    "success": False,
                    "message": "Email already exists"
                },
                status=400
            )

        employee = Employee.objects.create(

            name=data.get("name"),

            email=data.get("email"),

            phone=data.get("phone"),

            position=data.get("position"),

            skills=data.get("skills"),

            experience=int(experience),

            password=data.get("password"),

            current_workload=0,

            performance_score=100,

            status="Active"

        )

        return JsonResponse({

            "success": True,

            "message": "Employee Created Successfully",

            "employee":{

                "employee_id":employee.employee_id,

                "name":employee.name,

                "email":employee.email

            }

        })

    except Exception as e:

        return JsonResponse({

            "success":False,

            "message":str(e)

        },status=500)


# ============================================================
# GET ALL EMPLOYEES
# ============================================================

@api_view(["GET"])
def get_employees(request):

    employees = Employee.objects.all().order_by("name")

    serializer = EmployeeSerializer(
        employees,
        many=True
    )

    return Response(serializer.data)


# ============================================================
# UPDATE EMPLOYEE
# ============================================================
# ============================================================
# UPDATE EMPLOYEE
# ============================================================

@csrf_exempt
def update_employee(request, employee_id):

    if request.method != "PUT":

        return JsonResponse(
            {
                "success": False,
                "message": "PUT request required"
            },
            status=405
        )


    try:

        employee = get_object_or_404(
            Employee,
            employee_id=employee_id
        )


        # ===============================
        # READ JSON DATA FROM REACT
        # ===============================

        try:

            data = json.loads(
                request.body.decode("utf-8")
            )

        except:

            data = request.POST



        # ===============================
        # UPDATE EMPLOYEE DETAILS
        # ===============================

        if "name" in data:

            employee.name = data.get("name")


        if "email" in data:

            employee.email = data.get("email")


        if "phone" in data:

            employee.phone = data.get("phone")


        if "position" in data:

            employee.position = data.get("position")


        if "skills" in data:

            employee.skills = data.get("skills")


        if "experience" in data:

            employee.experience = int(
                data.get("experience")
            )


        if "status" in data:

            employee.status = data.get("status")



        # ===============================
        # PROFILE PHOTO UPDATE
        # ===============================

        if "photo" in request.FILES:

            employee.photo = request.FILES["photo"]



        # ===============================
        # SAVE TO DATABASE
        # ===============================

        employee.save()
        ManagerNotification.objects.create(

    title="Employee Profile Updated",

    message=f"{employee.name} updated their profile"

)


        return JsonResponse({

            "success": True,

            "message":
            "Employee Updated Successfully",

            "employee":{

                "employee_id":
                employee.employee_id,

                "name":
                employee.name,

                "email":
                employee.email,

                "phone":
                employee.phone,

                "position":
                employee.position,

                "skills":
                employee.skills,

                "experience":
                employee.experience,

                "status":
                employee.status

            }

        })



    except Exception as e:


        return JsonResponse({

            "success":False,

            "message":str(e)

        },status=500)
# ============================================================
# DELETE EMPLOYEE
# ============================================================

@csrf_exempt
def delete_employee(request, employee_id):

    if request.method != "DELETE":

        return JsonResponse({

            "success":False,

            "message":"DELETE request required"

        },status=405)

    employee = get_object_or_404(

        Employee,

        employee_id=employee_id

    )

    employee.delete()

    return JsonResponse({

        "success":True,

        "message":"Employee Deleted Successfully"

    })
# ============================================================
# EMPLOYEE LOGIN
# ============================================================

@csrf_exempt
def employee_login(request):

    if request.method != "POST":

        return JsonResponse(
            {
                "success": False,
                "message": "POST request required"
            },
            status=405
        )

    try:

        data = json.loads(request.body)

        email = data.get(
            "email",
            ""
        ).strip()

        password = data.get(
            "password",
            ""
        ).strip()

        employee = Employee.objects.filter(

            email=email,

            password=password

        ).first()

        if employee is None:

            return JsonResponse({

                "success": False,

                "message": "Invalid Email or Password"

            }, status=401)

        request.session["employee_id"] = employee.employee_id

        request.session["employee_name"] = employee.name

        request.session.modified = True

        return JsonResponse({

    "success": True,

    "employee": {

        "employee_id": employee.employee_id,

        "name": employee.name,

        "email": employee.email,

        "position": employee.position,

        "phone": employee.phone,

        "skills": employee.skills,

        "experience": employee.experience,

        "status": employee.status,

        "photo": employee.photo.url if employee.photo else ""

    }

})

    except Exception as e:

        return JsonResponse({

            "success": False,

            "message": str(e)

        }, status=500)


# ============================================================
# EMPLOYEE PROFILE
# ============================================================

def employee_profile(request, employee_id):

    employee = get_object_or_404(

        Employee,

        employee_id=employee_id

    )

    serializer = EmployeeSerializer(employee)

    return JsonResponse(serializer.data)


# ============================================================
# CHANGE PASSWORD
# ============================================================

@csrf_exempt
def change_password(request):

    if request.method != "PUT":

        return JsonResponse({

            "success": False,

            "message": "PUT request required"

        }, status=405)

    try:

        data = json.loads(request.body)

        employee = Employee.objects.filter(

            employee_id=data.get("employee_id")

        ).first()

        if employee is None:

            return JsonResponse({

                "success": False,

                "message": "Employee not found"

            }, status=404)

        if employee.password != data.get("old_password"):

            return JsonResponse({

                "success": False,

                "message": "Current Password is Incorrect"

            }, status=400)

        employee.password = data.get("new_password")

        employee.save()

        Notification.objects.create(

            employee=employee,

            title="Password Changed",

            message="Your account password has been changed successfully.",

            icon="lock",

            color="success"

        )

        return JsonResponse({

            "success": True,

            "message": "Password Updated Successfully"

        })

    except Exception as e:

        return JsonResponse({

            "success": False,

            "message": str(e)

        }, status=500)
    # ============================================================
# EMPLOYEE TASKS
# ============================================================

def employee_tasks(request):

    if "employee_id" not in request.session:

        return JsonResponse({

            "success": False,

            "message": "Employee not logged in"

        }, status=401)

    employee_id = request.session["employee_id"]

    tasks = Task.objects.filter(
        employee_id=employee_id
    ).order_by("deadline")

    data = []

    for task in tasks:

        overdue = False

        if (
            task.deadline
            and task.status != "Completed"
            and task.deadline < date.today()
        ):
            overdue = True

        data.append({

            "task_id": task.task_id,

            "title": task.title,

            "description": task.description,

            "priority": task.priority,

            "status": task.status,

            "deadline": str(task.deadline),

            "required_skills": task.required_skills,

            "assignment_score": task.assignment_score,

            "overdue": overdue

        })

    return JsonResponse(data, safe=False)


# ============================================================
# UPDATE TASK STATUS
# ============================================================

@csrf_exempt
def update_task_status(request, task_id):

    if request.method != "PUT":

        return JsonResponse({

            "success": False,

            "message": "PUT request required"

        }, status=405)

    if "employee_id" not in request.session:

        return JsonResponse({

            "success": False,

            "message": "Login Required"

        }, status=401)

    employee = Employee.objects.get(
        employee_id=request.session["employee_id"]
    )

    task = get_object_or_404(

        Task,

        task_id=task_id,

        employee_id=employee.employee_id

    )

    try:

        data = json.loads(request.body)

        old_status = task.status

        new_status = data.get("status")

        if new_status:

            task.status = new_status

            task.save()

            Notification.objects.create(

                employee=employee,

                title="Task Status Updated",

                message=f"{task.title} changed from {old_status} to {new_status}",

                icon="tasks",

                color="primary"

            )

        return JsonResponse({

            "success": True,

            "message": "Task Updated Successfully"

        })

    except Exception as e:

        return JsonResponse({

            "success": False,

            "message": str(e)

        }, status=500)


# ============================================================
# EMPLOYEE TASK STATISTICS
# ============================================================

def employee_task_statistics(request):

    if "employee_id" not in request.session:

        return JsonResponse({}, status=401)

    employee_id = request.session["employee_id"]

    tasks = Task.objects.filter(
        employee_id=employee_id
    )

    total = tasks.count()

    pending = tasks.filter(
        status="Pending"
    ).count()

    progress = tasks.filter(
        status="In Progress"
    ).count()

    completed = tasks.filter(
        status="Completed"
    ).count()

    overdue = tasks.filter(
        status__in=["Pending", "In Progress"],
        deadline__lt=date.today()
    ).count()

    return JsonResponse({

        "total": total,

        "completed": completed,

        "pending": pending,

        "in_progress": progress,

        "overdue": overdue,

        "completion_percentage":
        round(
            (completed / total) * 100,
            2
        ) if total > 0 else 0

    })
# ============================================================
# EMPLOYEE NOTIFICATIONS
# ============================================================

def employee_notifications(request):

    if "employee_id" not in request.session:

        return JsonResponse([], safe=False)

    employee = get_object_or_404(
        Employee,
        employee_id=request.session["employee_id"]
    )

    notifications = Notification.objects.filter(
        employee=employee
    ).order_by("-created_at")

    serializer = NotificationSerializer(
        notifications,
        many=True
    )

    return JsonResponse(
        serializer.data,
        safe=False
    )


# ============================================================
# UNREAD NOTIFICATIONS
# ============================================================

def unread_notifications(request):

    if "employee_id" not in request.session:

        return JsonResponse([], safe=False)

    employee = get_object_or_404(
        Employee,
        employee_id=request.session["employee_id"]
    )

    notifications = Notification.objects.filter(

        employee=employee,

        is_read=False

    ).order_by("-created_at")

    serializer = NotificationSerializer(
        notifications,
        many=True
    )

    return JsonResponse(
        serializer.data,
        safe=False
    )


# ============================================================
# MARK SINGLE NOTIFICATION AS READ
# ============================================================

@csrf_exempt
def mark_notification_read(request, notification_id):

    if request.method != "PUT":

        return JsonResponse({

            "success":False,

            "message":"PUT request required"

        },status=405)

    notification = get_object_or_404(

        Notification,

        id=notification_id

    )

    notification.is_read=True

    notification.save()

    return JsonResponse({

        "success":True,

        "message":"Notification marked as read"

    })


# ============================================================
# MARK ALL NOTIFICATIONS AS READ
# ============================================================

@csrf_exempt
def mark_all_notifications_read(request):

    if request.method!="PUT":

        return JsonResponse({

            "success":False

        },status=405)

    if "employee_id" not in request.session:

        return JsonResponse({

            "success":False

        },status=401)

    employee=Employee.objects.get(

        employee_id=request.session["employee_id"]

    )

    Notification.objects.filter(

        employee=employee,

        is_read=False

    ).update(

        is_read=True

    )

    return JsonResponse({

        "success":True,

        "message":"All notifications marked as read"

    })


# ============================================================
# DELETE SINGLE NOTIFICATION
# ============================================================

@csrf_exempt
def delete_notification(request, notification_id):

    if request.method!="DELETE":

        return JsonResponse({

            "success":False

        },status=405)

    notification=get_object_or_404(

        Notification,

        id=notification_id

    )

    notification.delete()

    return JsonResponse({

        "success":True,

        "message":"Notification deleted"

    })


# ============================================================
# CLEAR ALL NOTIFICATIONS
# ============================================================

@csrf_exempt
def clear_notifications(request):

    if request.method!="DELETE":

        return JsonResponse({

            "success":False

        },status=405)

    if "employee_id" not in request.session:

        return JsonResponse({

            "success":False

        },status=401)

    employee=Employee.objects.get(

        employee_id=request.session["employee_id"]

    )

    Notification.objects.filter(

        employee=employee

    ).delete()

    return JsonResponse({

        "success":True,

        "message":"All notifications cleared"

    })


# ============================================================
# SEARCH NOTIFICATIONS
# ============================================================

def search_notifications(request):

    if "employee_id" not in request.session:

        return JsonResponse([],safe=False)

    keyword=request.GET.get("search","")

    employee=Employee.objects.get(

        employee_id=request.session["employee_id"]

    )

    notifications=Notification.objects.filter(

        employee=employee,

        title__icontains=keyword

    ).order_by("-created_at")

    serializer=NotificationSerializer(

        notifications,

        many=True

    )

    return JsonResponse(

        serializer.data,

        safe=False

    )