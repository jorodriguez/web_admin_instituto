<template>
  <div class="ventas">
    <h2>Terminal de Venta</h2>
    <!--<small>{{ usuarioSesion.nombre_sucursal }}</small>    -->
    <ul class="nav nav-tabs nav-justified " id="pills-tab" role="tablist">
      <li class="nav-item">
        <a
          class="nav-link active"
          id="pills-home-tab"
          data-toggle="pill"
          href="#pills-home"
          role="tab"
          aria-controls="pills-home"
          aria-selected="true"
          >Venta</a
        >
      </li>

      <li class="nav-item">
        <a
          class="nav-link"
          id="pills-consultas-tab"
          data-toggle="pill"
          href="#pills-consultas"
          role="tab"
          aria-controls="pills-consultas"
          aria-selected="false"
          @click="clickConsulta()"
        >
          Consulta
        </a>
      </li>

      <li class="nav-item">
        <a
          class="nav-link"
          id="pills-movimientos-tab"
          data-toggle="pill"
          href="#pills-movimientos"
          role="tab"
          aria-controls="pills-movimientos"
          aria-selected="false"
          >Movimientos
        </a>
      </li>
    </ul>
    <div class="tab-content" id="pills-tabContent">
      <div
        class="tab-pane fade show active"
        id="pills-home"
        role="tabpanel"
        aria-labelledby="pills-home-tab"
      >
        
            <!-- ventas -->
            <Venta />
        
      </div>
      <!-- Consultas -->
      <div
        class="tab-pane fade"
        id="pills-consultas"
        role="tabpanel"
        aria-labelledby="pills-consultas-tab"
      >
        <div class="card">
          <div class="card-body">
              <div v-if="loader" class="spinner-border text-primary" role="status"/>
              <VentasSucursal  :lista="listaVentas"/>
          </div>
        </div>
      </div>
      <!-- fin Consultas-->
      <!-- Movimientos -->
      <div
        class="tab-pane fade"
        id="pills-movimientos"
        role="tabpanel"
        aria-labelledby="pills-movimientos-tab"
      >
        <div class="card">
          <div class="card-body">
          Movimientos - cancelaciones de tickets 
          </div>
        </div>
      </div>
      <!-- fin Movimientos -->
    </div>
  </div>
</template>

<script>
import { operacionesApi } from "../../helpers/OperacionesApi";
import { getUsuarioSesion } from "../../helpers/Sesion";
import URL from "../../helpers/Urls";
import Venta from "./venta.vue";
import VentasSucursal from "./ventasSucursal.vue";
import Popup from "../../controller/Popup";

export default {
  name: "tabla-alumnos",
  components: {
    Popup,
    Venta,
    VentasSucursal
  },
  mixins: [operacionesApi],  
  data() {
    return {
      usuarioSesion: {},
      operacion: "",
      loader: false,
      listaVentas:[]
    };
  },
  mounted() {
    console.log("##### INCIAR VENTA ####");
    this.usuarioSesion = getUsuarioSesion();

    //this.init();
  },
  methods: {
    init() {},
    async clickConsulta(){
      //  await this.cargarLista();
    },
    /*async cargarLista(){
        this.loader =true;
        this.listaVentas = await this.putAsync(`${URL.VENTA}/sucursal/${this.usuarioSesion.co_sucursal}`,{fecha:this.fecha});        
        console.log(this.listaVentas)
        this.loader =false;
    }*/
  }
};
</script>

<style scoped></style>
