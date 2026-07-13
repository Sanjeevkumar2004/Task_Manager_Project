def calculate_score(task, employee):

    score = 0

    # Skill Match (30)

    task_skills = [
        skill.strip().lower()
        for skill in task.required_skills.split(",")
    ]

    employee_skills = [
        skill.strip().lower()
        for skill in employee.skills.split(",")
    ]

    matched_skills = 0

    for skill in task_skills:
        if skill in employee_skills:
            matched_skills += 1

    if len(task_skills) > 0:
        score += (
            matched_skills / len(task_skills)
        ) * 30

    # Position Match (30)

    if (
        task.required_position.lower()
        ==
        employee.position.lower()
    ):
        score += 30

    # Experience (15)

    if employee.experience >= 5:
        score += 15

    elif employee.experience >= 3:
        score += 10

    elif employee.experience >= 1:
        score += 5

    # Performance (15)

    score += (
        employee.performance_score / 100
    ) * 15

    # Workload (10)

    if employee.current_workload <= 2:
        score += 10

    elif employee.current_workload <= 5:
        score += 5

    return round(score, 2)