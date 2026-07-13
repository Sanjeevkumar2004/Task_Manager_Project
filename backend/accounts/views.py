from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view

from rest_framework.response import Response

from rest_framework import status


from .models import Manager
from .models import ManagerNotification





# =========================
# MANAGER LOGIN
# =========================


@api_view(["POST"])
def manager_login(request):


    email = request.data.get("email")

    password = request.data.get("password")



    manager = Manager.objects.filter(

        email=email,

        password=password

    ).first()



    if manager is None:


        return Response(

            {
                "success":False,

                "message":
                "Invalid Email or Password"
            },

            status=401

        )





    request.session.flush()



    request.session["manager_id"] = (

        manager.manager_id

    )



    request.session.modified=True





    return Response(

        {


        "success":True,


        "manager":{


            "manager_id":
            manager.manager_id,


            "name":
            manager.name,


            "email":
            manager.email


        }


        }

    )









# =========================
# PROFILE GET
# =========================


@api_view(["GET"])
def get_profile(request):


    manager_id = request.session.get(
        "manager_id"
    )


    if not manager_id:


        return Response(

            {
            "message":
            "Login required"
            },

            status=401

        )





    manager=get_object_or_404(

        Manager,

        manager_id=manager_id

    )




    return Response(

        {


        "name":
        manager.name,


        "email":
        manager.email,


        "phone":
        manager.phone


        }

    )









# =========================
# UPDATE PROFILE
# =========================


@api_view(["PUT"])
def update_profile(request):


    manager_id=request.session.get(

        "manager_id"

    )



    if not manager_id:


        return Response(

            {
            "message":
            "Login required"
            },

            status=401

        )





    manager=get_object_or_404(

        Manager,

        manager_id=manager_id

    )




    manager.name=request.data.get(

        "name",

        manager.name

    )



    manager.email=request.data.get(

        "email",

        manager.email

    )



    manager.phone=request.data.get(

        "phone",

        manager.phone

    )




    manager.save()




    return Response(

        {

        "success":True,

        "message":
        "Profile Updated"

        }

    )









# =========================
# CHANGE PASSWORD
# =========================


@api_view(["PUT"])
def change_password(request):


    manager_id=request.session.get(

        "manager_id"

    )



    if not manager_id:


        return Response(

            {
            "message":
            "Login required"
            },

            status=401

        )





    manager=get_object_or_404(

        Manager,

        manager_id=manager_id

    )




    current=request.data.get(

        "current"

    )


    new=request.data.get(

        "new"

    )




    if current != manager.password:


        return Response(

            {
            "message":
            "Wrong Current Password"
            },

            status=400

        )




    manager.password=new


    manager.save()




    return Response(

        {

        "success":True,

        "message":
        "Password Changed"

        }

    )









# =========================
# LOGOUT
# =========================


@api_view(["POST"])
def logout(request):


    request.session.flush()



    return Response(

        {

        "success":True,

        "message":
        "Logout Successful"

        }

    )









# =========================
# NOTIFICATIONS
# =========================


@api_view(["GET"])
def manager_notifications(request):


    data=[]



    notifications = ManagerNotification.objects.all()



    for n in notifications:


        data.append(

            {


            "id":
            n.id,


            "title":
            n.title,


            "message":
            n.message,


            "type":
            n.type,


            "is_read":
            n.is_read,


            "created_at":
            n.created_at


            }

        )



    return Response(data)









# =========================
# MARK ALL READ
# =========================


@api_view(["POST"])
def mark_all_notifications_read(request):


    ManagerNotification.objects.update(

        is_read=True

    )



    return Response(

        {

        "success":True

        }

    )









# =========================
# MARK SINGLE READ
# =========================


@api_view(["POST"])
def mark_notification_read(request,id):


    notification=get_object_or_404(

        ManagerNotification,

        id=id

    )



    notification.is_read=True


    notification.save()



    return Response(

        {

        "success":True

        }

    )









# =========================
# DELETE NOTIFICATION
# =========================


@api_view(["DELETE"])
def delete_notification(request,id):


    notification=get_object_or_404(

        ManagerNotification,

        id=id

    )


    notification.delete()



    return Response(

        {

        "success":True

        }

    )