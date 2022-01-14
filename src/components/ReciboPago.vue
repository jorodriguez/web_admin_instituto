<template>
  <span>
    <button
      type="button"
      class="btn btn-sm btn-link"      
    >
      Imprimir
    </button>
    <span v-if="this.loadingPage">Cargando..</span>
    <span v-else v-html="this.pagePreview"></span>
  </span>
</template>

<script>
import { operacionesApi } from "../helpers/OperacionesApi";
import { getUsuarioSesion } from "../helpers/Sesion";

import URL from "../helpers/Urls";
import Vue from "vue";

export default {
  components: {
    
  },
  mixins: [operacionesApi],
  name: "recibo-pago",
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
    console.log(" =========== RECIBO PAGO=======");
    this.idPago = `${this.$route.params.id_pago}`;
    console.log(" RECIBO PAGO "+this.idPago);
    this.onInit();
  },
  methods: {
    onInit() {
      this.usuarioSesion = getUsuarioSesion();
      this.getPreview();
    },

    verPago() {      
      this.getPreview();      
    },
 
    async getPreview() {
      if(this.idPago){
      this.loadingPage = true;       
      this.existeHtml = false;
      this.get(URL.PAGOS_BASE + "/imprimir/"+this.idPago, result => {
        if (result.data != null) {
          this.pagePreview = result.data;          
          this.loadingPage = false;
          this.existeHtml = true;
          //$("#popup_preview").modal("show");
        }
      });
      }
    },

  }
};
</script>
