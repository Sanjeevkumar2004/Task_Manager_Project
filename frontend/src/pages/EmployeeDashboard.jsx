import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import EmployeeSidebar from "../components/EmployeeSidebar";

import {
    FaTasks,
    FaCheckCircle,
    FaSpinner,
    FaClock,
    FaCalendarAlt,
    FaBell,
    FaChartLine,
    FaArrowUp,
    FaUserCircle,
    FaFire,
    FaAward,
    FaClipboardList,
    FaCalendarCheck
} from "react-icons/fa";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

import { Line, Doughnut } from "react-chartjs-2";

import "./EmployeeDashboard.css";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
);

function EmployeeDashboard() {
     

    const navigate = useNavigate();

    const employee = JSON.parse(
        localStorage.getItem("employee")
    );

    const [profile,setProfile]=useState({});

    const [tasks,setTasks]=useState([]);

    const [todayTasks,setTodayTasks]=useState([]);

    const [upcoming,setUpcoming]=useState([]);

    const [completed,setCompleted]=useState(0);

    const [pending,setPending]=useState(0);

    const [progress,setProgress]=useState(0);

    useEffect(()=>{

        if(!employee){

            navigate("/employee-login");

            return;

        }

        loadDashboard();

    },[]);

    const loadDashboard=async()=>{

        await Promise.all([

            loadProfile(),

            loadTasks()

        ]);

    };

    const loadProfile=async()=>{

        try{

            const res=await api.get(

                `/api/employees/${employee.employee_id}/`

            );

            setProfile(res.data);

        }

        catch(err){

            console.log(err);

        }

    };

    const loadTasks = async () => {

    try {

        const res = await api.get(
            `/api/tasks/?employee_id=${employee.employee_id}`
        );

        const data = res.data;

        setTasks(data);


        setCompleted(
            data.filter(
                t => t.status === "Completed"
            ).length
        );


        setPending(
            data.filter(
                t => t.status === "Pending"
            ).length
        );


        setProgress(
            data.filter(
                t => t.status === "In Progress"
            ).length
        );


        const today = new Date()
            .toISOString()
            .split("T")[0];


        setTodayTasks(
            data.filter(
                t => t.deadline === today
            )
        );


        const currentDate = new Date();

        currentDate.setHours(0,0,0,0);


        const upcomingTasks = data
        .filter(task => {

            const deadline = new Date(task.deadline);

            deadline.setHours(0,0,0,0);


            return (
                deadline >= currentDate &&
                task.status !== "Completed"
            );

        })
        .sort(
            (a,b) =>
            new Date(a.deadline) -
            new Date(b.deadline)
        )
        .slice(0,5);


        setUpcoming(upcomingTasks);


    }

    catch(err){

        console.log(err);

    }

};
const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) {
        greeting = "Good Morning";
    }
    else if (hour < 17) {
        greeting = "Good Afternoon";
    }
    const completionRate =
    tasks.length === 0
        ? 0
        : Math.round(
            (completed / tasks.length) * 100
        );

    return (

<div className="employee-dashboard">

    <EmployeeSidebar />

    <main className="dashboard-main">

        {/* ==========================================
                TOP NAVBAR
        =========================================== */}

        <div className="top-navbar">

            <div>

                <h2>

                    Employee Dashboard

                </h2>

                <p>

                    Welcome back, {employee?.name}

                </p>

            </div>
            <div className="top-right">

    <div
        className="profile-dropdown"
        onClick={() =>
            navigate("/employee-profile")
        }
    >

        {
            profile.photo ?

            <img
                src={`http://127.0.0.1:8000${profile.photo}`}
                alt=""
            />

            :

            <FaUserCircle className="profile-icon"/>
        }

        <div>

            <h6>

                {employee?.name}

            </h6>

            <small>

                {profile.position}

            </small>

        </div>

    </div>

</div>

        </div>

        {/* ==========================================
                WELCOME BANNER
        =========================================== */}

        <section className="welcome-banner">

            <div className="welcome-left">

                <span className="welcome-tag">

                    {greeting}

                </span>

                <h1>

                    {employee?.name}

                </h1>

                <p>

                    Stay focused on today's priorities and keep your work progressing.

                </p>

                <div className="welcome-buttons">

                    <button
    className="primary-btn"
    onClick={() => navigate("/employee-tasks")}
>

    <FaClipboardList />

    <span>
        View My Tasks
    </span>

</button>


                </div>

            </div>

            <div className="welcome-right">

                <div className="employee-profile-card">

                    {

                        profile.photo ?

                        <img

                            src={`http://127.0.0.1:8000${profile.photo}`}

                            alt="Profile"

                        />

                        :

                        <FaUserCircle className="large-avatar"/>

                    }

                    <h4>

                        {employee?.name}

                    </h4>

                    <span>

                        {profile.position}

                    </span>

                    <small>

                        Employee ID : {employee?.employee_id}

                    </small>

                </div>

            </div>

        </section>

        {/* ==========================================
                KPI CARDS
        =========================================== */}

        <section className="employee-stats-grid">

    <div className="employee-stat-card total-card">

        <div>

            <small>Total Tasks</small>

            <h2>{tasks.length}</h2>

            <span>Assigned Tasks</span>

        </div>

        <FaTasks className="employee-stat-icon"/>

    </div>

    <div className="employee-stat-card completed-card">

        <div>

            <small>Completed</small>

            <h2>{completed}</h2>

            <span>Finished Successfully</span>

        </div>

        <FaCheckCircle className="employee-stat-icon"/>

    </div>

    <div className="employee-stat-card pending-card">

        <div>

            <small>Pending</small>

            <h2>{pending}</h2>

            <span>Waiting to Start</span>

        </div>

        <FaClock className="employee-stat-icon"/>

    </div>

    <div className="employee-stat-card progress-card">

        <div>

            <small>In Progress</small>

            <h2>{progress}</h2>

            <span>Currently Working</span>

        </div>

        <FaSpinner className="employee-stat-icon"/>

    </div>

</section>
                {/* ==========================================
                CURRENT TASKS
        =========================================== */}

        <div className="dashboard-row">

            <div className="dashboard-card tasks-card">

                <div className="card-header">

                    <div>

                        <h3>

                            <FaClipboardList />

                            &nbsp;Current Tasks

                        </h3>

                        <small>

                            Your active assignments

                        </small>

                    </div>

                    <button className="view-btn">

                        View All

                    </button>

                </div>

                <table className="task-table">

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Title</th>

                            <th>Priority</th>

                            <th>Deadline</th>

                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            tasks.length===0 ?

                            <tr>

                                <td

                                    colSpan="5"

                                    className="text-center"

                                >

                                    No Tasks Assigned

                                </td>

                            </tr>

                            :

                            tasks

                            .slice(0,5)

                            .map(task=>(

                                <tr key={task.task_id}>

                                    <td>

                                        #{task.task_id}

                                    </td>

                                    <td>

                                        {task.title}

                                    </td>

                                    <td>

                                        <span

                                            className={`priority-badge ${task.priority.toLowerCase()}`}

                                        >

                                            {task.priority}

                                        </span>

                                    </td>

                                    <td>

                                        <FaCalendarAlt />

                                        &nbsp;

                                        {task.deadline}

                                    </td>

                                    <td>

                                        <span

                                            className={`status-badge ${task.status.replace(/\s/g,"").toLowerCase()}`}

                                        >

                                            {task.status}

                                        </span>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

            {/* ==========================================
                    UPCOMING DEADLINES
            =========================================== */}

            <div className="employee-dashboard-box">

<h3>
    Upcoming Deadlines
</h3>


{
    upcoming.length > 0 ?

    upcoming.map(task => (

        <div
            className="employee-deadline-card"
            key={task.task_id}
        >

            <h4>
                {task.title}
            </h4>


            <span>

                <FaCalendarAlt />

                &nbsp;

                {
                    new Date(task.deadline)
                    .toLocaleDateString("en-GB")
                }

            </span>


        </div>

    ))

    :

    <p>
        No upcoming deadlines
    </p>

}


</div>
</div>
        {/* ==========================================
                RECENT ACTIVITY
        =========================================== */}

        <div className="dashboard-card activity-card">

            <div className="card-header">

                <h3>

                    <FaAward />

                    &nbsp;Recent Activity

                </h3>

            </div>

            <div className="activity-list">

                <div className="activity-item">

                    <div className="activity-icon success">

                        <FaCheckCircle />

                    </div>

                    <div>

                        <h5>

                            Task Completed

                        </h5>

                        <small>

                            Great job completing assigned work.

                        </small>

                    </div>

                </div>

                <div className="activity-item">

                    <div className="activity-icon warning">

                        <FaClock />

                    </div>

                    <div>

                        <h5>

                            Pending Review

                        </h5>

                        <small>

                            Some tasks are waiting for completion.

                        </small>

                    </div>

                </div>

                <div className="activity-item">

                    <div className="activity-icon primary">

                        <FaChartLine />

                    </div>

                    <div>

                        <h5>

                            Performance Updated

                        </h5>

                        <small>

                            Dashboard analytics refreshed.

                        </small>

                    </div>

                </div>

            </div>

        </div>
                {/* ==========================================
                ANALYTICS
        =========================================== */}

        <div className="dashboard-row mt-4">

            {/* Weekly Performance */}

            <div className="dashboard-card chart-card">

                <div className="card-header">

                    <h3>

                        <FaChartLine />

                        &nbsp;Weekly Performance

                    </h3>

                </div>

                <div className="chart-container">

                    <Line

                        data={{

                            labels:[
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                                "Sun"
                            ],

                            datasets:[

                                {

                                    label:"Performance",

                                    data:[
                                        65,
                                        72,
                                        76,
                                        81,
                                        84,
                                        90,
                                        completionRate
                                    ],

                                    borderColor:"#2563eb",

                                    backgroundColor:
                                    "rgba(37,99,235,.15)",

                                    fill:true,

                                    tension:.4

                                }

                            ]

                        }}

                        options={{

                            responsive:true,

                            maintainAspectRatio:false,

                            plugins:{

                                legend:{

                                    display:false

                                }

                            },

                            scales:{

                                y:{

                                    beginAtZero:true,

                                    max:100

                                }

                            }

                        }}

                    />

                </div>

            </div>

            {/* Task Distribution */}

            <div className="dashboard-card doughnut-card">

                <div className="card-header">

                    <h3>

                        Task Distribution

                    </h3>

                </div>

                <div className="chart-container small">

                    <Doughnut

                        data={{

                            labels:[

                                "Completed",

                                "Pending",

                                "In Progress"

                            ],

                            datasets:[

                                {

                                    data:[

                                        completed,

                                        pending,

                                        progress

                                    ],

                                    backgroundColor:[

                                        "#10b981",

                                        "#f59e0b",

                                        "#3b82f6"

                                    ],

                                    borderWidth:0

                                }

                            ]

                        }}

                        options={{

                            responsive:true,

                            plugins:{

                                legend:{

                                    position:"bottom"

                                }

                            }

                        }}

                    />

                </div>

            </div>

        </div>

        {/* ==========================================
                PRODUCTIVITY
        =========================================== */}

        <div className="dashboard-row mt-4">

            <div className="dashboard-card productivity-card">

                <div className="product-circle">

                    <div className="circle">

                        <span>

                            {completionRate}%

                        </span>

                    </div>

                </div>

                <div>

                    <h3>

                        Productivity Score

                    </h3>

                    <p>

                        Based on completed tasks and current workload.

                    </p>

                </div>

            </div>

            <div className="dashboard-card achievement-card">

                <h3>

                    Achievements

                </h3>

                <div className="achievement-grid">

                    <div className="achievement">

                        🏆

                        <span>

                            Top Performer

                        </span>

                    </div>

                    <div className="achievement">

                        ⚡

                        <span>

                            Fast Worker

                        </span>

                    </div>

                    <div className="achievement">

                        🎯

                        <span>

                            Accuracy

                        </span>

                    </div>

                    <div className="achievement">

                        🚀

                        <span>

                            Consistency

                        </span>

                    </div>

                </div>

            </div>

        </div>

    </main>

</div>

);

}

export default EmployeeDashboard;