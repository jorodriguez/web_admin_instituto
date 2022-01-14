<template>
  <span>
    <button
      type="button"
      class="btn btn-sm btn-link"
      target="_blank"
      v-on:click="verPago()"
    >
      Imprimir
    </button>

    <Popup id="popup_preview" size="lg" :show_button_close="true">
      <div slot="header">
        Pago        
      </div>    

      <div slot="content"  style="color:#000">                
      {{this.pagePreview}}
        <!--<span v-if="this.loadingPage">Cargando..</span>
        <span v-else v-html="this.pagePreview"></span>
        -->
      </div>
      <div slot="footer">
        <button
          class="btn btn-primary"
          v-if="this.existeHtml"
          :disabled="this.loading"          
        >
         Imprimir
        </button>
      </div>
    </Popup>
  </span>
</template>

<script>
import Popup from "../controller/Popup";
import { operacionesApi } from "../helpers/OperacionesApi";
import { getUsuarioSesion } from "../helpers/Sesion";
import { filtrarNombreAlumno } from "../helpers/FiltarUtils";
import URL from "../helpers/Urls";
import Vue from "vue";

export default {
  components: {
    Popup    
  },
  mixins: [operacionesApi],
  name: "imprimir-pago",
  props: ["idPago"],
  data() {
    return {
      id: 0,
      resultado: {},
      usuarioSesion: {},    
      loading: false,
      loadingPage: false,
      pagePreview: null,
      existeHtml: false,
    };
  },
  mounted() {
  
    this.onInit();
  },
  methods: {
    onInit() {
      this.usuarioSesion = getUsuarioSesion();
    },

    verPago() {      
      this.getPreview();      
    },

  
    async getPreview() {
      this.loadingPage = true;       
      this.existeHtml = false;
      this.get(URL.PAGOS_BASE + "/imprimir/"+this.idPago, result => {
        if (result.data != null) {
          this.pagePreview = result.data;          
          this.loadingPage = false;
          this.existeHtml = true;
          $("#popup_preview").modal("show");
        }
      });
    },

  }
};
</script>
