from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import traceback
from .models import Task
from employees.models import Employee
from ai_engine.services import find_best_employee
from ai_engine.nlp_extractor import extract_skills, extract_position
from employees.models import Employee
from ai_engine.ai_matcher import calculate_score
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from employees.models import Notification
from accounts.models import ManagerNotification

@csrf_exempt
def suggest_employee_api(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    try:

        data = json.loads(request.body)

        required_skills = data.get("required_skills", "")
        required_position = data.get("required_position", "")
        experience = int(data.get("experience", 0))

        best_employee = None
        best_score = -1

        class TempTask:
            pass

        task = TempTask()
        task.required_skills = required_skills
        task.required_position = required_position

        for employee in Employee.objects.all():

            score = calculate_score(task, employee)

            # Optional: give extra weight to experience
            if employee.experience >= experience:
                score += 10

            if score > best_score:
                best_score = score
                best_employee = employee

        if best_employee:

            return JsonResponse({

                "success": True,

                "employee_name": best_employee.name,

                "employee_id": best_employee.employee_id,

                "score": best_score

            })

        return JsonResponse({

            "success": False,

            "message": "No Employee Found"

        })

    except Exception as e:

        return JsonResponse({

            "error": str(e)

        }, status=500)

def create_task(request):

    if "manager_name" not in request.session:
        return redirect("/manager/login/")

    if request.method == "POST":

        title = request.POST.get("title")
        description = request.POST.get("description")
        priority = request.POST.get("priority")
        deadline = request.POST.get("deadline")

        required_skills = request.POST.get("required_skills")
        required_position = request.POST.get("required_position")

        skills = extract_skills(description)
        position = extract_position(description)

        if skills:
            required_skills = ",".join(skills)

        if position:
            required_position = position

        task = Task.objects.create(
            title=title,
            description=description,
            priority=priority,
            deadline=deadline,
            required_skills=required_skills,
            required_position=required_position
        )
        # ===========================
# Manager Notification
# ===========================

        if priority == "P1":

            ManagerNotification.objects.create(

        title="🚨 High Priority Task Assigned",

        message=f"{employee.name} has been assigned a P1 task: {task.title}",

        type="priority"

    )
        try:
            employee, score = find_best_employee(task)

            if employee:
                task.employee_name = employee.name
                task.employee_id = str(employee.employee_id)
                task.assigned_employee = str(employee.employee_id)
                task.assignment_score = score
                task.status = "Assigned"

                employee.current_workload += 1
                employee.save(update_fields=["current_workload"])

                task.save()

        except Exception as e:
            print("AI ERROR:", e)

        return redirect("/manager/create-task/")

    return render(request, "tasks/create_task.html")

@csrf_exempt
def create_task_api(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)

    try:

        data = json.loads(request.body)

        print("Received Data:", data)

        description = data.get("description", "")

        required_skills = data.get("required_skills", "").strip()
        required_position = data.get("required_position", "").strip()

        # Extract from description if empty
        if not required_skills:
            skills = extract_skills(description)
            if skills:
                required_skills = ",".join(skills)

        if not required_position:
            required_position = extract_position(description)

        # Create Task
        task = Task.objects.create(
            title=data.get("title"),
            description=description,
            priority=data.get("priority"),
            deadline=data.get("deadline"),
            required_skills=required_skills,
            required_position=required_position,
            employee_name="",
            employee_id="",
            assigned_employee="",
            status="Pending",
            assignment_score=0,
        )

        print("Task Created:", task.task_id)

        # AI Assignment
        employee, score = find_best_employee(task)

        if employee:

            task.employee_name = employee.name
            task.employee_id = str(employee.employee_id)
            task.assigned_employee = str(employee.employee_id)
            task.assignment_score = score
            task.status = "Assigned"

            employee.current_workload += 1
            employee.save(update_fields=["current_workload"])

            task.save()

            # Employee Notification
            Notification.objects.create(
                employee=employee,
                title="New Task Assigned",
                message=f"You have been assigned '{task.title}'",
                icon="tasks",
                color="primary",
            )

            # Manager Notification (only P1)
            if task.priority == "P1":
                ManagerNotification.objects.create(
                    title="🚨 High Priority Task Assigned",
                    message=f"{employee.name} has been assigned a P1 task: {task.title}",
                    type="priority",
                )

            print("Assigned Employee:", employee.name)

        else:
            print("No Suitable Employee Found")

        return JsonResponse({
            "success": True,
            "message": "Task Created Successfully",
            "task_id": task.task_id,
            "employee_name": task.employee_name,
            "employee_id": task.employee_id,
            "assignment_score": task.assignment_score,
            "status": task.status,
            "required_skills": task.required_skills,
            "required_position": task.required_position,
        })

    except Exception as e:

        traceback.print_exc()

        return JsonResponse({
            "success": False,
            "error": str(e)
        }, status=500)
def get_tasks_api(request):

    employee_id = request.GET.get("employee_id")

    if employee_id:

        tasks = Task.objects.filter(
            employee_id=employee_id
        )

    else:

        tasks = Task.objects.all()

    result = []

    for task in tasks:

        result.append({

            "task_id": task.task_id,
            "title": task.title,
            "description": task.description,
            "employee_name": task.employee_name,
            "employee_id": task.employee_id,
            "assigned_employee": task.assigned_employee,
            "priority": task.priority,
            "status": task.status,
            "required_skills": task.required_skills,
            "required_position": task.required_position,
            "deadline": str(task.deadline),
            "assignment_score": task.assignment_score

        })

    return JsonResponse(result, safe=False)
@csrf_exempt
def update_task_api(request, task_id):

    if request.method != "PUT":
        return JsonResponse({"error": "PUT only"}, status=405)

    try:
        data = json.loads(request.body)

        task = get_object_or_404(Task, task_id=task_id)

        task.title = data.get("title", task.title)
        task.description = data.get("description", task.description)
        task.employee_name = data.get("employee_name", task.employee_name)
        task.employee_id = data.get("employee_id", task.employee_id)
        task.priority = data.get("priority", task.priority)
        task.status = data.get("status", task.status)
        task.required_skills = data.get("required_skills", task.required_skills)
        task.required_position = data.get("required_position", task.required_position)
        task.deadline = data.get("deadline", task.deadline)

        task.save()
        if task.status == "Completed":
            ManagerNotification.objects.create(title="Task Completed",message=f"{task.employee_name} completed '{task.title}'",type="completed")
        return JsonResponse({
            "success": True,
            "message": "Task Updated Successfully"
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def delete_task_api(request, task_id):

    if request.method != "DELETE":
        return JsonResponse({"error": "DELETE only"}, status=405)

    task = get_object_or_404(Task, task_id=task_id)

    task.delete()

    return JsonResponse({
        "success": True,
        "message": "Task Deleted Successfully"
    })


def dashboard_api(request):

    return JsonResponse({
        "total": Task.objects.count(),
        "completed": Task.objects.filter(status="Completed").count(),
        "pending": Task.objects.filter(status="Pending").count(),
        "employees": Employee.objects.count()
    })


def priority_report_api(request):

    priorities = [
        ("P1", "Critical"),
        ("P2", "High"),
        ("P3", "Medium"),
        ("P4", "Low")
    ]

    data = []

    for key, name in priorities:
        data.append({
            "priority": name,
            "count": Task.objects.filter(priority=key).count()
        })

    return JsonResponse(data, safe=False)