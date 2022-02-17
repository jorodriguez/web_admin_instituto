<template>
  <div class="ventas">
    <!--<h1>Venta</h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>    
    -->
    <div class="row mt-1 ">
      <nav aria-label="...">
        <ul class="pagination pagination-lg">          
          <li ><a class="page-link" href="#">Nueva</a></li>
          <li ><a class="page-link" href="#">Cobrar</a></li>
        </ul>
      </nav>
    </div>

    <div class="row border  border-success">
      <!-- Carrito de venta -->
      <div
        class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 p-1 "
      >
        <div class="card border border-info">
          <div>
            <div class="input-group ">
              <div class="input-group-prepend mr-1">
                <span class="input-group-text border-0" id="basic-addon1"
                  >Cant</span
                >
                <input
                  type="text"
                  class="form-control ml-1 bg-secondary "
                  style="width:50px"
                  v-model="cantidad"
                />
              </div>
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-default">
                  <i class="fas fa-barcode"></i>
                </span>
              </div>
              <input
                type="text"
                class="form-control"
                aria-label="Default"
                placeholder="Código"
                v-model="codigo"
                aria-describedby="inputGroup-sizing-default"
              />
            </div>
          </div>
          <div class="card-body border border-primary ">
            Carrito de o
          </div>
        </div>
      </div>
      <!-- Catalogo de productos -->
      <div
        class="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 p-1 "
      >
        <div class="card border border-danger ">
          <div>
            <div class="btn-group btn-group-toggle" data-toggle="buttons">
              <label class="btn btn-secondary active">
                <input
                  type="radio"
                  name="options"
                  id="option1"
                  autocomplete="off"
                  checked
                />
                Active
              </label>
              <label class="btn btn-secondary">
                <input
                  type="radio"
                  name="options"
                  id="option2"
                  autocomplete="off"
                />
                Radio
              </label>
              <label class="btn btn-secondary">
                <input
                  type="radio"
                  name="options"
                  id="option3"
                  autocomplete="off"
                />
                Radio
              </label>
            </div>
          </div>
          <div class="card-body border border-primary">
            Productos
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { operacionesApi } from "../../helpers/OperacionesApi";
import { getUsuarioSesion } from "../../helpers/Sesion";
import VeVenta from "../../models/VeVenta";
import VeVentaDetalle from "../../models/VeVentaDetalle";
import URL from "../../helpers/Urls";
import { en, es } from "vuejs-datepicker/dist/locale";
import moment from "moment";
import Popup from "../../controller/Popup";

export default {
  name: "tabla-alumnos",
  components: {
    Popup
  },
  mixins: [operacionesApi],
  props: ["listaInscripciones", "reload", "mostrar_acciones"],
  data() {
    return {
      uidCurso: "",
      usuarioSesion: {},
      operacion: "",
      venta:new VeVenta(),
      listaDetalleVenta: [],
      cantidad:1,
      producto:new VeVentaDetalle(),
      es: es,
      loader: false
    };
  },
  mounted() {
    console.log("##### INCIAR VENTA ####");
    this.usuarioSesion = getUsuarioSesion();
    //this.init();
  },
  methods: {
    init(){
      //--inciando venta
      this.venta = new VeVenta();
      this.ventaDetalle = new VeVentaDetalle();
    }
  }
};
</script>

<style scoped></style>
