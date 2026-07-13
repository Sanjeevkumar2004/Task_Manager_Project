import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function EmployeeLogin() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const login = async (e) => {

        e.preventDefault();

        try {

            const res = await api.post(
                "/api/employees/login/",
                form
            );
            

            if (res.data.success) {

                localStorage.setItem(
                    "employee",
                    JSON.stringify(res.data.employee)
                );

                navigate("/employee-dashboard"); 

            }

        }

        catch (err) {

            alert(
                err.response?.data?.message ||
                "Login Failed"
            );

        }

    };

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow">

                        <div className="card-body">

                            <h2 className="text-center mb-4">

                                Employee Login

                            </h2>

                            <form onSubmit={login}>

                                <label>Email</label>

                                <input
                                    className="form-control mb-3"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />

                                <label>Password</label>

                                <input
                                    type="password"
                                    className="form-control mb-4"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    className="btn btn-primary w-100"
                                >
                                    Login
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default EmployeeLogin;