def extract_skills(description):

    skills_db = [
        "python",
        "django",
        "sql",
        "react",
        "java",
        "machine learning",
        "data analysis",
        "flask"
    ]

    description = description.lower()

    found_skills = []

    for skill in skills_db:

        if skill in description:
            found_skills.append(skill)

    return found_skills


def extract_position(description):

    positions = [
        "intern",
        "junior",
        "mid-level",
        "senior",
        "team lead"
    ]

    description = description.lower()

    for position in positions:

        if position in description:
            return position.title()

    return "Junior"