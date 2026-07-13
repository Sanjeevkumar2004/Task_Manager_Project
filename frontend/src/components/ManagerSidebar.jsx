import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  FaRobot,
  FaHome,
  FaTasks,
  FaPlusCircle,
  FaChartBar,
  FaUsers,
  FaBell,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

import "./ManagerSidebar.css";


function ManagerSidebar() {


  const navigate = useNavigate();


  const manager =
    JSON.parse(localStorage.getItem("manager")) || {};



  const [notificationCount, setNotificationCount] =
    useState(0);




  useEffect(() => {


    loadNotificationCount();


    window.addEventListener(
      "notificationsUpdated",
      loadNotificationCount
    );



    return () => {


      window.removeEventListener(
        "notificationsUpdated",
        loadNotificationCount
      );


    };


  }, []);





  const loadNotificationCount = async () => {


    try {


      const res = await api.get(
        "/api/accounts/notifications/"
      );



      const unreadCount =
        res.data.filter(
          item => !item.is_read
        ).length;



      setNotificationCount(unreadCount);



    }

    catch(error){


      console.log(
        "Notification count error",
        error
      );


    }


  };






  const logout = () => {


    localStorage.clear();

    sessionStorage.clear();


    navigate("/");


  };








return (



<aside className="manager-sidebar">





{/* Logo */}


<div className="manager-logo">


  <div className="manager-logo-circle">

    <FaRobot />

  </div>



  <div className="manager-logo-text">

    <h2>
      TaskAI
    </h2>

    <span>
      Management System
    </span>


  </div>


</div>







{/* Profile */}



<div className="manager-profile">


  <FaUserCircle 
    className="manager-profile-icon"
  />


  <h3>
    {manager.name || "Manager"}
  </h3>


  <p>
    Administrator
  </p>


</div>









{/* Menu */}



<nav className="manager-menu">






{/* Dashboard */}


<NavLink

to="/manager"

end

className={({isActive}) =>
isActive
?
"manager-sidebar-link active"
:
"manager-sidebar-link"
}

>


<FaHome />

<span>
Dashboard
</span>


</NavLink>









{/* Create Task */}


<NavLink

to="/manager/create-task"

className={({isActive}) =>
isActive
?
"manager-sidebar-link active"
:
"manager-sidebar-link"
}

>


<FaPlusCircle />


<span>
Create Task
</span>


</NavLink>









{/* View Tasks */}


<NavLink

to="/manager/tasks"

className={({isActive}) =>
isActive
?
"manager-sidebar-link active"
:
"manager-sidebar-link"
}

>


<FaTasks />


<span>
View Tasks
</span>


</NavLink>









{/* Employees */}



<NavLink

to="/manager/employees"

className={({isActive}) =>
isActive
?
"manager-sidebar-link active"
:
"manager-sidebar-link"
}

>


<FaUsers />


<span>
Employees
</span>


</NavLink>









{/* Reports */}



<NavLink

to="/manager/reports"

className={({isActive}) =>
isActive
?
"manager-sidebar-link active"
:
"manager-sidebar-link"
}

>


<FaChartBar />


<span>
Reports
</span>


</NavLink>

</nav>
{/* Logout */}



<div className="manager-logout">


<button

className="manager-logout-btn"

onClick={logout}

>


<FaSignOutAlt />


Logout


</button>


</div>





</aside>



);


}


export default ManagerSidebar;