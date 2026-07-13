from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate


@api_view(['POST'])
def login(request):

    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(
        username=username,
        password=password
    )

    if user is not None:

        role = "Manager" if user.is_superuser else "Employee"

        return Response({
            "username": user.username,
            "role": role
        })

    return Response(
        {
            "error": "Invalid username or password"
        },
        status=400
    )