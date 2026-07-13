import axios from "axios";


const api = axios.create({

    baseURL:"http://127.0.0.1:8000",

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