import { useEffect, useState } from "react";
import api from "../services/api";

import {
  FaTasks,
  FaCheckCircle,
  FaClock,
  FaUsers,
  FaExclamationTriangle,
  FaChartLine,
  FaArrowUp,
} from "react-icons/fa";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie, Line, Bar } from "react-chartjs-2";

import "./ManagerDashboard.css";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

function ManagerDashboard() {
const [stats, setStats] = useState({
  total: 0,
  completed: 0,
  inProgress: 0,
  pending: 0,
  employees: 0,
});

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {

  try {

    const res = await api.get("/api/tasks/");

    const tasks = res.data;

    const total = tasks.length;

    const completed = tasks.filter(
      t => t.status === "Completed"
    ).length;

    const inProgress = tasks.filter(
  t => t.status === "In Progress"
).length;


const pending = tasks.filter(
  t => t.status === "Pending"
).length;

    const employees = new Set(
      tasks.map(
        t =>
          t.employee_name ||
          t.assigned_employee
      )
    ).size;

    setStats({
  total,
  completed,
  inProgress,
  pending,
  employees
});

  }

  catch (err) {

    console.log(err);

  }

};

  const completion =
    stats.total === 0
      ? 0
      : Math.round((stats.completed / stats.total) * 100);

  const overdue = Math.max(
    stats.total - stats.completed - stats.pending,
    0
  );

  /* ---------------- Pie Chart ---------------- */

  const pieData = {
    labels: ["Completed", "In Progress", "Pending"],

    datasets: [
      {
data: [
  stats.completed,
  stats.inProgress,
  stats.pending,
],

        backgroundColor: [
          "#22c55e",
          "#f59e0b",
          "#ef4444",
        ],

        borderWidth: 0,
      },
    ],
  };

  /* ---------------- Weekly Progress ---------------- */

  const lineData = {
    labels: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ],

    datasets: [
      {
        label: "Completed Tasks",

        data: [
          5,
          8,
          10,
          12,
          15,
          18,
          stats.completed,
        ],

        borderColor: "#2563eb",

        backgroundColor: "rgba(37,99,235,.2)",

        tension: 0.4,

        fill: true,
      },
    ],
  };

  /* ---------------- Priority Chart ---------------- */

  const barData = {
    labels: ["P1", "P2", "P3", "P4"],

    datasets: [
      {
        label: "Tasks",

        data: [10, 18, 8, 5],

        backgroundColor: [
          "#ef4444",
          "#f59e0b",
          "#3b82f6",
          "#10b981",
        ],

        borderRadius: 8,
      },
    ],
  };

