import { useEffect, useState } from "react";
import api from "../services/api";

import {
    FaSearch,
    FaFileExcel,
    FaFilePdf,
    FaEdit,
    FaTrash,
    FaTasks,
    FaCheckCircle,
    FaClock
} from "react-icons/fa";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "./ViewTasks.css";


function ViewTasks(){

const [tasks,setTasks]=useState([]);

const [search,setSearch]=useState("");

const [status,setStatus]=useState("All");

const [priority,setPriority]=useState("All");

const [showEdit,setShowEdit] = useState(false);
const [selectedTask,setSelectedTask] = useState(null);

const [editTaskData,setEditTaskData] = useState({

    title:"",
    description:"",
    employee_id:"",
    employee_name:"",
    priority:"",
    status:"",
    deadline:"",
    required_skills:"",
    required_position:""

});

useEffect(()=>{

loadTasks();

},[]);



const loadTasks=async()=>{

try{

const res=await api.get("/api/tasks/");

setTasks(res.data);

}

catch(err){

console.log(err);

}

};



const deleteTask = async(id)=>{

console.log("Deleting Task ID:", id);

if(!window.confirm("Delete this task?"))
return;

try{

await api.delete(
`/api/tasks/delete/${id}/`
);

loadTasks();

}

catch(err){

console.log(err);

}

};



const exportExcel=()=>{


const sheet=XLSX.utils.json_to_sheet(tasks);

const book=XLSX.utils.book_new();


XLSX.utils.book_append_sheet(
book,
sheet,
"Tasks"
);


XLSX.writeFile(
book,
"Task_Report.xlsx"
);


};



const exportPDF=()=>{


const doc=new jsPDF();


doc.text(
"Task Report",
14,
15
);


autoTable(doc,{

head:[

[
"Title",
"Employee",
"Priority",
"Status"
]

],

body:tasks.map(t=>[

t.title,
t.employee_name,
t.priority,
t.status

])

});


doc.save(
"Task_Report.pdf"
);


};



const filteredTasks=tasks.filter(task=>{


const matchSearch=

task.title
?.toLowerCase()
.includes(
search.toLowerCase()
)

||

task.employee_name
?.toLowerCase()
.includes(
search.toLowerCase()
);



const matchStatus=

status==="All"

||

task.status===status;



const matchPriority=

priority==="All"

||

task.priority===priority;



return (

matchSearch &&

matchStatus &&

matchPriority

);


});



const total=tasks.length;


const completed=
tasks.filter(
t=>t.status==="Completed"
).length;


const pending=
tasks.filter(
t=>t.status==="Pending"
).length;

const editTask = (task)=>{


    setSelectedTask(task);


    setEditTaskData({

    title: task.title || "",

    description: task.description || "",

    employee_id: task.employee_id || "",
    employee_name: task.employee_name || "",

    priority: task.priority || "P3",

    status: task.status || "Pending",

    deadline: task.deadline || "",

    required_skills: task.required_skills || "",

    required_position: task.required_position || ""

});


    setShowEdit(true);


};
const updateTask = async()=>{


try{


await api.put(

`/api/tasks/update/${selectedTask.task_id}/`,

editTaskData

);


alert(
"Task Updated Successfully"
);



setShowEdit(false);


loadTasks();


}


catch(error){


console.log(error.response);


alert(
"Unable to update task"
);


}


};
return(




<div className="manager-view-page">


<div className="manager-view-header">


<div>

<h1>
Task Management
</h1>


<p>
Monitor and manage employee tasks
</p>

</div>


<div className="manager-export-buttons">


<button
onClick={exportExcel}
className="manager-excel-btn"
>

<FaFileExcel/>

Excel

</button>



<button
onClick={exportPDF}
className="manager-pdf-btn"
>

<FaFilePdf/>

PDF

</button>


</div>

</div>


{/* ============================
    STATISTICS CARDS
============================= */}


<div className="manager-task-stats">


<div className="manager-task-card blue">

<div>

<h4>Total Tasks</h4>

<h2>
{total}
</h2>

</div>

<FaTasks/>

</div>



<div className="manager-task-card green">

<div>

<h4>Completed</h4>

<h2>
{completed}
</h2>

</div>

<FaCheckCircle/>

</div>



<div className="manager-task-card orange">

<div>

<h4>Pending</h4>

<h2>
{pending}
</h2>

</div>

<FaClock/>

</div>


</div>



{/* ============================
        FILTER SECTION
============================= */}


<div className="manager-task-filter">


<div className="manager-search">


<FaSearch/>


<input

type="text"

placeholder="Search task or employee..."

value={search}

onChange={(e)=>
setSearch(e.target.value)
}

/>


</div>



<select

className="manager-filter-input"

value={status}

onChange={(e)=>
setStatus(e.target.value)
}

>


<option value="All">

All Status

</option>


<option value="Pending">

Pending

</option>


<option value="Assigned">

Assigned

</option>


<option value="In Progress">

In Progress

</option>


<option value="Completed">

Completed

</option>


</select>



<select

className="manager-filter-input"

value={priority}

onChange={(e)=>
setPriority(e.target.value)
}

>


<option value="All">

All Priority

</option>


<option value="P1">

🔥 Critical

</option>


<option value="P2">

⚠ High

</option>


<option value="P3">

📌 Medium

</option>


<option value="P4">

✅ Low

</option>


</select>



</div>





{/* ============================
        TASK TABLE
============================= */}



<div className="manager-task-table-card">


<table className="manager-task-table">


<thead>

<tr>

<th>ID</th>

<th>Task</th>

<th>Description</th>
<th>Emp_ID</th>

<th>Emp_Name</th>

<th>Priority</th>

<th>Status</th>

<th>Deadline</th>

<th>AI Score</th>

<th>Action</th>

</tr>

</thead>



<tbody>



{
filteredTasks.length===0 ?


<tr>

<td
colSpan="8"
className="empty-task"
>

No Tasks Found

</td>

</tr>


:


filteredTasks.map((task)=>(


<tr key={task.task_id}>


<td>

#{task.task_id}

</td>



<td>


<div className="task-title">


<strong>

{task.title}

</strong>


<p>

{task.required_skills}

</p>


</div>
</td>
<td className="task-description-cell">


{task.description ?


task.description


:

<span>
No Description
</span>


}


</td>



<td>

{task.employee_id || "Not Assigned"}

</td>
<td>

<div className="employee-cell">

<strong>
{task.employee_name || "Not Assigned"}
</strong>

</div>

</td>



<td>


<span

className={

`priority-badge ${

task.priority==="P1"

?

"critical"

:

task.priority==="P2"

?

"high"

:

task.priority==="P3"

?

"medium"

:

"low"

}`

}

>


{task.priority}


</span>


</td>




<td>


<span

className={

`status-badge ${

task.status
?.toLowerCase()
.replace(" ","-")

}`

}

>


{task.status}


</span>


</td>




<td>


{task.deadline}


</td>




<td>


<div className="ai-score">


{task.assignment_score || 0}%


</div>


</td>




<td>


<div className="task-actions">

    <button
        className="edit-btn"
        onClick={() => editTask(task)}
    >
        Edit
    </button>


    <button
    className="delete-btn"
    onClick={() => deleteTask(task.task_id)}
    title="Delete Task"
>
    Delete
</button>

</div>


</td>



</tr>


))


}



</tbody>


</table>


</div>

{
showEdit && selectedTask && (

<div className="task-edit-overlay">


<div className="task-edit-modal">


<h3>
Edit Task
</h3>

<label>Title</label>
<input

className="form-control mb-3"

value={editTaskData.title}

onChange={(e)=>

setEditTaskData({

...editTaskData,

title:e.target.value

})

}

/>


<label>Description</label>
<textarea

className="form-control mb-3"

value={editTaskData.description}

onChange={(e)=>

setEditTaskData({

...editTaskData,

description:e.target.value

})

}

/>

<label>Emp_ID</label>

<input
className="form-control mb-3"
value={editTaskData.employee_id}
disabled
/>
<label>Emp_Name</label>

<input
className="form-control mb-3"
value={editTaskData.employee_name || ""}
disabled
/>



<label>Priority</label>
<select

className="form-control mb-3"

value={editTaskData.priority}

onChange={(e)=>

setEditTaskData({

...editTaskData,

priority:e.target.value

})

}

>
<option>P1</option>

<option>P2</option>

<option>P3</option>

<option>P4</option>


</select>

<label>Status</label>

<select
className="form-control mb-3"
value={editTaskData.status}
onChange={(e)=>
setEditTaskData({
...editTaskData,
status:e.target.value
})
}
>

<option value="Pending">
Pending
</option>

<option value="Assigned">
Assigned
</option>

<option value="In Progress">
In Progress
</option>

<option value="Completed">
Completed
</option>

</select>

<label>Deadline</label>
<input

type="date"

className="form-control mb-3"

value={editTaskData.deadline}

onChange={(e)=>

setEditTaskData({

...editTaskData,

deadline:e.target.value

})

}

/>




<div>


<button

className="btn btn-success"

onClick={updateTask}

>

Save Changes

</button>



<button

className="btn btn-secondary ms-2"

onClick={()=>setShowEdit(false)}

>

Cancel

</button>


</div>



</div>

</div>

)
}



</div>

);

}


export default ViewTasks;
