from django.db import models


class Employee(models.Model):

    employee_id = models.AutoField(
        primary_key=True
    )

    name = models.CharField(
        max_length=100
    )

    email = models.EmailField(
        unique=True
    )

    phone = models.CharField(
        max_length=15,
        blank=True,
        default=""
    )

    position = models.CharField(
        max_length=100
    )

    skills = models.TextField()

    experience = models.IntegerField(
        default=0
    )

    current_workload = models.IntegerField(
        default=0
    )

    performance_score = models.IntegerField(
        default=100
    )

    status = models.CharField(
        max_length=20,
        default="Active"
    )

    password = models.CharField(
        max_length=100
    )

    photo = models.ImageField(
        upload_to="employees/",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.name
class Notification(models.Model):

    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE
    )

    title = models.CharField(max_length=200)

    message = models.TextField()

    icon = models.CharField(
        max_length=30,
        default="bell"
    )

    color = models.CharField(
        max_length=30,
        default="primary"
    )

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
    