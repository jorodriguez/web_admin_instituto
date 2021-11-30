

import Vue from 'vue'
//import Notificaciones from './helpers/Notificaciones'

export const validacionDatosAlumno = (alumno) => {
  console.log("############## VALIDACION DE ALUMNO");
  if (alumno == null || alumno == undefined) {
    return false;
  } else {

    if (alumno == '') {
      //this.mensaje = "* Escribe un nombre";
      Vue.prototype.$notificacion.error('Escribe el nombre', 'El nombre es requerido.');
      return false;
    }
    if (alumno.apellidos == '') {
      //this.mensaje = "* Escribe el apellido";
      Vue.prototype.$notificacion.error('Escribe el apellido', 'El apellido es requerido.');
      return false;
    }
    if (alumno.cat_genero == -1) {
      //this.mensaje = "* Selecciona el sexo";
      Vue.prototype.$notificacion.error('Seleciona el sexo', 'El dato de sexo es requerido.');
      return false;
    }
    if (alumno.fecha_nacimiento == null || alumno.fecha_nacimiento == '') {      
      Vue.prototype.$notificacion.error('Selecciona la fecha de nacimiento', 'La fecha de nacimiento es requerida.');
      return false;
    }

    if (alumno.cat_genero == 0) {
      Vue.prototype.$notificacion.error('Selecciona el genero', 'El genero es requerido.');
      return false;
    }
   
    if (alumno.co_grupo == 0) {
      Vue.prototype.$notificacion.error('Selecciona una especialidad', 'La especialidad es requerida.');
      return false;
    }

    if (alumno.co_curso == 0) {
      Vue.prototype.$notificacion.error('Selecciona un curso', 'El curso es requerido.');
      return false;
    }

    if (alumno.fecha_inicio == null || alumno.fecha_inicio == '' ||alumno.fecha_fin == null || alumno.fecha_fin == '' ) {
      Vue.prototype.$notificacion.error('Selecciona las fechas de inicio y fin', 'Selecciona la fecha de inicio y de fin.');
      return false;
    }
        
    if (alumno.costo_colegiatura == null || alumno.costo_colegiatura == '') {      
      Vue.prototype.$notificacion.error('Escribe el costo de la colegiatura', 'El valor de costo de colegiatura es requedido.');
      return false;
    }

    if (alumno.costo_inscripcion == null || alumno.costo_inscripcion == '') {      
      Vue.prototype.$notificacion.error('Escribe el costo de la inscripción', 'El valor de costo de inscripción es requedido.');
      return false;
    }
  
    //--solo valida cuando esta activado mostrar el nombre de cariño
    /*if (alumno.mostrar_nombre_carino && alumno.nombre_carino.replace(/ /g, "") == '') {     
      Vue.prototype.$notificacion.error('Nombre de cariño', 'Escribe un nombre de cariño.');
      return false;
    }*/

    return true;
  }
}


export const validacionFechaLimitePagoAlumno = (alumno) => {
  console.log("#### VALIDACION DE ALUMNO  ###");
  if (alumno == null || alumno == undefined) {
    return false;
  } else {

    if (alumno.fecha_limite_pago_mensualidad == null
      || alumno.fecha_limite_pago_mensualidad == '') {
        Vue.prototype.$notificacion.error('Selecciona la fecha de pago de mensualidad', 'Selecciona la fecha de fecha de pago de la mensualidad.');
      return false;
    }
    return true;
  }
}