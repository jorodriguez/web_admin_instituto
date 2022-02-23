<template>
  <div class="ventas">
    <div class="card">
      <div class="card-body ">
        <div class="row mt-1 ">
          <div class="col border">
            <nav aria-label="...">
              <ul class="pagination pagination-lg border">
                <li>
                <button
                    @click="iniciarNuevaVenta()"
                    class="page-link"
                    href="#"
                  >
                     Nueva
                  </button>
                </li>
                <li>
                  <button
                    @click="iniciarBuscarProducto()"
                    class="page-link"
                    href="#"
                  >
                     Buscar
                  </button>
                </li>
                <li><a class="page-link" href="#">Cobrar</a></li>
                <li>
                  <a class="page-link text-red" @click="salir()" href="#"
                    >Salir</a
                  >
                </li>
              </ul>
            </nav>
          </div>
          <div class="col border">
            <div class="row border">
              <div class="col-4 text-right"></div>
              <div class="col-3  text-right">
                <h1>Total</h1>
              </div>
              <div class="col-5 bg-dark  rounded text-left">
                <h1 class="text-white">${{ formatPrice(total) }}</h1>
                
              </div>
            </div>
          </div>
        </div>

        <div class="row ">
          <!-- Carrito de venta -->
          <!--<div class="col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7 p-1 ">-->
          <div class="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 p-1 ">
            <div class="card border border-light p-1">
              <div>
                <small v-if="mensajeCodigo" class="text-danger">{{
                  mensajeCodigo
                }}</small>
                <div class="input-group ">
                  <div class="input-group-prepend mr-1">
                    <span class="input-group-text border-0" id="basic-addon1"
                      >Cant</span
                    >
                    <input
                      type="number"
                      class="form-control ml-1 bg-secondary "
                      style="width:50px"
                      v-model="cantidad"
                    />                    
                  </div>
                  <div class="input-group-prepend">
                    <span
                      class="input-group-text"
                      id="inputGroup-sizing-default"
                    >
                      <i
                        :class="
                          `fas fa-barcode ${loaderCodigo ? 'text-red' : ''}`
                        "
                      ></i>
                      <!--<div v-if="loaderCodigo" class="spinner-border text-light" role="status">
                          
                      </div>-->
                    </span>
                  </div>
                  <input
                    type="text"
                    class="form-control font-weight-bold"
                    aria-label="Default"
                    placeholder="Código"
                    :readonly="loaderCodigo"
                    v-model="codigo"
                    @keyup.enter="buscarCodigo()"
                    aria-describedby="inputGroup-sizing-default"
                    autofocus
                  />
                </div>
              </div>
              <div class="card-body border scroll">
                <span
                  v-for="(detalle, index) in listaDetalleVenta"
                  :key="detalle.id"
                >
                
                  <div
                    :class="
                      `row  border-bottom border-secondary pt-1 pb-1 ${index %
                        2 !=
                        0 && 'bg-pink'}`
                    "
                  >
                  <div class="text-center col-1 " @click="eliminarDetalleCarrito(detalle)">
                      <h5><i class="fas fa-trash text-danger" /></h5>
                    </div>
                    <div class="col-1">
                      <img
                        v-if="detalle.foto"
                        alt
                        :src="detalle.foto"
                        class="pointer mr-3 "
                        width="100"
                      />
                      <div
                        v-else
                        alt
                        class="pointer border border-gray mr-3 bg-light"
                        height="100"
                      />
                    </div>
                    <div class="text-left col-7 ">
                      <h4>
                        {{ detalle.articulo }}
                      </h4>
                      <small class="font-weight-normal text-wrap">{{
                        detalle.descripcion
                      }}</small>
                      <h5>{{ detalle.marca }}</h5>
                    </div>
                    <div class="text-left col-1 ">
                      <i
                        class="fas fa-minus pointer"
                        @click="restarCantidad(detalle)"
                      />
                      <input
                        id="inputCargo"
                        type="number"
                        v-model="detalle.cantidad"
                        placeholder="Cantidad"
                        style="width:40px;"
                        min="1"
                        max="999"
                        maxlength="3"
                        v-on:keyup.enter="recalcularPorEnter(detalle)"
                        @change="recalcularPorEnter(detalle)"
                      />                      
                      <i
                        class="fas fa-plus pointer"
                        @click="sumarCantidad(detalle)"
                      />
                    </div>
                    <div class="text-left col-1 ">
                      <span class="h3">${{ formatPrice(detalle.precio) }}</span>
                    </div>
                    <div class="text-left col-1 ">
                      <span class="h3"
                        >${{ formatPrice(detalle.importe) }}</span
                      >
                    </div>
                    
                  </div>
                </span>
              </div>
             
            </div>
          </div>
         
        </div>
      </div>
    </div>

    <!-- buscar producto -->
    <div
      id="buscar-producto"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div class="card-body border  ">
              <div class="input-group mb-3">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Buscar por nombre.."
                  v-model="criterioNombre"
                  v-on:keyup.enter="buscarPorCriterioNombre()"
                  aria-label="Buscar articulo ..."
                  autofocus
                />
                <div class="input-group-append">
                  <button
                    class="btn btn-outline-secondary "
                    type="button"
                    v-on:click="buscarPorCriterioNombre()"
                  >
                    <i class="fas fa-search"></i>
                  </button>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table table-sm table-striped">
                  <!-- style="display: block;  height: 500px; overflow-y: scroll"-->
                  <tbody class="scroll-tbody-y table-body">
                    <span class="text-muted" v-if="loaderBuscar"
                      >Buscando..</span
                    >
                    <span
                      class="text-muted"
                      v-if="articulosEncontradosCriterio == null"
                      >sin resultados</span
                    >

                    <tr
                      v-for="prod in articulosEncontradosCriterio"
                      :key="prod.id"
                    >
                      <td class="p-0 m-0">
                        <img
                          v-if="prod.foto"
                          alt
                          :src="prod.foto"
                          class="pointer mr-3 border border-secondary"
                          width="100"
                        />
                        <img
                          v-else
                          alt
                          class="pointer mr-3 border border-light"
                          width="100"
                          height="80"
                        />
                      </td>
                      <td class="text-left m-0 p-0">
                        <h4 class="text-wrap">
                          {{ prod.nombre }}
                        </h4>
                        <small class="font-weight-normal text-wrap">{{
                          prod.descripcion
                        }}</small>
                        <h5>{{ prod.marca }}</h5>
                      </td>
                      <td class="m-0 h2"><h2>${{ formatPrice(prod.precio) }}</h2></td>
                      <td class="m-0 " @click="agregarProductoBusqueda(prod)">
                        <h1><i class="fas fa-plus text-primary"></i></h1>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--<div class="fixed-absolute ">-->
              <!--<div class="fixed-sticky ">
                  <div class="card" style="background-color:#fff;">
                    <div class="card-body">
                      <div class="row">
                        <div class="col-6 text-right"></div>
                        <div class="col-6  text-left">
                         
                        </div>
                      </div>
                    </div>
                  </div>
                </div>-->
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- fuin buscar producto-->



    <!-- Cobrar -->
    <div
      id="cobrar"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div class="card-body border  ">          
              <div class="table-responsive">
                <table class="table table-sm table-striped">                
                  <tbody class="scroll-tbody-y table-body">                    
                        
                  </tbody>
                </table>
              </div>          
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- fuin buscar producto-->
  </div>
