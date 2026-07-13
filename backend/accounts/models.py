from django.db import models



class Manager(models.Model):

    manager_id = models.AutoField(
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


    password = models.CharField(
        max_length=100
    )


    def __str__(self):

        return self.name





class ManagerNotification(models.Model):

    title = models.CharField(
        max_length=200
    )


    message = models.TextField()


    type = models.CharField(
        max_length=50,
        default="info"
    )


    is_read = models.BooleanField(
        default=False
    )


    created_at = models.DateTimeField(
        auto_now_add=True
    )


    class Meta:

        ordering=[
            "-created_at"
        ]



    def __str__(self):

        return self.title