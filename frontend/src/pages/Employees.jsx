import { useEffect, useState } from "react";
import api from "../services/api";
import ManagerLayout from "../components/ManagerLayout";
import "./Employees.css";


function Employees() {


const [employees,setEmployees] = useState([]);

const [showAdd,setShowAdd] = useState(false);

const [showEdit,setShowEdit] = useState(false);

const [showView,setShowView] = useState(false);


const [selectedEmployee,setSelectedEmployee] = useState(null);


const [viewMode,setViewMode] = useState("table");


const [search,setSearch] = useState("");

const [positionFilter,setPositionFilter] = useState("All");




const emptyEmployee={

name:"",
email:"",
phone:"",
position:"",
skills:"",
experience:"0",
password:""

};



const [employeeForm,setEmployeeForm]=useState(emptyEmployee);





const loadEmployees = async()=>{


try{


const res =
await api.get("/api/employees/");


setEmployees(res.data);


}

catch(error){

console.log(error);

}


};





useEffect(()=>{


loadEmployees();


},[]);
const filteredEmployees = employees.filter((emp) => {

    const searchText = search.toLowerCase();

    return (
        String(emp.employee_id || "").toLowerCase().includes(searchText) ||
        String(emp.first_name || "").toLowerCase().includes(searchText) ||
        String(emp.last_name || "").toLowerCase().includes(searchText) ||
        String(emp.email || "").toLowerCase().includes(searchText) ||
        String(emp.department || "").toLowerCase().includes(searchText)
    );

});
const addEmployee = async()=>{


try{


await api.post(

"/api/employees/create/",

{

...employeeForm,

experience:
Number(employeeForm.experience)

}

);



alert("Employee Added Successfully");


setShowAdd(false);


setEmployeeForm(emptyEmployee);


loadEmployees();


}

catch(error){


alert(

error.response?.data?.error ||

"Unable to add employee"

);


}


};
const editEmployee = (emp)=>{


setSelectedEmployee(emp);


setEmployeeForm({


employee_id:emp.employee_id,

name:emp.name,

email:emp.email,

phone:emp.phone,

position:emp.position,

skills:emp.skills,

experience:emp.experience,

status:emp.status


});


setShowEdit(true);


};
const updateEmployee = async()=>{

try{

console.log(
"Updating Employee ID:",
employeeForm.employee_id
);


console.log(
"Sending Data:",
employeeForm
);



await api.put(

`/api/employees/update/${employeeForm.employee_id}/`,

{

name:employeeForm.name,

email:employeeForm.email,

phone:employeeForm.phone,

position:employeeForm.position,

skills:employeeForm.skills,

experience:Number(employeeForm.experience),

status:employeeForm.status || "Active"

}

);



alert(
"Employee Updated Successfully"
);



setShowEdit(false);


loadEmployees();



}

catch(error){


console.log(
"UPDATE ERROR:",
error.response?.data || error
);


alert(
"Update failed"
);


}


};
const deleteEmployee = async(id)=>{


if(!window.confirm(
"Delete this employee?"
))

return;



try{


await api.delete(

`/api/employees/delete/${id}/`

);



alert("Employee Deleted");


loadEmployees();


}

catch(error){

console.log(error);

}


};

const viewEmployee=(emp)=>{


setSelectedEmployee(emp);

setShowView(true);


};

const updateField=(e)=>{


setEmployeeForm({

...employeeForm,

[e.target.name]:
e.target.value


});


};

return (

<div className="manager-employees-page">

<div className="employees-header">


<div>

<h2>
👥 Employee Management
</h2>


<p>
Manage employees, skills and performance
</p>


</div>



<button

className="add-employee-btn"

onClick={()=>setShowAdd(true)}

>

+ Add Employee

</button>



</div>







<div className="employee-controls">



<input

placeholder="Search employee..."

value={search}

onChange={
e=>setSearch(e.target.value)
}

/>




<select

value={positionFilter}

onChange={
e=>setPositionFilter(e.target.value)
}

>


<option>
All
</option>

<option>
Developer
</option>

<option>
Designer
</option>

<option>
Tester
</option>

<option>
Manager
</option>

<option>
Data Analyst
</option>


</select>





<button

className={
viewMode==="table"
?
"active-mode"
:
""
}

onClick={()=>setViewMode("table")}

>

Table

</button>



<button

className={
viewMode==="card"
?
"active-mode"
:
""
}

onClick={()=>setViewMode("card")}

>

Cards

</button>



</div>









{
viewMode==="table"

?

<div className="employee-table-card">


<table>


<thead>

<tr>

<th>ID</th>

<th>Name</th>

<th>Email</th>

<th>Position</th>

<th>Skills</th>

<th>Performance</th>

<th>Workload</th>

<th>Action</th>


</tr>


</thead>



<tbody>


{
filteredEmployees.map(emp=>(


<tr key={emp.employee_id}>


<td>
{emp.employee_id}
</td>


<td>
{emp.name}
</td>


<td>
{emp.email}
</td>


<td>
{emp.position}
</td>



<td>

<div className="skill-container">

{
emp.skills?.split(",").map((s,i)=>(

<span key={i}>
{s}
</span>

))
}

</div>

</td>




<td>


<div className="progress-box">

<div

style={{
width:`${emp.performance_score}%`
}}

></div>

</div>


{emp.performance_score}%


</td>





<td>

{emp.current_workload}


</td>





<td>


<button
onClick={()=>viewEmployee(emp)}
>
View
</button>


<button
onClick={()=>editEmployee(emp)}
>
Edit
</button>


<button
onClick={()=>deleteEmployee(emp.employee_id)}
>
Delete
</button>


</td>



</tr>


))

}



</tbody>


</table>


</div>



:

<div className="employee-card-grid">


{
filteredEmployees.map(emp=>(


<div className="employee-card"
key={emp.employee_id}>


<div className="employee-avatar">

{emp.name.charAt(0)}

</div>


<h3>
{emp.name}
</h3>


<p>
{emp.position}
</p>



<div className="skill-container">

{
emp.skills?.split(",").map((s,i)=>(

<span key={i}>
{s}
</span>

))
}

</div>



<p>
Performance:
<b>
{emp.performance_score}%
</b>
</p>


<div className="progress-box">

<div

style={{
width:`${emp.performance_score}%`
}}

></div>


</div>




<p>
Workload:
{emp.current_workload}
</p>



<button
onClick={()=>viewEmployee(emp)}
>
Profile
</button>



<button
onClick={()=>editEmployee(emp)}
>
Edit
</button>



</div>


))

}



</div>


}

{/* ADD / EDIT MODAL */}


{
(showAdd || showEdit)

&&


<div className="employee-modal">


<div className="employee-modal-box">


<h3>

{
showAdd
?
"Add Employee"
:
"Edit Employee"
}

</h3>



{
[
"name",
"email",
"phone",
"position",
"skills",
"experience",
"password"
]
.map(field=>(


<input

key={field}

name={field}

placeholder={field}

value={
employeeForm[field] || ""
}

onChange={updateField}

/>


))

}




<button

onClick={

showAdd

?

addEmployee

:

updateEmployee

}

>

Save

</button>



<button

onClick={()=>{
setShowAdd(false);
setShowEdit(false);
}}

>

Cancel

</button>


</div>


</div>


}








{/* PROFILE DRAWER */}



{
showView && selectedEmployee &&


<div className="employee-drawer">


<button

onClick={()=>setShowView(false)}

>

X

</button>



<h2>
{selectedEmployee.name}
</h2>



<p>
ID:
{selectedEmployee.employee_id}
</p>


<p>
Email:
{selectedEmployee.email}
</p>


<p>
Position:
{selectedEmployee.position}
</p>


<p>
Skills:
{selectedEmployee.skills}
</p>

<p>
Phone: 
{selectedEmployee.phone}
</p>
<p>
Experience:
{selectedEmployee.experience} Years
</p>


<p>
Performance:
{selectedEmployee.performance_score}%
</p>



</div>

}



</div>





);


}


export default Employees;
