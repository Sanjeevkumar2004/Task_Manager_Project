import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    return (

        <div
            className="container-fluid d-flex justify-content-center align-items-center"
            style={{
                height: "100vh",
                background: "#edf2f7"
            }}
        >

            <div
                className="card shadow-lg p-5 text-center"
                style={{
                    width: "450px",
                    borderRadius: "20px"
                }}
            >

                <h1 className="mb-2">
                    🤖 TaskAI
                </h1>

                <h4 className="mb-4">
                    AI Task Management System
                </h4>

                <button
                    className="btn btn-primary btn-lg mb-3"
                    onClick={() => navigate("/manager-login")}
                >
                    👨‍💼 Manager Login
                </button>

                <button
                    className="btn btn-success btn-lg"
                    onClick={() => navigate("/employee-login")}
                >
                    👨‍💻 Employee Login
                </button>

            </div>

        </div>

    );

}

export default Home;