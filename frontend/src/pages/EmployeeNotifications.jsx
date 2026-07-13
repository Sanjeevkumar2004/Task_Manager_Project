import { useEffect, useState } from "react";
import EmployeeSidebar from "../components/EmployeeSidebar";
import api from "../services/api";
import "./EmployeeNotifications.css";

import {
    FaBell,
    FaSearch,
    FaCheckCircle,
    FaTrash,
    FaTasks,
    FaClock,
    FaBullhorn,
    FaFilter
} from "react-icons/fa";

function EmployeeNotifications() {

    const [notifications, setNotifications] = useState([]);

    const [filtered, setFiltered] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("All");

    useEffect(() => {

        loadNotifications();

    }, []);

    useEffect(() => {

        applyFilter();

    }, [notifications, search, filter]);

    const loadNotifications = async () => {

        try {

            const res = await api.get(
                "/api/employees/notifications/"
            );

            setNotifications(res.data);

            setLoading(false);

        }

        catch (err) {

            console.log(err);

            setLoading(false);

        }

    };

    const applyFilter = () => {

        let data = [...notifications];

        if (filter === "Unread") {

            data = data.filter(
                n => !n.is_read
            );

        }

        if (filter === "Read") {

            data = data.filter(
                n => n.is_read
            );

        }

        if (search.trim() !== "") {

            data = data.filter(n =>

                n.title
                    .toLowerCase()
                    .includes(search.toLowerCase())

                ||

                n.message
                    .toLowerCase()
                    .includes(search.toLowerCase())

            );

        }

        setFiltered(data);

    };

    const markRead = async (id) => {

        try {

            await api.put(
                `/api/employees/notifications/read/${id}/`
            );

            loadNotifications();

        }

        catch (err) {

            console.log(err);

        }

    };

    const deleteNotification = async (id) => {

        if (!window.confirm(
            "Delete notification?"
        )) return;

        try {

            await api.delete(
                `/api/employees/notifications/delete/${id}/`
            );

            loadNotifications();

        }

        catch (err) {

            console.log(err);

        }

    };

    const markAllRead = async () => {

        try {

            await api.put(
                "/api/employees/notifications/read-all/"
            );

            loadNotifications();

        }

        catch (err) {

            console.log(err);

        }

    };

    const clearAll = async () => {

        if (!window.confirm(
            "Clear all notifications?"
        )) return;

        try {

            await api.delete(
                "/api/employees/notifications/clear/"
            );

            loadNotifications();

        }

        catch (err) {

            console.log(err);

        }

    };
        return (

        <div className="d-flex">

            <EmployeeSidebar />

            <div className="notifications-container">

                {/* ==========================
                    PAGE HEADER
                ========================== */}

                <div className="page-header">

                    <div>

                        <h2>

                            <FaBell className="me-2 text-primary" />

                            Notifications

                        </h2>

                        <p>

                            View all your task updates, reminders and announcements.

                        </p>

                    </div>

                    <div className="header-buttons">

                        <button
                            className="btn btn-primary"
                            onClick={markAllRead}
                        >

                            <FaCheckCircle />

                            <span>Mark All Read</span>

                        </button>

                        <button
                            className="btn btn-danger"
                            onClick={clearAll}
                        >

                            <FaTrash />

                            <span>Clear All</span>

                        </button>

                    </div>

                </div>

                {/* ==========================
                    STATISTICS
                ========================== */}

                <div className="stats-grid">

                    <div className="stat-card blue">

                        <FaBell />

                        <div>

                            <h3>{notifications.length}</h3>

                            <p>Total Notifications</p>

                        </div>

                    </div>

                    <div className="stat-card orange">

                        <FaClock />

                        <div>

                            <h3>

                                {
                                    notifications.filter(
                                        n => !n.is_read
                                    ).length
                                }

                            </h3>

                            <p>Unread</p>

                        </div>

                    </div>

                    <div className="stat-card green">

                        <FaCheckCircle />

                        <div>

                            <h3>

                                {
                                    notifications.filter(
                                        n => n.is_read
                                    ).length
                                }

                            </h3>

                            <p>Read</p>

                        </div>

                    </div>

                    <div className="stat-card purple">

                        <FaTasks />

                        <div>

                            <h3>

                                {
                                    notifications.filter(
                                        n =>
                                            n.title
                                                .toLowerCase()
                                                .includes("task")
                                    ).length
                                }

                            </h3>

                            <p>Task Updates</p>

                        </div>

                    </div>

                </div>

                {/* ==========================
                    SEARCH + FILTER
                ========================== */}

                <div className="toolbar">

                    <div className="search-box">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="filter-box">

                        <FaFilter />

                        <select
                            value={filter}
                            onChange={(e) =>
                                setFilter(
                                    e.target.value
                                )
                            }
                        >

                            <option>All</option>

                            <option>Unread</option>

                            <option>Read</option>

                        </select>

                    </div>

                </div>
                                {/* ==========================
                    NOTIFICATION LIST
                ========================== */}

                <div className="notification-list">

                    {loading ? (

                        <div className="empty-state">

                            <h4>Loading notifications...</h4>

                        </div>

                    ) : filtered.length === 0 ? (

                        <div className="empty-state">

                            <FaBell className="empty-icon" />

                            <h3>No Notifications Found</h3>

                            <p>

                                You're all caught up.

                            </p>

                        </div>

                    ) : (

                        filtered.map((item) => (

                            <div
                                key={item.id}
                                className={`notification-card ${
                                    item.is_read
                                        ? "read"
                                        : "unread"
                                }`}
                            >

                                <div className="notification-left">

                                    <div className={`icon-circle ${item.color}`}>

                                        {

                                            item.icon === "tasks"

                                                ?

                                                <FaTasks />

                                                :

                                                item.icon === "announcement"

                                                ?

                                                <FaBullhorn />

                                                :

                                                <FaBell />

                                        }

                                    </div>

                                </div>

                                <div className="notification-center">

                                    <div className="notification-header">

                                        <h5>

                                            {item.title}

                                        </h5>

                                        {

                                            !item.is_read &&

                                            <span className="new-badge">

                                                NEW

                                            </span>

                                        }

                                    </div>

                                    <p>

                                        {item.message}

                                    </p>

                                    <small>

                                        {item.created_at}

                                    </small>

                                </div>

                                <div className="notification-right">

                                    {

                                        !item.is_read && (

                                            <button

                                                className="btn btn-success btn-sm"

                                                onClick={() =>
                                                    markRead(item.id)
                                                }

                                            >

                                                <FaCheckCircle />

                                            </button>

                                        )

                                    }

                                    <button

                                        className="btn btn-danger btn-sm"

                                        onClick={() =>
                                            deleteNotification(item.id)
                                        }

                                    >

                                        <FaTrash />

                                    </button>

                                </div>

                            </div>

                        ))

                    )}

                </div>

            </div>

        </div>

    );

}

export default EmployeeNotifications;