</template>

<script>
import Vue from "vue";
import { operacionesApi } from "../../helpers/OperacionesApi";
import { formatPrice } from "../../helpers/Utils";
import { getUsuarioSesion } from "../../helpers/Sesion";
import VeVenta from "../../models/VeVenta";
import VeVentaDetalle from "../../models/VeVentaDetalle";
import URL from "../../helpers/Urls";
import { en, es } from "vuejs-datepicker/dist/locale";
import moment from "moment";
import Popup from "../../controller/Popup";

const AFECTACION = { SUMAR: "SUMA", RESTAR: "RESTAR" };

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
      venta: new VeVenta(),
      listaDetalleVenta: [],
      codigo: null,
      cantidad: 1,
      total: 0,
      totalArticulos: 0,
      producto: new VeVentaDetalle(),
      catalogoArticulos: [],
      articulosEncontradosCriterio: [],
      es: es,
      loader: false,
      loaderBuscar: false,
      loaderCodigo: false,
      loaderCatalogo: false,
      mensajeCodigo: "",
      criterioNombre: "",
      formatPrice: formatPrice
    };
  },
  mounted() {
    console.log("##### INCIAR VENTA ####");
    this.usuarioSesion = getUsuarioSesion();
    this.$root.mostrarSidebar = false;
    this.init();
  },
  methods: {
    async init() {
      //--inciando venta
      this.venta = new VeVenta();
      this.ventaDetalle = new VeVentaDetalle();
      await this.cargarCatalogo();
    },
    salir() {
      this.$root.mostrarSidebar = true;
    },
    async cargarCategorias() {
      this.loaderCatalogo = true;
      console.log("@ccargarCategorias");
      this.categoriaArticulos = await this.getAsync(
        `${URL.CATEGORIA_ARTICULO}/${this.usuarioSesion.co_sucursal}`
      );
      this.loaderCatalogo = false;
    },
    async cargarCatalogo() {
      this.loaderCatalogo = true;
      console.log("@c@@@@argarCatalogo");
      console.log(`${URL.ARTICULO}/sucursal/${this.usuarioSesion.co_sucursal}`);
      this.catalogoArticulos = await this.getAsync(
        `${URL.ARTICULO}/sucursal/${this.usuarioSesion.co_sucursal}`
      );
      this.loaderCatalogo = false;
    },
    iniciarBuscarProducto() {
      this.criterioNombre = "";
      $("#buscar-producto").modal("show");
    },
    iniciarNuevaVenta(){
      this.venta = new VeVenta();
      this.ventaDetalle = new VeVentaDetalle();
      this.listaDetalleVenta = [];
    },
    async buscarPorCriterioNombre() {
      console.log("buscar por criterio " + this.criterioNombre);
      this.loaderBuscar = true;
      this.articulosEncontradosCriterio = await this.getAsync(
        `${URL.ARTICULO}/nombre/${this.criterioNombre}/${
          this.usuarioSesion.co_sucursal
        }`
      );
      this.loaderBuscar = false;
    },
    async agregarProductoBusqueda(item) {
        this.cantidad = 1;
        this.codigo = item.codigo;
        await this.buscarCodigo();
    },
    async buscarCodigo() {
      console.log("buscar codigo" + this.codigo);
      this.mensajeCodigo = "";

      if (this.cantidad == null || this.cantidad == 0) {
        this.$notificacion.warn("Escribe la Cantidad", "Escribe el Cantidad.");
        return;
      }

      if (this.codigo == null || this.codigo == "") {
        this.$notificacion.warn(
          "Escribe el Código",
          "Escribe el código y oprime enter para buscarlo."
        );
        return;
      }

      this.loaderCodigo = true;

      const producto = await this.getAsync(
        `${URL.ARTICULO}/${this.codigo}/${this.usuarioSesion.co_sucursal}`
      );

      this.codigo = "";

      if (producto == null) {
        this.mensajeCodigo = "Código no encontrado";
        this.loaderCodigo = false;
        return;
      }

      const detalle = new VeVentaDetalle();
      detalle
        .setCatArticuloSucursal(producto.id)
        .setFoto(producto.foto)
        .setArticulo(producto.nombre)
        .setDescripcion(producto.descripcion)
        .setMarca(producto.marca)
        .setCategoria(producto.categoria)
        .setPrecio(producto.precio)
        .setCantidad(this.cantidad)
        .setImporte(producto.precio * this.cantidad)
        .setCoSucursal(this.usuarioSesion.co_sucursal)
        .setCoEmpresa(this.usuarioSesion.id_empresa);

      this.listaDetalleVenta.push(detalle);

      this.calcularTotal();

      this.loaderCodigo = false;
    },
    recalcularPorEnter(detalle){
      
      const nuevoImporte = Number(detalle.cantidad * detalle.precio);

      detalle.setImporte(nuevoImporte);
      this.calcularTotal();
    },  
    eliminarDetalleCarrito(item){
       this.listaDetalleVenta = removeItemArray(this.listaDetalleVenta,item);
       this.calcularTotal();
    },
    sumarCantidad(row) {
      this.modificarCantidad(row, AFECTACION.SUMAR);
    },
    restarCantidad(row) {
      this.modificarCantidad(row, AFECTACION.RESTAR);
    },    
    modificarCantidad(row, afectacion) {
      if (this.cantidad == null || this.cantidad == 0) {
        this.$notificacion.warn("Escribe la Cantidad", "Escribe el Cantidad.");
        return;
      }

      let nuevaCantidad;

      if (afectacion == AFECTACION.SUMAR) {
        //nuevaCantidad = row.cantidad + this.cantidad;
        nuevaCantidad =  row.cantidad +1;
      }
      if (afectacion == AFECTACION.RESTAR) {
        //nuevaCantidad = row.cantidad - this.cantidad;
        nuevaCantidad = row.cantidad-1;
      }
      const nuevoImporte = Number(nuevaCantidad * row.precio);

      row.setCantidad(nuevaCantidad).setImporte(nuevoImporte);
      
      this.calcularTotal();
    },
    iniciarCobrar(){

    },
    calcularTotal() {
      let totalTemp = 0;
      let totalArticulosTemp = 0;

      for (let i = 0; i < this.listaDetalleVenta.length; i++) {
        const importe = this.listaDetalleVenta[i].importe;
        const cantidad = this.listaDetalleVenta[i].cantidad;
        totalTemp += importe;
        totalArticulosTemp += cantidad;
      }
      this.total = totalTemp;
      this.totalArticulos = totalArticulosTemp;
    }
  }
};

function removeItemArray(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
</script>

<style scoped>
.scroll-thead {
  width: 100%;
  display: inline-table;
}

.scroll-tbody-y {
  display: block;
  overflow-y: scroll;
}

.table-body {
  height: 500px /*fix height here*/;
}

.scroll {
  height: 500px;
  overflow-y: scroll;
}
</style>
