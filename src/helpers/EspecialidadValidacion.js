

import Vue from 'vue'

export const validarDatosEspecialidad = (especialidad) => {
  console.log("# VALIDACION DE ESPECIALIDAD #");
  if (!especialidad) {
    Vue.prototype.$notificacion.error('Error', 'Por favor ponte en contacto con el equipo de soporte.');
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

