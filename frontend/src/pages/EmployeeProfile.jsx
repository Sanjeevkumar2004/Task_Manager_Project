import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import EmployeeSidebar from "../components/EmployeeSidebar";

import {
  FaUserCircle,
  FaPhoneAlt,
  FaEnvelope,
  FaBriefcase,
  FaIdBadge,
  FaTools,
  FaAward,
  FaSave,
  FaLock,
} from "react-icons/fa";

import "./EmployeeProfile.css";


function EmployeeProfile() {


const navigate = useNavigate();


const employee = JSON.parse(
    localStorage.getItem("employee")
);



const [profile,setProfile]=useState({

    employee_id:"",
    name:"",
    email:"",
    phone:"",
    position:"",
    experience:"",
    skills:"",
    photo:""

});


const [saving,setSaving]=useState(false);



useEffect(()=>{


    if(!employee){

        navigate("/employee-login");

        return;

    }


    loadProfile();


},[]);




// ===============================
// LOAD PROFILE
// ===============================

const loadProfile=async()=>{


try{


const res=await api.get(

`/api/employees/${employee.employee_id}/`

);



setProfile(res.data);



}

catch(error){


console.log(
error.response?.data || error
);


alert(
"Unable to load profile"
);


}



};





// ===============================
// INPUT CHANGE
// ===============================


const handleChange=(e)=>{


setProfile({

...profile,

[e.target.name]:e.target.value

});


};





// ===============================
// UPDATE PROFILE
// ===============================


const updateProfile = async () => {

    try {

        setSaving(true);


        const employeeId = profile.employee_id;


        const updateData = {

            phone: profile.phone,

            skills: profile.skills

        };


        const response = await api.put(

            `/api/employees/update/${employeeId}/`,

            updateData

        );


        console.log(
            "Update Response:",
            response.data
        );


        alert(
            "Profile Updated Successfully"
        );


        // Update profile page immediately
        setProfile(prev => ({

            ...prev,

            phone: response.data.phone,

            skills: response.data.skills

        }));


        // Update local storage
        const oldEmployee = JSON.parse(
            localStorage.getItem("employee")
        );


        localStorage.setItem(

            "employee",

            JSON.stringify({

                ...oldEmployee,

                phone: response.data.phone,

                skills: response.data.skills

            })

        );


    }


    catch(error){


        console.log(

            "UPDATE ERROR:",

            error.response?.data || error

        );


        alert(
            "Unable to Update Profile"
        );


    }


    finally{


        setSaving(false);


    }


};
// ===============================
// PHOTO UPDATE
// ===============================


const handlePhoto=async(e)=>{


const file=e.target.files[0];


if(!file)
return;



const formData=new FormData();


formData.append(
"photo",
file
);



try{


await api.put(


`/api/employees/update-photo/${profile.employee_id}/`,


formData,


{

headers:{

"Content-Type":"multipart/form-data"

}

}


);



alert(
"Profile photo updated"
);



loadProfile();



}


catch(error){


console.log(error);


}


};







return(


<div className="profile-page">


<EmployeeSidebar />


<div className="profile-content">



<div className="profile-header">


<div>

<h2>
My Profile
</h2>


<p>
View and manage your personal information
</p>


</div>


</div>





<div className="profile-card-main">


<div className="row g-4">



<div className="col-lg-4">


<div className="profile-left">



<img

src={

profile.photo

?

`http://127.0.0.1:8000${profile.photo}`

:

"https://cdn-icons-png.flaticon.com/512/149/149071.png"

}

className="profile-image"

alt="profile"

/>



<input

type="file"

id="photoInput"

hidden

onChange={handlePhoto}

/>



<button

className="photo-btn"

onClick={()=>


document.getElementById(
"photoInput"
).click()


}

>

Change Photo

</button>





<h3>

{profile.name}

</h3>


<p>

{profile.position}

</p>



<span className="status-badge">

Active Employee

</span>



<div className="summary-box">



<div className="summary-item">


<FaAward />


<div>

<small>
Experience
</small>


<h5>

{profile.experience} Years

</h5>


</div>


</div>





<div className="summary-item">


<FaTools />


<div>


<small>
Total Skills
</small>


<h5>

{

profile.skills

?

profile.skills.split(",").length

:

0

}

</h5>


</div>


</div>


</div>



</div>


</div>







<div className="col-lg-8">


<div className="profile-right">


<h4 className="section-title">

Personal Information

</h4>



<div className="row">



<div className="col-md-6 mb-3">


<label>

<FaUserCircle/>

Name

</label>


<input

className="form-control"

value={profile.name}

disabled

/>


</div>





<div className="col-md-6 mb-3">


<label>

<FaEnvelope/>

Email

</label>


<input

className="form-control"

value={profile.email}

disabled

/>


</div>





<div className="col-md-6 mb-3">


<label>

<FaIdBadge/>

Employee ID

</label>


<input

className="form-control"

value={profile.employee_id}

disabled

/>


</div>





<div className="col-md-6 mb-3">


<label>

<FaPhoneAlt/>

Phone Number

</label>


<input

className="form-control"

name="phone"

value={profile.phone}

disabled

/>


</div>






<div className="col-md-6 mb-3">


<label>

<FaBriefcase/>

Position

</label>


<input

className="form-control"

value={profile.position}

disabled

/>


</div>





<div className="col-md-6 mb-3">


<label>

<FaAward/>

Experience

</label>


<input

className="form-control"

value={`${profile.experience} Years`}

disabled

/>


</div>
<div className="col-12">


<label>

<FaTools/>

Skills

</label>


<textarea

rows="5"

className="form-control"

name="skills"

value={profile.skills}

disabled

/>


</div>



</div>




</div>


</div>




</div>


</div>


</div>

</div>
);

}
export default EmployeeProfile;