<template>
  <div>
    <h1>Lista de Asistencia</h1>            
    <small>{{usuarioSesion.nombre_sucursal}}</small>     
    <div class="text-left">      
      <router-link to="/Asistencia" class="btn btn-secondary btn-lg">
        <i class="fas fa-arrow-circle-left text-gray"></i>
      </router-link>
    </div>
    <ReporteAsistenciaComponent />
  </div>
</template>

<script >
import Vue from "vue";
import ReporteAsistenciaComponent from "./ReporteAsistenciaComponent";
import {getUsuarioSesion} from '../helpers/Sesion';

export default {
  name: "ReporteAsistencia",
  components: {
    ReporteAsistenciaComponent
  },
  props: {},
  data() {
    return {sesion:null,usuarioSesion:{}};
  },
  mounted() {    
     console.log("iniciando el componente reporte de asistencia ");
    //this.sesion = this.$session.get("usuario_sesion");
    this.usuarioSesion = getUsuarioSesion();
/*
    if (!this.sesion || !this.sesion.usuario) {
      console.log("No tiene sesion");
      //this.$router.push("/");      
      return;
    }*/
    //this.usuarioSesion = this.sesion.usuario;
  },
  methods: {}
};
</script>
