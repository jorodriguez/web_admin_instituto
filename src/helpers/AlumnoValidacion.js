

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
    if (alumno.fecha_nacimiento == null || alumno.fecha_nacimiento == '') {
      //this.mensaje = "* Selecciona la fecha de nacimiento";
      Vue.prototype.$notificacion.error('Selecciona la fecha de nacimiento', 'La fecha de nacimiento es requerida.');
      return false;
    }
   
      if (alumno.cat_genero == -1) {
      //this.mensaje = "* Selecciona el sexo";
      Vue.prototype.$notificacion.error('Seleciona el sexo', 'El dato de sexo es requerido.');
      return false;
    }

    if (alumno.co_grupo == 0) {
      //this.mensaje = "Selecciona un grupo";
      Vue.prototype.$notificacion.error('Selecciona el grupo', 'El grupo es requerido.');
      return false;
    }

    if (alumno.hora_entrada == null || alumno.hora_salida == null
      || alumno.hora_entrada == '' || alumno.hora_salida == '') {
      //this.mensaje = "* Selecciona la hora de entrada y salida";
      Vue.prototype.$notificacion.error('Selecciona la hora de entrada y salida', 'La hora de entrada y salida son requeridos.');
      return false;
    }
    console.log("alumno.minutos_gracia " + alumno.minutos_gracia);
    if (alumno.minutos_gracia ===null || alumno.minutos_gracia === '') {
      //this.mensaje = "* Escribe los minutos de gracia";
      console.log("alumno.minutos_gracia " + alumno.minutos_gracia);
      Vue.prototype.$notificacion.error('Escribe los minutos de gracia', 'Los minutos de gracia son requeridos.');
      return false;
    }

    if (alumno.costo_inscripcion == null || alumno.costo_inscripcion == '') {
      //this.mensaje = "* Escribe el costo de incripción";
      Vue.prototype.$notificacion.error('Escribe el costo de la inscripción', 'El valor de costo de inscripción es requedido.');
      return false;
    }

    if (alumno.fecha_inscripcion == null || alumno.fecha_inscripcion == '') {
      //this.mensaje = "* Selecciona la fecha de inscripción";
      Vue.prototype.$notificacion.error('Selecciona la fecha de inscripción', 'Selecciona la fecha de inscripción.');
      return false;
    }

    if (alumno.fecha_limite_pago_mensualidad == null || alumno.fecha_limite_pago_mensualidad == '') {
      //this.mensaje = "* Selecciona la fecha de inscripción";
      Vue.prototype.$notificacion.error('Selecciona la fecha de pago', 'Selecciona la fecha de pago.');
      return false;
    }

    if (alumno.mostrar_nombre_carino && alumno.nombre_carino.replace(/ /g, "") == '') {     
      Vue.prototype.$notificacion.error('Nombre de cariño', 'Escribe un nombre de cariño.');
      return false;
    }

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