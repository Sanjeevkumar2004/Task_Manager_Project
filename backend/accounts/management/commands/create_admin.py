import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Create or update Django admin user"

    def handle(self, *args, **kwargs):

        User = get_user_model()

        username = os.environ.get("DJANGO_ADMIN_USERNAME")
        email = os.environ.get("DJANGO_ADMIN_EMAIL")
        password = os.environ.get("DJANGO_ADMIN_PASSWORD")

        if not username or not password:
            self.stdout.write(
                self.style.ERROR(
                    "DJANGO_ADMIN_USERNAME or DJANGO_ADMIN_PASSWORD is missing"
                )
            )
            return

        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email or ""
            }
        )

        user.email = email or ""
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.save()

        if created:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Admin user '{username}' created successfully."
                )
            )
        else:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Admin user '{username}' updated successfully."
                )
            )