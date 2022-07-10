<template>
  <div class="principal">
     <h1>{{usuarioSesion.nombre_sucursal}}</h1>        
    <div class="row"></div>
      <div class="scroll-panel-salida-div rounded border">
      <div class="row">                
       <PopupPagoPendiente/>       
      </div>      
    </div>   
  </div>
</template>

<script>
import URL from "../helpers/Urls";
import { operacionesApi } from "../helpers/OperacionesApi";
import { getUsuarioSesion } from "../helpers/Sesion";
import  PopupPagoPendiente  from "./PopupPagoPendiente.vue";


export default {
  name: "principal",
  components: { PopupPagoPendiente },
  mixins: [operacionesApi],
  data() {
    return {      
      usuarioSesion: {}      
    };
  },
  mounted() {
    console.log("##### pagina principal ####");
    this.usuarioSesion = getUsuarioSesion();
    this.$root.$on("CAMBIO_SUCURSAL", text => {
      console.log("CAMBIO_SUCURSAL en MENU ENCABEZADO");
      let message = text;      
      this.usuarioSesion = getUsuarioSesion();      
    });
  },
  methods: {
  
  }
};
</script>

<style scoped>
.btn-head {
  width: 70px !important;
  height: 70px !important;
  /*font-size: 40px;*/
  font-size: 11px;
}

.scroll-div {
  width: 100%;
  height: 75px;
  overflow-y: scroll;
}

.scroll-horas-extra-div {
  width: 100%;
  height: 200px;
  overflow-y: scroll;
}

.scroll-panel-salida-div {
  width: 100%;
  height: 600px;
  padding-left: 15px;
  padding-right: 15px;
  /*overflow-y: scroll;*/
  overflow-y: hidden;
}

#toast-container {
  z-index: 9999999;
}

.fondo-rosa {
  background-color: "#e83e8c" !important;
}
</style>
