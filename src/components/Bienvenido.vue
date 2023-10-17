
<template>
  <span id="bienvenido">
    <MenuSidebar></MenuSidebar>
    <div class="main-content">
      <MenuEncabezado />      
      <Header />

      <div v-if="sucursal.pago_pendiente_bloquear" class="bg-gradient-warning border-1 border text-white mt-1" >
          Ya esta disponible tu facturación mensual
           <router-link to="/Cuenta">ver mas detalle</router-link>
      </div>
      <div class="container-fluid override fondo-override " >
       <!--- <div class="col-xl-12 mb-12 mb-xl-0">-->
          <vue-page-transition name="fade-in-up">          
              <router-view />
          </vue-page-transition>
        <!--</div>-->
      </div>
    </div>       
  </span>
</template>

<script>
import Popup from "../controller/Popup";
import MenuEncabezado from "../templates/menuEncabezado";
import MenuSidebar from "../templates/menuSidebar";
import Header from "../templates/header";
import MonitorRed from "../componentes_generales/MonitorRed";
import {  clearSesion } from "../helpers/Sesion";
import { getUsuarioSesion } from "../helpers/Sesion";
import {
    operacionesApi
} from '../helpers/OperacionesApi'

import URL from '../helpers/Urls'


export default {  
  components: {
    Popup,
    MenuSidebar,
    MenuEncabezado,
    Header,
    MonitorRed
  },
  mixins: [operacionesApi],
  name: "Bienvenido",
   data() {
    return {      
      usuarioSesion: {},
      sucursal:{}
    };
  },
  mounted() {
    console.log("##### pagina bienvenido ####");
    this.usuarioSesion = getUsuarioSesion();    
    this.cargarInformacionSucursal();
  },
  methods: {
    async cargarInformacionSucursal() {
            this.sucursal = await this.getAsync(
                `${URL.SUCURSAL_BASE}/${this.usuarioSesion.co_sucursal}`,
            )
    },
    signout() {
      console.log("Signout ");
      //this.$session.clear();
      clearSesion();
      $("#popup_expiracion_sesion").modal("hide");
      this.$router.push("/");
    }
  }
};
</script>

