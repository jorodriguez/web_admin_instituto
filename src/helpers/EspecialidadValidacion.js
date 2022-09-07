

import Vue from 'vue'
import { validarEmail } from './CorreoValidacion'

export const validarDatosEspecialidad = (especialidad) => {
  console.log("# VALIDACION DE ESPECIALIDAD #");
  if (especialidad == null || especialidad == undefined) {
    return false;
  } else {

    if (!especialidad.nombre) {
      Vue.prototype.$notificacion.error('Escribe el nombre de la especialidad.', 'El nombre es requerido.');
      return false;
    }
    
    if (!especialidad.duracion) {      
        Vue.prototype.$notificacion.error('Escribe la duración ', 'La duración es requerida.');
        return false;      
    }    
    return true;
  }
}

