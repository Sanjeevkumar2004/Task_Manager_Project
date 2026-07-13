# from employees.models import Employee
# from .ai_matcher import calculate_score


# def find_best_employee(task):

#     employees = Employee.objects.all()

#     if not employees.exists():
#         return None, 0

#     best_employee = None
#     best_score = -1

#     for employee in employees:

#         score = calculate_score(task, employee)

#         if score > best_score:
#             best_score = score
#             best_employee = employee

#     return best_employee, best_score
from employees.models import Employee
from .ai_matcher import calculate_score

def find_best_employee(task):

    print("Task Skills :", task.required_skills)
    print("Task Position :", task.required_position)

    best_employee = None
    best_score = -1

    for employee in Employee.objects.all():

        score = calculate_score(task, employee)

        print(
            employee.name,
            employee.skills,
            employee.position,
            score
        )

        if score > best_score:
            best_score = score
            best_employee = employee

    print("Selected :", best_employee)
    print("Score :", best_score)

    return best_employee, best_score