return (
<div className="manager-dashboard-page">
        {/* Header */}

        <div className="manager-dashboard-header">

          <div>

            <h1>Good Morning 👋</h1>

            <p>
              Welcome back.
              Here is today's business overview.
            </p>

          </div>

          <p1 className="manager-performance-btn">
            <FaArrowUp />
            Team Performance
          </p1>

        </div>

        {/* KPI Cards */}

        <div className="manager-dashboard-cards">

          <div className="manager-dashboard-card manager-blue">

            <div>

              <p>Total Tasks</p>

              <h2>{stats.total}</h2>

            </div>

            <FaTasks className="manager-card-icon" />

          </div>

          <div className="manager-dashboard-card manager-green">

            <div>

              <p>Completed</p>

              <h2>{stats.completed}</h2>

            </div>

            <FaCheckCircle className="manager-card-icon" />

          </div>

          <div className="manager-dashboard-card manager-orange">

            <div>

              <p>In Progress</p>

<h2>{stats.inProgress}</h2>

            </div>

            <FaClock className="manager-card-icon" />

          </div>
          <div className="manager-dashboard-card manager-red">

  <div>

    <p>Pending</p>

<h2>{stats.pending}</h2>

  </div>

  <FaExclamationTriangle className="manager-card-icon" />

</div>

          <div className="manager-dashboard-card manager-purple">

            <div>

              <p>Employees</p>

              <h2>{stats.employees}</h2>

            </div>

            <FaUsers className="manager-card-icon" />

          </div>

          <div className="manager-dashboard-card manager-cyan">

            <div>

              <p>Productivity</p>

              <h2>{completion}%</h2>

            </div>

            <FaChartLine className="manager-card-icon" />

          </div>

        </div>

        {/* Charts */}

        <div className="manager-dashboard-grid">

          <div className="manager-dashboard-left">

            <div className="manager-dashboard-box">

              <h3>Task Status Overview</h3>

              <Pie data={pieData} />

            </div>

            <div className="manager-dashboard-box">

              <h3>Weekly Progress</h3>

              <Line data={lineData} />

            </div>
                      </div>

          {/* Right Side */}

          <div className="manager-dashboard-right">

            <div className="manager-dashboard-box">

              <h3>Priority Distribution</h3>

              <Bar data={barData} />

            </div>

            {/* Employee Workload */}

            <div className="manager-dashboard-box">

              <h3>Employee Workload</h3>

              <div className="manager-workload-item">

                <span>John</span>

                <div className="manager-workload-bar">

                  <div
                    className="manager-workload-fill"
                    style={{ width: "85%" }}
                  ></div>

                </div>

                <strong>85%</strong>

              </div>

              <div className="manager-workload-item">

                <span>Priya</span>

                <div className="manager-workload-bar">

                  <div
                    className="manager-workload-fill"
                    style={{ width: "72%" }}
                  ></div>

                </div>

                <strong>72%</strong>

              </div>

              <div className="manager-workload-item">

                <span>Arun</span>

                <div className="manager-workload-bar">

                  <div
                    className="manager-workload-fill"
                    style={{ width: "60%" }}
                  ></div>

                </div>

                <strong>60%</strong>

              </div>

              <div className="manager-workload-item">

                <span>Karthick</span>

                <div className="manager-workload-bar">

                  <div
                    className="manager-workload-fill"
                    style={{ width: "45%" }}
                  ></div>

                </div>

                <strong>45%</strong>

              </div>

            </div>

          </div>

        </div>

        {/* Bottom Section */}

        <div className="manager-dashboard-bottom">

          {/* Recent Activities */}

          <div className="manager-dashboard-box">

            <h3>Recent Activities</h3>

            <div className="manager-activity-list">

              <div className="manager-activity-item">

                <div className="manager-activity-dot"></div>

                <div>

                  <strong>New task assigned to Priya</strong>

                  <p>Today • 09:30 AM</p>

                </div>

              </div>

              <div className="manager-activity-item">

                <div className="manager-activity-dot"></div>

                <div>

                  <strong>Dashboard module completed</strong>

                  <p>Today • 11:15 AM</p>

                </div>

              </div>

              <div className="manager-activity-item">

                <div className="manager-activity-dot"></div>

                <div>

                  <strong>New employee joined</strong>

                  <p>Yesterday</p>

                </div>

              </div>

              <div className="manager-activity-item">

                <div className="manager-activity-dot"></div>

                <div>

                  <strong>Monthly report generated</strong>

                  <p>Yesterday</p>

                </div>

              </div>

            </div>

          </div>

          {/* Upcoming Deadlines */}

          <div className="manager-dashboard-box">

            <h3>Upcoming Deadlines</h3>

            <div className="manager-deadline-card">

              <h4>Employee Portal UI</h4>

              <span>Tomorrow</span>

            </div>

            <div className="manager-deadline-card">

              <h4>Database Integration</h4>

              <span>15 Jul</span>

            </div>

            <div className="manager-deadline-card">

              <h4>Testing Phase</h4>

              <span>18 Jul</span>

            </div>

          </div>

        </div>

        {/* AI Recommendations */}

        <div className="manager-dashboard-box manager-ai-section">

          <h3>AI Recommendations</h3>

          <div className="manager-ai-card">

            <h4>📈 Productivity Analysis</h4>

            <p>

              Team productivity is currently

              <strong> {completion}%</strong>.

              Continue focusing on completing
              in-progress tasks before assigning
              new high-priority work.

            </p>

          </div>

          <div className="manager-ai-card">

            <h4>👨‍💻 Employee Suggestion</h4>

            <p>

              Employees with lower workloads can
              be assigned additional tasks to
              balance the team's capacity.

            </p>

          </div>

          <div className="manager-ai-card">

            <h4>⚠ Priority Recommendation</h4>

            <p>

              Review pending tasks first to reduce
project delays and improve overall
completion rates.

            </p>

          </div>

        </div>

      </div>
  );
}

export default ManagerDashboard;