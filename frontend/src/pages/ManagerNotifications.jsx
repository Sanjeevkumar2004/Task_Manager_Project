import { useEffect, useState } from "react";
import api from "../services/api";
import ManagerLayout from "../components/ManagerLayout";
import "./ManagerNotification.css";
import {
    FaBell,
    FaCheckCircle,
    FaExclamationTriangle,
    FaPhone,
    FaTools,
    FaSearch,
    FaTrash,
    FaCheck
} from "react-icons/fa";

function ManagerNotifications() {

    const [notifications, setNotifications] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {

        try {

            const res = await api.get(
                "/api/accounts/notifications/"
            );

            setNotifications(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    const markAllRead = async () => {

        try {

            await api.post(
                "/api/accounts/notifications/read-all/"
            );

            setNotifications(
                notifications.map(n => ({
                    ...n,
                    is_read: true
                }))
            );

            window.dispatchEvent(
                new Event("notificationsUpdated")
            );

        } catch (err) {

            console.log(err);

        }

    };

    const markRead = (id) => {

        setNotifications(
            notifications.map(n =>
                n.id === id
                    ? {
                        ...n,
                        is_read: true
                    }
                    : n
            )
        );

    };
const deleteNotification = async(id)=>{


try{


await api.delete(

`/api/accounts/notifications/${id}/delete/`

);



loadNotifications();



}

catch(error){

console.log(error);

}


};

    const getIcon = (type) => {

        switch (type) {

            case "priority":
                return <FaExclamationTriangle />;

            case "completed":
                return <FaCheckCircle />;

            case "phone":
                return <FaPhone />;

            case "skills":
                return <FaTools />;

            default:
                return <FaBell />;

        }

    };

    const getColor = (type) => {

        switch (type) {

            case "priority":
                return "danger";

            case "completed":
                return "success";

            case "phone":
                return "primary";

            case "skills":
                return "purple";

            default:
                return "secondary";

        }

    };

    const filteredNotifications = notifications.filter(item => {

    // Search filter
    const text = (item.title + " " + item.message).toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());

    // Notification date
    const notificationDate = new Date(item.created_at);
    const today = new Date();

    // Today
    const isToday =
        notificationDate.toDateString() === today.toDateString();

    // Yesterday
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isYesterday =
        notificationDate.toDateString() === yesterday.toDateString();

    // Last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    const isWeek =
        notificationDate >= weekAgo;

    let matchesFilter = true;

    if (filter === "today") {
        matchesFilter = isToday;
    }
    else if (filter === "yesterday") {
        matchesFilter = isYesterday;
    }
    else if (filter === "week") {
        matchesFilter = isWeek;
    }

    return matchesSearch && matchesFilter;

});

    const unreadCount =
        notifications.filter(
            n => !n.is_read
        ).length;

    return (

        

            <div className="manager-notification-page">

                <div className="manager-notification-header">

                    <div>

                        <h2>

                            🔔 Notification Center

            
                        </h2>

                        <p>

                            Monitor employee activities and system alerts

                        </p>

                    </div>

                    <button
                        className="manager-mark-read-btn"
                        onClick={markAllRead}
                    >

                        <FaCheck />

                        Mark all as read

                    </button>

                </div>

                <div className="manager-notification-toolbar">

                    <div className="manager-search-box">

                        <FaSearch />

                        <input

                            placeholder="Search notifications..."

                            value={search}

                            onChange={e => setSearch(e.target.value)}

                        />

                    </div>

                    <div className="manager-filter-buttons">

                        {[
                            "all",
                            "today",
                            "yesterday",
                            "week"
                        ].map(btn => (

                            <button

                                key={btn}

                                className={filter === btn ? "active" : ""}

                                onClick={() => setFilter(btn)}

                            >

                                {btn}

                            </button>

                        ))}

                    </div>

                </div>

                <div className="manager-notification-list">

                    {filteredNotifications.length === 0 ?

                        <div className="empty-notification">

                            No notifications found

                        </div>

                        :

                        filteredNotifications.map(item => (

                            <div

                                key={item.id}

                                className={`manager-notification-card ${item.is_read ? "read" : ""}`}

                            >

                                <div

                                    className={`manager-notification-icon ${getColor(item.type)}`}

                                >

                                    {getIcon(item.type)}

                                </div>

                                <div className="manager-notification-content">

                                    <div className="manager-notification-title">

                                        <h5>

                                            {item.title}

                                        </h5>

                                        {!item.is_read &&

                                            <span>

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

                                <div className="manager-notification-actions">

                                    {!item.is_read &&

                                        <button

                                            onClick={() => markRead(item.id)}

                                        >

                                            <FaCheck />

                                        </button>

                                    }

                                    <button

                                        onClick={() => deleteNotification(item.id)}

                                    >

                                        <FaTrash />

                                    </button>

                                </div>

                            </div>

                        ))

                    }

                </div>

            </div>

                    
    );

}

export default ManagerNotifications;