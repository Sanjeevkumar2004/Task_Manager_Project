import { useEffect, useState } from "react";
import EmployeeSidebar from "../components/EmployeeSidebar";
import api from "../services/api";
import "./EmployeeSettings.css";

import {
    FaUserCircle,
    FaCamera,
    FaLock,
    FaBell,
    FaMoon,
    FaSun,
    FaShieldAlt,
    FaSave,
    FaEnvelope,
    FaMobileAlt,
    FaIdBadge
} from "react-icons/fa";

function EmployeeSettings() {

    const employee =
        JSON.parse(localStorage.getItem("employee"));

    const [profile, setProfile] = useState({});

    const [loading, setLoading] = useState(true);

    const [photo, setPhoto] = useState(null);

    const [settings, setSettings] = useState({

        emailNotification: true,

        browserNotification: true,

        taskReminder: true,

        darkMode: false

    });

    const [password, setPassword] = useState({

        current: "",

        new: "",

        confirm: ""

    });

    useEffect(() => {

        loadProfile();

    }, []);
    

    const loadProfile = async () => {

        try {

            const res = await api.get(

                `/api/employees/${employee.employee_id}/`

            );

            setProfile(res.data);

            setLoading(false);

        }

        catch (err) {

            console.log(err);

            setLoading(false);

        }

    };

    const handleProfileChange = (e) => {

        setProfile({

            ...profile,

            [e.target.name]: e.target.value

        });

    };

    const handleSettingChange = (e) => {

        setSettings({

            ...settings,

            [e.target.name]: e.target.checked

        });

    };

    const handlePasswordChange = (e) => {

        setPassword({

            ...password,

            [e.target.name]: e.target.value

        });

    };

    const saveProfile = async () => {

    try {

        const formData = new FormData();

        formData.append(
            "phone",
            profile.phone
        );

        formData.append(
            "skills",
            profile.skills
        );

        if (photo) {

            formData.append(
                "photo",
                photo
            );

        }

        await api.put(

            `/api/employees/update/${profile.employee_id}/`,

            formData,

            {

                headers: {

                    "Content-Type": "multipart/form-data"

                }

            }

        );

        alert("Profile Updated Successfully");

        loadProfile();

    }

    catch (err) {

        console.log(err);

        alert("Unable to Update Profile");

    }

};

    const changePassword = async () => {

        if (password.new !== password.confirm) {

            alert("Passwords do not match");

            return;

        }

        try {

            await api.put(

                "/api/employees/change-password/",

                {

                    employee_id: profile.employee_id,

                    old_password: password.current,

                    new_password: password.new

                }

            );

            alert("Password Changed Successfully");

            setPassword({

                current: "",

                new: "",

                confirm: ""

            });

        }

        catch (err) {

            console.log(err);

        }

    };
        return (

        <div className="d-flex">

            <EmployeeSidebar />

            <div className="settings-container">

                {/* =======================================
                    PAGE HEADER
                ======================================= */}

                <div className="settings-header">

                    <div>

                        <h2>

                            <FaUserCircle className="me-2 text-primary" />

                            Employee Settings

                        </h2>

                        <p>

                            Manage your profile, password, notifications and account preferences.

                        </p>

                    </div>

                </div>

                {/* =======================================
                    PROFILE SECTION
                ======================================= */}

                <div className="settings-grid">

                    <div className="profile-card">

                        <div className="profile-image-section">

                            {
    photo ?

    <img

        src={URL.createObjectURL(photo)}

        alt="Profile"

        className="profile-image"

    />

    :

    profile.photo ?

    <img

        src={`http://127.0.0.1:8000${profile.photo}`}

        alt="Profile"

        className="profile-image"

    />

    :

    <FaUserCircle className="default-avatar" />

}

                           

                        </div>

                        <h3>

                            {profile.name}

                        </h3>

                        <p>

                            {profile.position}

                        </p>

                    </div>

                    {/* =======================================
                        PERSONAL INFORMATION
                    ======================================= */}

                    <div className="settings-card">

                        <h4>

                            Personal Information

                        </h4>

                        <div className="row">

                            <div className="col-md-6 mb-3">

                                <label>

                                    Employee Name

                                </label>

                                <input

                                    type="text"

                                    className="form-control"

                                    value={profile.name || ""}

                                    disabled

                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>

                                    Employee ID

                                </label>

                                <input

                                    type="text"

                                    className="form-control"

                                    value={profile.employee_id || ""}

                                    disabled

                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>

                                    Email

                                </label>

                                <input

                                    type="email"

                                    className="form-control"

                                    value={profile.email || ""}

                                    disabled

                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>

                                    Phone

                                </label>

                                <input

                                    type="text"

                                    className="form-control"

                                    name="phone"

                                    value={profile.phone || ""}
                                    disabled

                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>

                                    Position

                                </label>

                                <input

                                    type="text"

                                    className="form-control"

                                    value={profile.position || ""}

                                    disabled

                                />

                            </div>

                            <div className="col-md-6 mb-3">

                                <label>

                                    Experience

                                </label>

                                <input

                                    type="text"

                                    className="form-control"

                                    value={`${profile.experience || 0} Years`}

                                    disabled

                                />

                            </div>

                            <div className="col-12 mb-3">

                                <label>

                                    Skills

                                </label>

                                <textarea

                                    className="form-control"

                                    rows="4"

                                    name="skills"

                                    value={profile.skills || ""}
                                    disabled

                                />

                            </div>

                        </div>
                    </div>

                </div>
                {/* =======================================
                    ACCOUNT INFORMATION
                ======================================= */}

                <div className="settings-card mt-4">

                    <h4>

                        <FaShieldAlt className="me-2 text-success"/>

                        Account Information

                    </h4>

                    <div className="account-grid">

                        <div className="account-item">

                            <FaIdBadge />

                            <div>

                                <span>Employee ID</span>

                                <h6>{profile.employee_id}</h6>

                            </div>

                        </div>

                        <div className="account-item">

                            <FaEnvelope />

                            <div>

                                <span>Email</span>

                                <h6>{profile.email}</h6>

                            </div>

                        </div>

                        <div className="account-item">

                            <FaMobileAlt />

                            <div>

                                <span>Phone</span>

                                <h6>{profile.phone}</h6>

                            </div>

                        </div>

                        <div className="account-item">

                            <FaShieldAlt />

                            <div>

                                <span>Status</span>

                                <h6>

                                    Active Employee

                                </h6>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default EmployeeSettings;