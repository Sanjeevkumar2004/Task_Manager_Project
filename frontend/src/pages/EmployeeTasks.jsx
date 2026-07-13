import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaTasks,
    FaClock,
    FaCheckCircle,
    FaSearch,
    FaTimes
} from "react-icons/fa";

import api from "../services/api";
import EmployeeSidebar from "../components/EmployeeSidebar";

import "./EmployeeTasks.css";


function EmployeeTasks() {


    const navigate = useNavigate();


    const employee =
        JSON.parse(localStorage.getItem("employee"));


    const [tasks,setTasks] = useState([]);

    const [loading,setLoading] = useState(true);


    const [search,setSearch] = useState("");

    const [statusFilter,setStatusFilter] = useState("All");

    const [priorityFilter,setPriorityFilter] = useState("All");


    const [selectedTask,setSelectedTask] = useState(null);



    useEffect(()=>{


        if(!employee){

            navigate("/employee-login");

            return;

        }


        getTasks();


    },[]);





    const getTasks = async()=>{


        try{


            const response =
            await api.get(
                `/api/tasks/?employee_id=${employee.employee_id}`
            );


            setTasks(response.data);


        }

        catch(error){

            console.log(error);

        }

        finally{

            setLoading(false);

        }

    };





    const changeStatus = async(taskId,status)=>{


        try{


            await api.put(

                `/api/tasks/update/${taskId}/`,

                {
                    status
                }

            );


            getTasks();


        }

        catch(error){

            console.log(error);

        }


    };






    const filteredTasks = tasks.filter((task)=>{


        const searchMatch =

        task.title
        ?.toLowerCase()
        .includes(search.toLowerCase())

        ||

        task.description
        ?.toLowerCase()
        .includes(search.toLowerCase());



        const statusMatch =

        statusFilter==="All"

        ||

        task.status===statusFilter;



        const priorityMatch =

        priorityFilter==="All"

        ||

        task.priority===priorityFilter;



        return (

            searchMatch

            &&

            statusMatch

            &&

            priorityMatch

        );


    });







    const completed =

    tasks.filter(

        task=>task.status==="Completed"

    ).length;



    const progress =

    tasks.length===0

    ?

    0

    :

    Math.round(

        (completed/tasks.length)*100

    );





    const currentTasks =

    filteredTasks.filter(

        task=>task.status!=="Completed"

    );




    const completedTasks =

    filteredTasks.filter(

        task=>task.status==="Completed"

    );







    return (

    <div className="employee-task-page">


        <EmployeeSidebar />



        <div className="employee-task-content">



            <div className="task-header">


                <div>


                    <h1>
                        My Tasks
                    </h1>


                    <p>
                        Manage your assigned tasks and track progress.
                    </p>


                </div>


            </div>





            {/* SUMMARY */}


            <div className="task-summary-grid">



                <div className="summary-card total-card">

                    <div>

                        <h5>Total Tasks</h5>

                        <h2>
                            {tasks.length}
                        </h2>

                        <p>
                            Assigned
                        </p>

                    </div>


                    <FaTasks className="summary-icon"/>


                </div>






                <div className="summary-card current-card">


                    <div>

                        <h5>
                            Active Tasks
                        </h5>


                        <h2>
                            {
                            tasks.filter(
                            t=>t.status!=="Completed"
                            ).length
                            }
                        </h2>


                        <p>
                            Pending / In Progress
                        </p>


                    </div>


                    <FaClock className="summary-icon"/>


                </div>







                <div className="summary-card completed-card">


                    <div>


                        <h5>
                            Completion
                        </h5>


                        <h2>
                            {progress}%
                        </h2>


                        <p>
                            Performance
                        </p>


                    </div>



                    <FaCheckCircle className="summary-icon"/>



                </div>



            </div>






            {/* FILTER */}



            <div className="task-filter-box">


                <div className="search-box">


                    <FaSearch/>


                    <input

                    placeholder="Search tasks..."

                    value={search}

                    onChange={
                        e=>setSearch(e.target.value)
                    }

                    />



                </div>





                <select

                value={statusFilter}

                onChange={
                    e=>setStatusFilter(e.target.value)
                }

                >

                    <option>
                        All
                    </option>

                    <option>
                        Pending
                    </option>


                    <option>
                        In Progress
                    </option>


                    <option>
                        Completed
                    </option>


                </select>






                <select


                value={priorityFilter}

                onChange={
                    e=>setPriorityFilter(e.target.value)
                }


                >

                    <option>
                        All
                    </option>

                    <option>
                        P1
                    </option>

                    <option>
                        P2
                    </option>

                    <option>
                        P3
                    </option>

                    <option>
                        P4
                    </option>


                </select>



            </div>







            {/* CURRENT TASK TABLE */}



            <div className="task-card">


                <div className="card-title">


                    <h3>
                        Current Tasks
                    </h3>


                    <span>
                        {currentTasks.length} Active
                    </span>


                </div>





                <div className="table-responsive">


                <table className="table task-table">


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


                loading ?


                <tr>

                <td colSpan="5">

                    Loading...

                </td>

                </tr>


                :


                currentTasks.map(task=>(


                <tr

                key={task.task_id}

                onClick={()=>setSelectedTask(task)}

                className="click-row"


                >


                    <td>
                        {task.task_id}
                    </td>


                    <td>

                    <strong>
                    {task.title}
                    </strong>

                    </td>


                    <td>

                    {task.priority}

                    </td>



                    <td>

                    {task.deadline}

                    </td>



                    <td>


                    <select

                    value={task.status}

                    onClick={
                        e=>e.stopPropagation()
                    }

                    onChange={
                    e=>
                    changeStatus(
                    task.task_id,
                    e.target.value
                    )
                    }

                    >

                    <option>
                        Pending
                    </option>


                    <option>
                        In Progress
                    </option>


                    <option>
                        Completed
                    </option>


                    </select>


                    </td>



                </tr>


                ))



                }


                </tbody>


                </table>


                </div>



            </div>







            {/* DETAILS DRAWER */}


            {


            selectedTask &&


            <div className="task-drawer">


                <button

                onClick={()=>
                setSelectedTask(null)
                }

                >

                <FaTimes/>

                </button>



                <h2>
                    Task Details
                </h2>



                <h4>
                    {selectedTask.title}
                </h4>



                <p>

                {selectedTask.description}

                </p>



                <hr/>


                <p>
                Priority :
                <b>
                {selectedTask.priority}
                </b>
                </p>


                <p>
                Deadline :
                {selectedTask.deadline}
                </p>



                <p>
                Status :
                {selectedTask.status}
                </p>



            </div>
            
            


            }
{/* =====================================================
    COMPLETED TASK HISTORY
===================================================== */}


<div className="task-card history-card">


    <div className="card-title">


        <h3>
            Completed Task History
        </h3>


        <span>
            {completedTasks.length} Completed
        </span>


    </div>





    <div className="table-responsive">


        <table className="table task-table">


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


            completedTasks.length === 0 ?


            (

            <tr>


                <td colSpan="5">


                    No Completed Tasks


                </td>


            </tr>


            )


            :


            completedTasks.map(task=>(



            <tr

            key={task.task_id}

            onClick={()=>setSelectedTask(task)}

            className="click-row"


            >



                <td>

                    {task.task_id}

                </td>





                <td>


                    <strong>

                        {task.title}

                    </strong>


                </td>





                <td>


                    <span

                    className={

                    `priority-badge ${
                    
                    task.priority==="P1"
                    ?

                    "priority-p1"

                    :

                    task.priority==="P2"

                    ?

                    "priority-p2"

                    :

                    task.priority==="P3"

                    ?

                    "priority-p3"

                    :

                    "priority-p4"

                    }`

                    }


                    >

                        {task.priority}


                    </span>


                </td>





                <td>

                    {task.deadline}


                </td>





                <td>


                    <span className="completed-status">


                        Completed


                    </span>


                </td>



            </tr>



            ))



            }



            </tbody>



        </table>



    </div>



</div>




        </div>


    </div>


    );


}


export default EmployeeTasks;