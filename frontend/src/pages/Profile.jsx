import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
    FaUserCircle,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaLock,
    FaShieldAlt,
    FaSignOutAlt,
    FaSave
} from "react-icons/fa";

import "./Profile.css";


function ManagerProfile(){

    const navigate = useNavigate();


    const [loading,setLoading] = useState(true);



    const [profile,setProfile] = useState({

        name:"",
        email:"",
        phone:""

    });



    const [password,setPassword] = useState({

        current:"",
        newPassword:"",
        confirmPassword:""

    });





    useEffect(()=>{

        loadProfile();

    },[]);






    // ==========================
    // LOAD MANAGER PROFILE
    // ==========================

    const loadProfile = async()=>{


        try{


            const res = await api.get(
                "/api/accounts/profile/"
            );


            setProfile(res.data);


        }

        catch(error){


            console.log(error);


            alert(
                "Unable to load manager profile"
            );


        }

        finally{


            setLoading(false);


        }


    };









    // ==========================
    // UPDATE PROFILE
    // ==========================

    const saveProfile = async()=>{


        try{


            await api.put(

                "/api/accounts/profile/update/",

                {


                    name:profile.name,

                    email:profile.email,

                    phone:profile.phone


                }

            );



            alert(
                "Profile updated successfully"
            );


        }


        catch(error){


            console.log(error);


            alert(
                "Profile update failed"
            );


        }



    };









    // ==========================
    // CHANGE PASSWORD
    // ==========================


    const changePassword = async()=>{


        if(
            password.newPassword !==
            password.confirmPassword
        ){


            alert(
                "Passwords do not match"
            );


            return;


        }





        try{


            await api.put(

                "/api/accounts/change-password/",

                {


                    current:
                    password.current,


                    new:
                    password.newPassword


                }

            );



            alert(
                "Password changed successfully"
            );



            setPassword({

                current:"",
                newPassword:"",
                confirmPassword:""

            });



        }


        catch(error){


            console.log(error);


            alert(
                "Unable to change password"
            );


        }


    };









    // ==========================
    // LOGOUT
    // ==========================


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








    if(loading){


        return(

            <div className="manager-profile-loading">

                Loading Profile...

            </div>

        );


    }









    return(


        <div className="manager-profile-container">


            <div className="manager-profile-card">





                {/* HEADER */}


                <div className="manager-profile-header">


                    <FaUserCircle
                        className="manager-profile-avatar"
                    />



                    <h2>

                        {profile.name}

                    </h2>



                    <p>

                        Manager Administrator

                    </p>


                </div>









                {/* PERSONAL INFORMATION */}


                <div className="manager-profile-section">


                    <h3>

                        <FaUser/>

                        Personal Information

                    </h3>




                    <div className="manager-profile-grid">



                        <div className="manager-profile-input">


                            <label>
                                Name
                            </label>



                            <input

                                type="text"

                                value={
                                    profile.name
                                }


                                onChange={
                                    e=>

                                    setProfile({

                                        ...profile,

                                        name:
                                        e.target.value

                                    })

                                }


                            />


                        </div>






                        <div className="manager-profile-input">


                            <label>
                                Email
                            </label>



                            <input

                                type="email"

                                value={
                                    profile.email
                                }


                                onChange={
                                    e=>

                                    setProfile({

                                        ...profile,

                                        email:
                                        e.target.value

                                    })

                                }


                            />


                        </div>






                        <div className="manager-profile-input">


                            <label>
                                Phone
                            </label>



                            <input

                                type="text"

                                value={
                                    profile.phone
                                }


                                onChange={
                                    e=>

                                    setProfile({

                                        ...profile,

                                        phone:
                                        e.target.value

                                    })

                                }


                            />


                        </div>



                    </div>







                    <button

                        className="manager-profile-save-btn"

                        onClick={saveProfile}

                    >


                        <FaSave/>

                        Save Changes


                    </button>



                </div>
                // ==========================
// CHANGE PASSWORD SECTION
// ==========================


<div className="manager-profile-section">


    <h3>

        <FaLock/>

        Change Password

    </h3>




    <div className="manager-profile-grid">



        <div className="manager-profile-input">


            <label>
                Current Password
            </label>


            <input

                type="password"

                placeholder="Current Password"

                value={
                    password.current
                }


                onChange={
                    e=>

                    setPassword({

                        ...password,

                        current:
                        e.target.value

                    })

                }


            />


        </div>







        <div className="manager-profile-input">


            <label>
                New Password
            </label>


            <input

                type="password"

                placeholder="New Password"

                value={
                    password.newPassword
                }


                onChange={
                    e=>

                    setPassword({

                        ...password,

                        newPassword:
                        e.target.value

                    })

                }


            />


        </div>







        <div className="manager-profile-input">


            <label>
                Confirm Password
            </label>


            <input

                type="password"

                placeholder="Confirm Password"

                value={
                    password.confirmPassword
                }


                onChange={
                    e=>

                    setPassword({

                        ...password,

                        confirmPassword:
                        e.target.value

                    })

                }


            />


        </div>



    </div>






    <button

        className="manager-profile-password-btn"

        onClick={changePassword}

    >


        <FaShieldAlt/>

        Change Password


    </button>



</div>









{/* ACCOUNT INFORMATION */}



<div className="manager-profile-section">


    <h3>

        Account Information

    </h3>





    <div className="manager-account-info">





        <div>


            <FaUser/>


            <span>
                Role
            </span>


            <strong>
                Manager
            </strong>


        </div>






        <div>


            <FaEnvelope/>


            <span>
                Email
            </span>


            <strong>

                {profile.email}

            </strong>


        </div>






        <div>


            <FaPhone/>


            <span>
                Phone
            </span>


            <strong>

                {profile.phone || "Not Added"}

            </strong>


        </div>





    </div>



</div>









{/* LOGOUT */}



<div className="manager-profile-section manager-logout-section">


    <button

        className="manager-logout-btn"

        onClick={logout}

    >


        <FaSignOutAlt/>

        Logout


    </button>



</div>








</div>


</div>


);


}


export default ManagerProfile;