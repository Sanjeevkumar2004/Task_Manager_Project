import axios from "axios";


const api = axios.create({

    baseURL:"https://task-manager-project-utb1.onrender.com",

    headers:{
        "Content-Type":"application/json"
    },

    withCredentials:true

});



api.interceptors.response.use(

    response => response,


    error => {


        if(error.response){


            console.log(
                "API Error:",
                error.response.status,
                error.response.data
            );


        }


        return Promise.reject(error);

    }

);



export default api;
