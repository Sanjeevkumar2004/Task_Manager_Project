import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import EmployeeSidebar from "../components/EmployeeSidebar";
import api from "../services/api";

import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler
} from "chart.js";

import { Doughnut, Line } from "react-chartjs-2";

import {
    FaClipboardList,
    FaCheckCircle,
    FaClock,
    FaSpinner,
    FaChartLine,
    FaRobot,
    FaCalendarAlt
} from "react-icons/fa";

import "./EmployeeReports.css";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler
);

function EmployeeReports() {

    const navigate = useNavigate();

    const employee =
        JSON.parse(localStorage.getItem("employee"));

    const [tasks, setTasks] = useState([]);

    const [total, setTotal] = useState(0);

    const [completed, setCompleted] = useState(0);

    const [pending, setPending] = useState(0);

    const [progress, setProgress] = useState(0);

    const [completion, setCompletion] = useState(0);

    useEffect(() => {

        if (!employee) {

            navigate("/employee-login");

            return;

        }

        loadReport();

    }, []);

    const loadReport = async () => {

        try {

            const res = await api.get(
                `/api/tasks/?employee_id=${employee.employee_id}`
            );

            const data = res.data;

            setTasks(data);

            const totalTasks = data.length;

            const completedTasks =
                data.filter(
                    t => t.status === "Completed"
                ).length;

            const pendingTasks =
                data.filter(
                    t => t.status === "Pending"
                ).length;

            const progressTasks =
                data.filter(
                    t => t.status === "In Progress"
                ).length;

            setTotal(totalTasks);

            setCompleted(completedTasks);

            setPending(pendingTasks);

            setProgress(progressTasks);

            setCompletion(

                totalTasks === 0
                    ? 0
                    : Math.round(
                        (completedTasks / totalTasks) * 100
                    )

            );

        }

        catch (err) {

            console.log(err);

        }
    };
            const doughnutData = {

        labels: [
            "Completed",
            "In Progress",
            "Pending"
        ],

        datasets: [

            {

                data: [

                    completed,

                    progress,

                    pending

                ],

                backgroundColor: [

                    "#10b981",

                    "#3b82f6",

                    "#f59e0b"

                ],

                borderWidth: 0,

                hoverOffset: 8,

                cutout: "72%"

            }

        ]

    };

    const lineData = {

        labels: [

            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun"

        ],

        datasets: [

            {

                label: "Completed",

                data: [

                    1,
                    2,
                    3,
                    2,
                    4,
                    5,
                    completed

                ],

                fill: true,

                borderColor: "#2563eb",

                backgroundColor: "rgba(37,99,235,.12)",

                tension: .45

            }

        ]

    };
    return (

        <div className="d-flex">

            <EmployeeSidebar />

            <div className="employee-report-page">

                {/* ===========================
                        HEADER
                ============================ */}

                <div className="report-header">

                    <div>

                        <h2>

                            Employee Analytics Dashboard

                        </h2>

                        <p>

                            Welcome back,
                            <strong>
                                {" "}
                                {employee?.name}
                            </strong>
                            . Here's your work performance overview.

                        </p>

                    </div>

                    <div className="report-date">

                        <FaCalendarAlt />

                        {new Date().toLocaleDateString()}

                    </div>

                </div>

                {/* ===========================
                        KPI CARDS
                ============================ */}

                <div className="report-cards">

                    <div className="report-card blue">

                        <div>

                            <span>Total Tasks</span>

                            <h2>{total}</h2>

                            <small>

                                Assigned Tasks

                            </small>

                        </div>

                        <FaClipboardList />

                    </div>

                    <div className="report-card green">

                        <div>

                            <span>Completed</span>

                            <h2>{completed}</h2>

                            <small>

                                Finished Tasks

                            </small>

                        </div>

                        <FaCheckCircle />

                    </div>

                    <div className="report-card orange">

                        <div>

                            <span>Pending</span>

                            <h2>{pending}</h2>

                            <small>

                                Waiting Tasks

                            </small>

                        </div>

                        <FaClock />

                    </div>

                    <div className="report-card purple">

                        <div>

                            <span>In Progress</span>

                            <h2>{progress}</h2>

                            <small>

                                Active Tasks

                            </small>

                        </div>

                        <FaSpinner />

                    </div>

                </div>
                                {/* ===========================
                    ANALYTICS SECTION
                ============================ */}

                <div className="report-grid">

                    {/* LEFT SIDE */}

                    <div className="analytics-card">

                        <div className="card-header-custom">

                            <div>

                                <h4>

                                    <FaChartLine />

                                    {" "}Task Status Overview

                                </h4>

                                <p>

                                    Overall distribution of your assigned tasks

                                </p>

                            </div>

                            <div className="completion-circle">

                                {completion}%

                            </div>

                        </div>

                        <div className="chart-box">

                            <Doughnut
                                data={doughnutData}
                                options={{

                                    plugins: {

                                        legend: {

                                            position: "bottom"

                                        }

                                    },

                                    maintainAspectRatio: false

                                }}
                            />

                        </div>

                    </div>

                    {/* RIGHT SIDE */}

                    <div className="analytics-card">

                        <div className="card-header-custom">

                            <div>

                                <h4>

                                    <FaChartLine />

                                    {" "}Weekly Productivity

                                </h4>

                                <p>

                                    Performance trend this week

                                </p>

                            </div>

                        </div>

                        <div className="line-chart">

                            <Line

                                data={lineData}

                                options={{

                                    responsive: true,

                                    maintainAspectRatio: false,

                                    plugins: {

                                        legend: {

                                            display: false

                                        }

                                    },

                                    scales: {

                                        y: {

                                            beginAtZero: true

                                        }

                                    }

                                }}

                            />

                        </div>

                    </div>

                </div>

                {/* ===========================
                    AI INSIGHTS
                ============================ */}

                <div className="insight-section">

                    <div className="insight-card">

                        <div>

                            <span>

                                Productivity Score

                            </span>

                            <h3>

                                {completion}%

                            </h3>

                        </div>

                        <FaRobot />

                    </div>

                    <div className="insight-card">

                        <div>

                            <span>

                                Performance

                            </span>

                            <h3>

                                {completion >= 90
                                    ? "Excellent"
                                    : completion >= 70
                                    ? "Good"
                                    : completion >= 40
                                    ? "Average"
                                    : "Needs Improvement"}

                            </h3>

                        </div>

                        <FaChartLine />

                    </div>

                    <div className="insight-card">

                        <div>

                            <span>

                                Pending Tasks

                            </span>

                            <h3>

                                {pending}

                            </h3>

                        </div>

                        <FaClock />

                    </div>

                    <div className="insight-card">

                        <div>

                            <span>

                                AI Recommendation

                            </span>

                            <p>

                                {pending === 0
                                    ? "Excellent work. Keep maintaining your productivity."
                                    : "Complete pending tasks to improve your performance score."}

                            </p>

                        </div>

                        <FaRobot />

                    </div>

                </div>
                                {/* ===========================
                    RECENT TASKS
                ============================ */}

                <div className="recent-card">

                    <div className="recent-header">

                        <div>

                            <h3>

                                Recent Task Activity

                            </h3>

                            <p>

                                Latest assigned tasks and their current status

                            </p>

                        </div>

                    </div>

                    <div className="table-responsive">

                        <table className="table align-middle report-table">

                            <thead>

                                <tr>

                                    <th>Task ID</th>

                                    <th>Title</th>

                                    <th>Priority</th>

                                    <th>Status</th>

                                    <th>Deadline</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    tasks.length === 0 ?

                                    (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="text-center py-5"
                                            >

                                                No Tasks Available

                                            </td>

                                        </tr>

                                    )

                                    :

                                    (

                                        tasks
                                        .slice(0,8)
                                        .map((task)=>(

                                            <tr
                                                key={task.task_id}
                                            >

                                                <td>

                                                    {task.task_id}

                                                </td>

                                                <td>

                                                    {task.title}

                                                </td>

                                                <td>

                                                    <span
                                                        className={`priority-badge ${task.priority}`}
                                                    >

                                                        {task.priority}

                                                    </span>

                                                </td>

                                                <td>

                                                    <span
                                                        className={`status-badge ${task.status.replace(/\s/g,"")}`}
                                                    >

                                                        {task.status}

                                                    </span>

                                                </td>

                                                <td>

                                                    {task.deadline}

                                                </td>

                                            </tr>

                                        ))

                                    )

                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </div>

    );

}
export default EmployeeReports;