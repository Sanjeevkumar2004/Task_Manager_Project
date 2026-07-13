import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaUserCircle,
  FaChevronDown,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

import "./ManagerNavbar.css";


function ManagerNavbar() {


  const navigate = useNavigate();


  const manager =
    JSON.parse(localStorage.getItem("manager")) || {};



  const [open, setOpen] = useState(false);


  const dropdownRef = useRef(null);





  useEffect(() => {


    const handleClickOutside = (event) => {


      if(
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ){

        setOpen(false);

      }


    };



    document.addEventListener(
      "mousedown",
      handleClickOutside
    );



    return () => {


      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );


    };


  }, []);







  const logout = () => {


    localStorage.clear();

    sessionStorage.clear();


    navigate("/");


  };








return (



<header className="manager-navbar">





{/* Left */}



<div className="navbar-left">


<h2>
Dashboard
</h2>


<p>
Welcome back, {manager.name || "Manager"} 👋
</p>



</div>







{/* Right */}



<div className="navbar-right">



<div
className="profile-dropdown"
ref={dropdownRef}
>



<button

className="profile-button"

onClick={() => setOpen(!open)}

>



<FaUserCircle 
className="profile-avatar"
/>




<div className="profile-text">


<strong>

{manager.name || "Manager"}

</strong>



<span>

Administrator

</span>



</div>





<FaChevronDown

className={
open
?
"arrow rotate"
:
"arrow"
}

/>



</button>









{
open && (


<div className="dropdown-menu">





<button

onClick={() => {

setOpen(false);

navigate("/manager/profile");

}}

>


<FaUser />

My Profile


</button>







<button

onClick={() => {

setOpen(false);

logout();

}}

>


<FaSignOutAlt />

Logout


</button>






</div>



)

}





</div>



</div>






</header>



);


}


export default ManagerNavbar;