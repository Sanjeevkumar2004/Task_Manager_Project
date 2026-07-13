def find_skill_gap(task_skills, employee_skills):

    task_skills = [
        skill.strip().lower()
        for skill in task_skills.split(",")
    ]

    employee_skills = [
        skill.strip().lower()
        for skill in employee_skills.split(",")
    ]

    missing_skills = []

    for skill in task_skills:

        if skill not in employee_skills:
            missing_skills.append(skill)

    return missing_skills