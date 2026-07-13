import React, {useEffect,useState} from "react";
import api from "../services/api";
import {
ResponsiveContainer,
PieChart,
Pie,
Cell,
Tooltip,
Legend,
BarChart,
Bar,
XAxis,
YAxis,
CartesianGrid,
LineChart,
Line
}
from "recharts";


import {
FaTasks,
FaCheckCircle,
FaClock,
FaFire,
FaRobot,
FaFilePdf,
FaFileExcel,
FaFilter
}
from "react-icons/fa";


import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";


import "../components/manager-reports.css";



function Reports(){


const [tasks,setTasks]=useState([]);

const [filter,setFilter]=useState("All");




useEffect(()=>{


api.get("/api/tasks/")
.then(res=>{


setTasks(res.data);


})
.catch(err=>{


console.log(err);


});
},[]);






// FILTER


const filteredTasks =
filter==="All"
?
tasks
:
tasks.filter(
t=>t.status===filter
);






// KPI



const total =
filteredTasks.length;



const completed =
filteredTasks.filter(
t=>t.status==="Completed"
).length;



const pending =
filteredTasks.filter(
t=>t.status==="Pending"
).length;



const critical =
filteredTasks.filter(
t=>t.priority==="P1"
).length;







// STATUS CHART


const statusData=[

{
name:"Completed",
value:completed
},

{
name:"Pending",
value:pending
},

{
name:"In Progress",
value:
filteredTasks.filter(
t=>t.status==="In Progress"
).length
}

];



const COLORS=[
"#22c55e",
"#f97316",
"#3b82f6"
];







// PRIORITY


const priorityData=[


{
name:"P1",
value:
filteredTasks.filter(
t=>t.priority==="P1"
).length
},


{
name:"P2",
value:
filteredTasks.filter(
t=>t.priority==="P2"
).length
},


{
name:"P3",
value:
filteredTasks.filter(
t=>t.priority==="P3"
).length
},


{
name:"P4",
value:
filteredTasks.filter(
t=>t.priority==="P4"
).length
}



];








// EMPLOYEE PERFORMANCE


let employee={};


filteredTasks.forEach(task=>{


let name =
task.employee_name ||
task.assigned_employee ||
"Unknown";



if(!employee[name]){


employee[name]={

name:name,

total:0,

completed:0

};


}


employee[name].total++;



if(task.status==="Completed"){

employee[name].completed++;

}



});




const employeeData =
Object.values(employee)
.map(emp=>({


name:emp.name,


score:

emp.total===0
?
0
:
Math.round(
(emp.completed/emp.total)*100
)


}))

.sort(
(a,b)=>b.score-a.score
);









// MONTHLY TREND


let months={};



filteredTasks.forEach(task=>{


let date =
new Date(
task.created_at ||
task.deadline
);



if(isNaN(date))
return;



let month =
date.toLocaleString(
"default",
{
month:"short"
}
);



if(!months[month])
months[month]=0;



months[month]++;



});




const monthlyData =
Object.keys(months)
.map(m=>({

month:m,

tasks:months[m]

}));








// AI INSIGHTS


const best =
employeeData[0];



const insights=[


best
?
`Top performer: ${best.name} (${best.score}%)`
:
"No employee data available",



pending>completed
?
"Pending workload requires attention"
:
"Task completion rate is healthy",



critical>0
?
`${critical} critical priority tasks need monitoring`
:
"No critical workload detected"


];








// PDF


const exportPDF=()=>{


const doc=new jsPDF();


doc.text(
"TaskAI Management Report",
14,
20
);



autoTable(
doc,
{

head:[

[
"Task",
"Employee",
"Status",
"Priority"

]

],


body:

filteredTasks.map(t=>[

t.title,

t.employee_name ||
t.assigned_employee,

t.status,

t.priority

])


}

);



doc.save(
"TaskAI_Report.pdf"
);


};








// EXCEL


const exportExcel=()=>{


const sheet =
XLSX.utils.json_to_sheet(
filteredTasks
);


const book =
XLSX.utils.book_new();


XLSX.utils.book_append_sheet(
book,
sheet,
"Report"
);


XLSX.writeFile(
book,
"TaskAI_Report.xlsx"
);


};







return(




<div className="manager-report-container">






<div className="manager-report-header">


<div>


<h1>
TaskAI Management Report
</h1>


<p>
Enterprise Task Analytics & Performance Overview
</p>


</div>



<div className="manager-report-filter">


<FaFilter/>


<select

value={filter}

onChange={
e=>setFilter(e.target.value)
}

>


<option>
All
</option>


<option>
Completed
</option>


<option>
Pending
</option>


<option>
In Progress
</option>


</select>



</div>



</div>








<div className="manager-report-kpis">


<div>

<FaTasks/>

<h2>
{total}
</h2>

<span>
Total Tasks
</span>

</div>




<div>

<FaCheckCircle/>

<h2>
{completed}
</h2>

<span>
Completed
</span>

</div>




<div>

<FaClock/>

<h2>
{pending}
</h2>

<span>
Pending
</span>

</div>



<div>

<FaFire/>

<h2>
{critical}
</h2>

<span>
Critical
</span>

</div>



</div>








<div className="manager-report-grid">



<div className="manager-report-card">


<h3>
Task Completion
</h3>


<ResponsiveContainer
height={300}
width="100%"
>


<PieChart>


<Pie

data={statusData}

dataKey="value"

outerRadius={100}

label

>


{
statusData.map(
(item,index)=>

<Cell

key={index}

fill={COLORS[index]}

/>

)

}


</Pie>


<Tooltip/>

<Legend/>


</PieChart>


</ResponsiveContainer>



</div>







<div className="manager-report-card">


<h3>
Priority Distribution
</h3>



<ResponsiveContainer
height={300}
width="100%"
>


<BarChart
data={priorityData}
>


<CartesianGrid/>


<XAxis
dataKey="name"
/>


<YAxis/>


<Tooltip/>


<Bar

dataKey="value"

fill="#2563eb"

/>


</BarChart>


</ResponsiveContainer>



</div>



</div>





<div className="manager-report-card">


<h3>
Employee Performance Ranking
</h3>



<ResponsiveContainer
height={350}
width="100%"
>


<BarChart

data={employeeData}

layout="vertical"

>


<XAxis
type="number"
/>


<YAxis

dataKey="name"

type="category"

/>


<Tooltip/>


<Bar

dataKey="score"

fill="#16a34a"

/>


</BarChart>


</ResponsiveContainer>


</div>








<div className="manager-report-card">


<h3>
Monthly Task Trends
</h3>


<ResponsiveContainer
height={300}
width="100%"
>


<LineChart
data={monthlyData}
>


<CartesianGrid/>


<XAxis
dataKey="month"
/>


<YAxis/>


<Tooltip/>


<Line

dataKey="tasks"

stroke="#2563eb"

/>


</LineChart>


</ResponsiveContainer>


</div>








<div className="manager-report-ai">


<h3>
<FaRobot/>
 AI Business Insights
</h3>


{
insights.map(
(i,index)=>

<p key={index}>
{i}
</p>

)
}


</div>







<div className="manager-report-export">


<button onClick={exportPDF}>

<FaFilePdf/>

Export PDF

</button>



<button onClick={exportExcel}>

<FaFileExcel/>

Export Excel

</button>



</div>






</div>




);


}


export default Reports;