<template>
<div id="popup_pago_pendiente" :style="`background-color:${colorFondo}`" class="modal fade"  data-backdrop="static"  tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalCenterTitle"></h5>
        <button v-if="bloquear" type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <img v-if="imagen == ''" 
              src="https://img.freepik.com/vector-gratis/lindo-gato-jugando-ilustracion-icono-vector-dibujos-animados-bola-hilo-concepto-icono-naturaleza-animal-aislado-vector-premium-estilo-dibujos-animados-plana_138676-3568.jpg"/>
              
        <img v-else :src="imagen" />
      </div>
      <div class="modal-footer">
        <button :disabled="bloquear" type="button" class="btn bg-pink" data-dismiss="modal">Hoy es un buen día para sonreir 😊</button>        
      </div>
    </div>
  </div>  
</div>
</template>


<script>
import Popup from "../controller/Popup";
import { operacionesApi } from "../helpers/OperacionesApi";
import { getUsuarioSesion } from "../helpers/Sesion";
import URL from "../helpers/Urls";
import Vue from "vue";

export default {
  components: {
    Popup    
  },
  mixins: [operacionesApi],
  name: "popup-pago-pendiente",  
  data() {
    return {      
      usuarioSesion: {},
      bloquear:false,
      colorFondo:"transparent",
      imagen:""
    };
  },
  mounted() {
    console.log("===== iniciado popup pago pendiente ======");
    this.onInit();
  },
  methods: {
     onInit() {      
      this.usuarioSesion = getUsuarioSesion();
      console.log("TIENE PAGO PENDIENTE "+this.usuarioSesion.pago_pendiente);     

      //Cambio para solo bloquear cuando ya haya pasado 2 dias sin recibir pago
      
      //if(this.usuarioSesion.pago_pendiente){
      if(this.usuarioSesion.pago_pendiente_bloquear){
        this.bloquear = this.usuarioSesion.pago_pendiente_bloquear;
        this.imagen = this.usuarioSesion.pago_pendiente_imagen;
        this.colorFondo = this.usuarioSesion.pago_pendiente_fondo;
        $("#popup_pago_pendiente").modal("show");
      }
    },
  }
};
</script>