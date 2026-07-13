import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

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
                "/api/accounts/manager/login/",
                form
            );

            if (res.data.success) {

                localStorage.setItem(
                    "manager",
                    JSON.stringify(res.data.manager)
                );

                navigate("/manager");

            }

        }

        catch (err) {

            alert(
                err.response?.data?.message ||
                "Invalid Email or Password"
            );

        }
        const handleLogin = async()=>{


try{


const res = await api.post(

"/api/accounts/manager/login/",

{

email:email,

password:password

}

);



if(res.data.success){


localStorage.setItem(

"manager",

JSON.stringify(res.data.manager)

);



navigate("/manager/dashboard");


}


else{


alert(
"Invalid Login"
);


}



}

catch(error){


alert(

error.response?.data?.message ||

"Login Failed"

);


}


};

    };

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow p-4">

                        <h2 className="text-center mb-4">
                            Manager Login
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
                                type="submit"
                            >
                                Login
                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;