import { useEffect, useState } from "react";
import api from "../services/api";

import {
  FaTasks,
  FaUserTie,
  FaBrain,
  FaCalendarAlt,
  FaTools,
  FaBriefcase,
  FaFlag,
  FaFileAlt
} from "react-icons/fa";

import "./CreateTask.css";


function CreateTask() {


const initialForm = {

    title:"",
    description:"",
    employee_name:"",
    employee_id:"",
    priority:"P3",
    deadline:"",
    required_skills:"",
    required_position:"",
    experience:""

};


const [form,setForm] = useState(initialForm);


// prevents AI from changing selected employee
const [employeeSelected,setEmployeeSelected] = useState(false);



const handleChange=(e)=>{


setForm({

...form,

[e.target.name]:e.target.value

});


};



/* ===============================
        AI EMPLOYEE SUGGESTION
================================ */


const suggestEmployee = async()=>{


if(employeeSelected)
return;



if(
!form.required_skills ||
!form.required_position
)
return;



try{


const res = await api.post(

"/api/tasks/suggest-employee/",

{

required_skills:form.required_skills,

required_position:form.required_position,

experience:form.experience

}

);



if(res.data.success){


setForm(prev=>({

...prev,

employee_name:res.data.employee_name,

employee_id:res.data.employee_id

}));


}


}

catch(error){

console.log(error);

}



};




useEffect(()=>{


suggestEmployee();


},[

form.required_skills,

form.required_position,

form.experience

]);





/* ===============================
        LOCK AI EMPLOYEE
================================ */


const lockEmployee=()=>{


setEmployeeSelected(true);


};




/* ===============================
        CREATE TASK
================================ */


const createTask=async(e)=>{


e.preventDefault();



try{


const taskData={


title:form.title,

description:form.description,


employee_name:form.employee_name,


employee_id:form.employee_id,


priority:form.priority,


deadline:form.deadline,


required_skills:form.required_skills,


required_position:form.required_position,


experience:form.experience


};



console.log(
"FINAL TASK DATA:",
taskData
);



const res = await api.post(

"/api/tasks/create/",

taskData

);



alert(

`Task Created Successfully

Assigned Employee : ${res.data.employee_name}

Employee ID : ${res.data.employee_id}

AI Score : ${res.data.assignment_score}%`

);



setForm(initialForm);


setEmployeeSelected(false);



}



catch(error){


console.log(error.response);


alert(

error.response?.data?.error ||

"Unable to create task"

);


}



};





return(

<div className="manager-create-page">


<div className="manager-create-header">

<div>

<h1>
Create New Task
</h1>


<p>
Assign tasks intelligently using AI recommendation.
</p>


</div>

</div>



<form onSubmit={createTask}>


<div className="manager-create-grid">



<div className="manager-create-card">


<h2>
<FaTasks/>
Task Information
</h2>



<label>
Task Title
</label>


<input

name="title"

className="manager-input"

value={form.title}

onChange={handleChange}

required

/>



<label>
Description
</label>


<textarea

rows="6"

name="description"

className="manager-input"

value={form.description}

onChange={handleChange}

/>




<label>

Priority
</label>



<select

name="priority"

className="manager-input"

value={form.priority}

onChange={handleChange}

>


<option value="P1">
🔥 Critical
</option>


<option value="P2">
🟠 High
</option>


<option value="P3">
🔵 Medium
</option>


<option value="P4">
🟢 Low
</option>



</select>





<label>
Deadline
</label>



<input

type="date"

name="deadline"

className="manager-input"

value={form.deadline}

onChange={handleChange}

/>



</div>





<div className="manager-create-card">


<h2>

<FaUserTie/>

Assignment Details

</h2>



<label>
Required Skills
</label>


<input

name="required_skills"

className="manager-input"

value={form.required_skills}

onChange={handleChange}

/>



<label>
Required Position
</label>


<input

name="required_position"

className="manager-input"

value={form.required_position}

onChange={handleChange}

/>



<label>
Experience
</label>


<input

type="number"

name="experience"

className="manager-input"

value={form.experience}

onChange={handleChange}

/>




<div className="manager-ai-card">


<h3>

<FaBrain/>

AI Suggested Employee

</h3>



<p>
Employee Name :
<strong>
{form.employee_name || "Waiting..."}
</strong>
</p>



<p>
Employee ID :
<strong>
{form.employee_id || "Waiting..."}
</strong>
</p>

</div>



</div>



</div>




<div className="manager-create-footer">


<button

type="button"

className="manager-reset-btn"

onClick={()=>{

setForm(initialForm);

setEmployeeSelected(false);

}}

>

Reset

</button>





<button

type="submit"

className="manager-submit-btn"

>

<FaFileAlt/>

Create Task

</button>



</div>




</form>


</div>


);


}


export default CreateTask;