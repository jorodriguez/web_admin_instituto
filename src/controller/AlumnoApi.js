

import Vue from "vue";
import {operacionesApi} from "../helpers/OperacionesApi";
import URL from "../helpers/Urls";

const getAlumnoById = (id_alumno,handler)=>{  
    console.log("getAlumnoById"+JSON.stringify(operacionesApi));  
  return operacionesApi.methods.get(
        URL.ALUMNOS_BASE + "/id/" + id_alumno,        
        handler
    );
}


export default getAlumnoById;

 

