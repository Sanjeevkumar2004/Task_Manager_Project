import { NavLink, useNavigate } from "react-router-dom";
import {
  FaRobot,
  FaTachometerAlt,
  FaTasks,
  FaChartBar,
  FaSignOutAlt,

} from "react-icons/fa";

import { useEffect, useState } from "react";
import api from "../services/api";
import "./EmployeeSidebar.css";
import { Colors } from "chart.js";

function EmployeeSidebar() {

    const navigate = useNavigate();

    const employee = JSON.parse(localStorage.getItem("employee"));

    const [count, setCount] = useState(0);

    const [profile, setProfile] = useState({});

    useEffect(() => {

        loadProfile();

        loadNotificationCount();

        const interval = setInterval(() => {

            loadNotificationCount();

        },15000);

        return ()=>clearInterval(interval);

    }, []);

    const loadProfile = async () => {

        try{

            const res = await api.get(

    `/api/employees/${profile.employee_id}/`

);

setProfile(res.data);

const employee = JSON.parse(

    localStorage.getItem("employee")

);

localStorage.setItem(

    "employee",

    JSON.stringify({

        ...employee,

        photo: res.data.photo,

        phone: res.data.phone,

        skills: res.data.skills

    })

);

loadProfile();
        }

        catch(err){

            console.log(err);

        }

    };

    const loadNotificationCount = async () => {

        try{

            const res = await api.get(
                "/api/employees/notifications/"
            );

            setCount(res.data.length);

        }

        catch(err){

            console.log(err);

        }

    };

    const logout = () => {

        localStorage.removeItem("employee");

        navigate("/employee-login");

    };

    return (
        

        <div className="employee-sidebar">

            {/* ================= LOGO ================= */}

            <div className="logo-section">

                <div className="logo-circle">

                    <FaRobot />

                </div>

                <div>
                    
                    <h2>Task AI</h2>

                    <p>Smart Task Management</p>

                </div>

            </div>

            {/* ================= MENU ================= */}

            <div className="sidebar-menu">

                <NavLink
                    to="/employee-dashboard"
                    end
                    className={({isActive})=>

                        isActive ? "menu active":"menu"

                    }
                >

                    <FaTachometerAlt />

                    <span>

                        Dashboard

                    </span>

                </NavLink>

                <NavLink
                    to="/employee-tasks"
                    className={({isActive})=>

                        isActive ? "menu active":"menu"

                    }
                >

                    <FaTasks />

                    <span>

                        My Tasks

                    </span>

                </NavLink>

                <NavLink
                    to="/employee-reports"
                    className={({isActive})=>

                        isActive ? "menu active":"menu"

                    }
                >

                    <FaChartBar />

                    <span>

                        Reports

                    </span>

                </NavLink>

            </div>

            {/* ================= LOGOUT ================= */}

            <button
                className="logout-btn"
                onClick={logout}
            >

                <FaSignOutAlt />

                <span>

                    Logout

                </span>

            </button>

        </div>

    );

}

export default EmployeeSidebar;