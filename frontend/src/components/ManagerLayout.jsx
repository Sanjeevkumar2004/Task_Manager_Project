import { Outlet } from "react-router-dom";

import ManagerSidebar from "./ManagerSidebar";
import ManagerNavbar from "./ManagerNavbar";

import "./ManagerLayout.css";


function ManagerLayout() {

const logout = async()=>{


try{


await api.post(

"/api/accounts/logout/"

);


}

catch(error){


console.log(error);


}



localStorage.removeItem(
"manager"
);


sessionStorage.clear();



navigate("/");



};
  return (

    <div className="manager-main">


      {/* Sidebar */}

      <ManagerSidebar />



      {/* Main Content */}

      <div className="manager-content">


        {/* Navbar */}

        


        {/* Child Pages */}

        <main className="manager-page">

          <Outlet />

        </main>



      </div>


    </div>

  );

}


export default ManagerLayout;