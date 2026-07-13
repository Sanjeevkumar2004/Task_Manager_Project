from django.urls import path

from . import views



urlpatterns=[



    path(
        "manager/login/",
        views.manager_login
    ),



    path(
        "profile/",
        views.get_profile
    ),



    path(
        "profile/update/",
        views.update_profile
    ),



    path(
        "change-password/",
        views.change_password
    ),



    path(
        "logout/",
        views.logout
    ),



    path(
        "notifications/",
        views.manager_notifications
    ),



    path(
        "notifications/read-all/",
        views.mark_all_notifications_read
    ),



    path(
        "notifications/<int:id>/read/",
        views.mark_notification_read
    ),



    path(
        "notifications/<int:id>/delete/",
        views.delete_notification
    ),


]