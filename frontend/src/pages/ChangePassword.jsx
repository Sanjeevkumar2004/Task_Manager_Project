import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import EmployeeSidebar from "../components/EmployeeSidebar";

function ChangePassword() {

    const navigate = useNavigate();

    const employee = JSON.parse(
        localStorage.getItem("employee")
    );

    const [oldPassword, setOldPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async () => {

        if (newPassword !== confirmPassword) {

            alert("Passwords do not match");

            return;

        }

        try {

            const res = await api.put(

                "/api/employees/change-password/",

                {

                    employee_id: employee.employee_id,

                    old_password: oldPassword,

                    new_password: newPassword

                }

            );

            alert(res.data.message);

            navigate("/employee-profile");

        } catch (err) {

            alert(

                err.response?.data?.message ||

                "Unable to Change Password"

            );

        }

    };

    return (

        <div className="d-flex">

            <EmployeeSidebar />

            <div
                className="container"
                style={{
                    marginLeft: "280px",
                    padding: "40px",
                    maxWidth: "700px"
                }}
            >

                <div className="card shadow-lg border-0 rounded-4">

                    <div className="card-body p-5">

                        <h2 className="mb-4">

                            🔒 Change Password

                        </h2>

                        <div className="mb-3">

                            <label>

                                Current Password

                            </label>

                            <input

                                type="password"

                                className="form-control"

                                value={oldPassword}

                                onChange={(e)=>
                                    setOldPassword(e.target.value)
                                }

                            />

                        </div>

                        <div className="mb-3">

                            <label>

                                New Password

                            </label>

                            <input

                                type="password"

                                className="form-control"

                                value={newPassword}

                                onChange={(e)=>
                                    setNewPassword(e.target.value)
                                }

                            />

                        </div>

                        <div className="mb-4">

                            <label>

                                Confirm Password

                            </label>

                            <input

                                type="password"

                                className="form-control"

                                value={confirmPassword}

                                onChange={(e)=>
                                    setConfirmPassword(e.target.value)
                                }

                            />

                        </div>

                        <button

                            className="btn btn-primary btn-lg w-100"

                            onClick={handleChangePassword}

                        >

                            Update Password

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ChangePassword;