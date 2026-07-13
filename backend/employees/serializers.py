from rest_framework import serializers
from .models import Employee, Notification


class EmployeeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Employee
        fields = "__all__"


class NotificationSerializer(serializers.ModelSerializer):

    employee_name = serializers.CharField(
        source="employee.name",
        read_only=True
    )

    class Meta:

        model = Notification

        fields = [

            "id",

            "employee",

            "employee_name",

            "title",

            "message",

            "icon",

            "color",

            "is_read",

            "created_at"

        ]