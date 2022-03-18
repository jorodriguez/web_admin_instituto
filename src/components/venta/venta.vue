<template>
  <span>  
  <!--
    <div class="row  mt-1 ">
      <div class="col col-12 col-md-6 col-sm-6 col-xl-6  d-flex align-items-start justify-content-start  text-left ">
        <div class="btn-group btn-group-lg" role="group" aria-label="...">
          <button @click="iniciarNuevaVenta()" class="btn btn-light btn-lg" href="#">
            Nueva
          </button>
          <button @click="iniciarBuscarProducto()" class="btn btn-light btn-lg" href="#">
            Buscar
          </button>
          <button @click="iniciarCobrar()" class="btn btn-light btn-lg" href="#">
            Cobrar
          </button>
        </div>
      </div>
      <div class="col col-12 col-md-6 col-sm-6 col-xl-6 ">
        <div class="row ">          
          <div
            class="col-12 col-md-6 col-sm-6 col-xl-6  d-flex align-items-end  justify-content-end text-right"
          >
            <h1>Total</h1>
          </div>
          <div class="col-12 col-md-6 col-sm-12 col-xs-12 col-xl-6 rounded text-left">            
            <input
              type="text"
              class="form-control form-control-lg bg-dark"
              :value="`$${formatPrice(total)}`"
              style="color:#fff;font-size:25px"
              disabled
            />
          </div>
        </div>
      </div>
    </div>
    -->

    <div class="row  ">   

      <!-- Carrito de venta -->
      <div class="col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7  ">
      
        <div class="card-body bg-white p-0">
          <div>
            <small v-if="mensajeCodigo" class="text-danger">{{
              mensajeCodigo
            }}</small>
            <!-- Si funciona la busqueda por codigo
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
                  disabled
                />
              </div>
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-default">
                  <i
                    :class="`fas fa-barcode ${loaderCodigo ? 'text-red' : ''}`"
                  ></i>                  
                </span>
              </div>
              <input
                type="text"
                class="form-control font-weight-bold"
                ref="input_buscar_codigo"
                aria-label="Default"
                placeholder="Código"
                :readonly="loaderCodigo"
                v-model="codigo"
                @keyup.enter="buscarCodigo()"
                aria-describedby="inputGroup-sizing-default"
                autofocus
              />
            </div>
            -->
          </div>
            <div
                class="row border border-gray pt-1 m-0 bg-secondary  "
              >              
                <div class="col-12 col-sm-12 col-md-12 col-lg-1 col-xl-1 ">
                  
                </div>
                <div class="text-left col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 ">
                  <h4> Articulo </h4>                                    
                </div>
                <div class="text-left col-12 col-sm-12 col-md-12 col-lg-2 col-xl-2 d-flex align-items-center align-self-center justify-content-center  ">
                  <h4>Cant.</h4>
                </div>
                <div
                  class="text-left col-12 col-sm-12 col-md-12 col-lg-2 col-xl-2  d-flex align-items-center align-self-center justify-content-center  "
                >
                  <span class="h4">Precio</span>
                </div>
                <div
                  class="text-left col-12 col-sm-12 col-md-12 col-lg-1 col-xl-1  d-flex align-items-center align-self-center justify-content-center "
                >
                  <span class="h4">Importe</span>
                </div>
              </div>
          <div class="card-body pl-0 pr-0 pt-0 " :style="`height:${screenHeight-460}px;overflow-y:scroll;`">
          
          

            <!-- Lista del carrito de vent--->
            <span
              v-for="(detalle, index) in listaDetalleVenta"
              :key="detalle.id"
            >
              <div
                :class="`row m-0  border-bottom border-gray pt-1 pb-1 ${index % 2 != 0 && 'bg-pink'}`"
              >              
                <div class="col-12 col-sm-12 col-md-12 col-lg-1 col-xl-1 ">
                  <img
                    v-if="detalle.foto"
                    alt
                    :src="detalle.foto"
                    class="pointer mr-3 "
                    width="50"
                  />
                  <div
                    v-else
                    alt
                    class="pointer border border-gray mr-3 bg-light"
                    height="60"
                  />
                  <h5 class="text-center btn pointer" @click="confirmEliminarDetalle(detalle)"><i class="fas fa-trash text-danger pt-1 " /></h5>
                </div>
                <div class="text-left col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6  ">
                  <h4>
                    {{ detalle.articulo }}
                  </h4>
                  <small class="font-weight-normal text-wrap">{{
                    detalle.descripcion
                  }}</small>
                  <h5>{{ detalle.marca }}</h5>
                  <small> {{ detalle.unidad_medida }}</small>
                </div>
                <div class="text-left col-12 col-sm-12 col-md-12 col-lg-2 col-xl-2 d-flex align-items-center align-self-center justify-content-center">
                  <i
                    :class="
                      `fas fa-minus pointer ${detalle.cantidad == 1 &&
                        'text-gray'}`
                    "
                    @click="
                      () => {
                        if (detalle.cantidad > 1) restarCantidad(detalle);
                      }
                    "
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
                    oninput="validity.valid||(value='');"
                    v-on:keyup.enter="recalcularPorEnter(detalle)"
                    @change="() => recalcularPorEnter(detalle)"
                  />
                  <i
                    class="fas fa-plus pointer"
                    @click="sumarCantidad(detalle)"
                  />
                </div>
                <div
                  class="text-left col-12 col-sm-12 col-md-12 col-lg-2 col-xl-2  d-flex align-items-center align-self-center justify-content-center "
                >
                  <span class="h3">${{ formatPrice(detalle.precio) }}</span>
                </div>
                <div
                  class="text-left col-12 col-sm-12 col-md-12 col-lg-1 col-xl-1  d-flex align-items-center align-self-center justify-content-center "
                >
                  <span class="h3">${{ formatPrice(detalle.importe) }}</span>
                </div>
              </div>
            </span>
          </div>
          <div class="card-footer  border-top  border-light ">
            <div class="row">
              <div class="col-8 border-right border-success ">
              </div>
              <div class="col-4">
              Total <h1>${{formatPrice(total)}}</h1>           
              <button @click="iniciarCobrar()" class="btn btn-success btn-block" href="#">
                Cobrar
              </button>
              </div>
            </div>            
          </div>
        </div>
        </div>
        <!-- Fin de carrito de ventas -->
        
         <!-- Catalogo de productos -->          
          <div class="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 p-1 bg-secondary">
            <div class="card  bg-secondary" >                                                 
                <div class="input-group ">
                      <input type="text" v-model="criterioNombre" v-on:keyup.enter="buscarPorCriterioNombreCarrito()" class="form-control " placeholder="Buscar por nombre.."  aria-describedby="button-addon2">
                      <div class="input-group-append">
                           <button class="btn btn-secondary " @click="buscarPorCriterioNombreCarrito()" type="button" id="button-addon2">
                           <i class="fas fa-search"></i>
                           </button>
                         <!--<button class="btn btn-secondary  btn" @click="buscarPorCriterioNombreCarrito()" type="button" id="button-addon2" title="Agregar un producto nuevo">
                           <i class="fas fa-plus text-primary"></i>
                        </button>-->
                </div>
                </div>
                
              <div class="pt-1 d-sm-none d-lg-block">                            
                <div class="btn-group " >
                 <button @click="cargarCatalogo()" type="button" class="btn bg-pink ">
                  Todos
                 </button>
                 <button type="button" :class="`btn bg-pink `"
                       v-for="categoria in categoriaArticulos"
                      :key="categoria.cat_categoria"
                      @click="filtrarArticulosPorCategoria(categoria)"
                      >
                    {{categoria.categoria}} 
                    <span class="badge badge-pill badge-light ">{{categoria.numero_articulos}}</span>
                 </button>                   
                </div>                
              </div>              
              <small class="text-sm text-muted align-middle">{{categoriaSeleccionada && categoriaSeleccionada.categoria}}</small>
              
              <div class="card-body pt-0" :style="`height:${screenHeight-(screenHeight/2.7)}px;overflow-y:scroll;`"  >                            

                <span class="text-sm text-warning" v-if="mensajeBusquedaProducto">{{mensajeBusquedaProducto}}</span>

                <span v-if="loaderCatalogo" class="spinner-border spinner-border text-primary" role="status" aria-hidden="true"></span>
   
            <!-- class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-4 m-0 p-1 card-group "                    -->
                <div class="row">
                  <div
                   class="col-12 col-sm-4 col-md-2 col-lg-6 col-xl-3 mt-1 p-1"                    
                   v-for="producto in catalogoArticulos"
                    :key="producto.id"
                  >
                    <div class="card border-light bg-white  "                     
                      @click="agregarProductoBusqueda(producto)">                                        
                      <div class=" d-flex justify-content-end mt-1 mr-1" :title="`${producto.nombre}  `">                        
                         <span class="badge badge-secondary">${{ formatPrice(producto.precio) }}</span>
                      </div>
                      <div class="card-body p-0">
                      <img
                        v-if="producto.foto"
                        class="img-fluid  mx-auto"
                        style="width:100px;min-height:70px;height:90px"
                        :src="producto.foto"
                        alt="Foto"
                        :title="`${producto.nombre}  `"
                      />
                      
                      <div
                       v-else
                        class="img-thumbnail   mx-auto"
                        style="width:100px;min-height:70px;height:90px"
                        alt="Foto"                        
                        :title="`${producto.nombre}  `"
                      />
                      </div>
                      <!--<small style="font-size:10px;" class="text-muted m-0" >{{producto.codigo}}</small>-->
                      <div class="card-body p-1">
                        <h4 class="card-title m-0 text-truncate  pb-0 " :title="`${producto.nombre}  `">
                         <span class="text-sm "> {{ producto.nombre }}</span>
                        </h4>
                        <!--<p class="card-text text-xs pt-0 m-0 small text-truncate  ">
                           {{ producto.descripcion }}
                        </p>   -->                     
                      </div>
                      <!--<div class="card-footer p-0 mb-0">
                          <span class="text-muted  text-xs">{{producto.categoria}} | {{producto.marca}} </span>                      
                      </div>-->
                    </div>
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
                  ref="input_buscar_producto"
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
                      <td class="p-0 m-0 col-12 col-sm-12 col-md-12 col-lg-1 col-xl-1 ">
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
                      <td class="text-left m-0 p-0 text-left col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7 ">
                        <h4 class="text-wrap">
                          {{ prod.nombre }}
                        </h4>
                        <small class="font-weight-normal text-wrap">{{
                          prod.descripcion
                        }}</small>
                        <h5>{{ prod.marca }}</h5>
                      </td>
                      <td class="m-0 h2 col-12 col-sm-12 col-md-12 col-lg-1 col-xl-1 d-flex align-items-center align-self-center justify-content-center">
                        <h2>${{ formatPrice(prod.precio) }}</h2>
                      </td>
                      <td class="m-0 pointer col-12 col-sm-12 col-md-12 col-lg-1 col-xl-1" @click="agregarProductoBusqueda(prod)">
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
              @click="cerrarPopupYFocusBuscarCodigo()"
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
      id="popup_cobrar"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="myLargeModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <div class="card-body border  ">
              <div class="row d-flex align-items-center">
                <div class="col col-sm-4 text-left h2">Total</div>
                <div class="col">
                  <input
                    type="text"
                    class="form-control form-control-lg bg-dark text-white"
                    style="color:#fff;font-size:30px"
                    :value="`$${formatPrice(total)}`"
                    disabled
                  />
                </div>
              </div>
              <div class="row d-flex align-items-center">
                <div class="col col-sm-4  text-left h2">Recibe</div>
                <div class="col">
                  <input
                    id="input_recibe"
                    name="input_recibe"
                    ref="input_recibe"
                    type="number"
                    class="form-control form-control-lg"
                    style="color:#CF0476;font-size:30px"
                    v-model="recibe"
                    @keyup.enter="cobrar()"
                    :disabled="loaderCobro"
                    autofocus
                  />
                </div>
              </div>
              <div class="row d-flex align-items-center">
                <div class="col col-sm-4 text-left  h2">Cambio</div>
                <div class="col">
                  <input
                    type="text"
                    class="form-control form-control-lg "
                    style="font-size:30px"
                    :value="`$${formatPrice(cambio)}`"
                    disabled
                  />
                </div>
              </div>
            </div>
            <span v-if="mensajeCobro" class="text-danger">{{
              mensajeCobro
            }}</span>
            <span v-if="activarBotonCobro" class="text-primary"
              >Oprime enter de nuevo para seguir</span
            >
          </div>
          <div class="modal-footer mx-auto">
            <button
              type="button"
              class="btn btn-success btn-xl"
              data-dismiss="modal"
              :disabled="!activarBotonCobro || loaderCobro"
            >
              <span
                v-if="loaderCobro"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              Cobrar
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
              @click="cerrarPopupYFocusBuscarCodigo()"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- fuin buscar producto-->
  </span>
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
      categoriaArticulos:[],
      articulosEncontradosCriterio: [],
      es: es,
      loader: false,
      loaderBuscar: false,
      loaderCodigo: false,
      loaderCatalogo: false,
      loaderCobro: false,
      mensajeCodigo: "",
      mensajeCobro: "",
      criterioNombre: "",
      recibe: 0,
      cambio: 0,
      formatPrice: formatPrice,
      countEnterCobro: 0,
      activarBotonCobro: false,
      categoriaSeleccionada:{id:-1,categoria:"Todos"},
      screenHeight:0
    };
  },
  mounted() {
    console.log("##### INCIAR VENTA ####");
    this.usuarioSesion = getUsuarioSesion();
    this.$root.mostrarSidebar = false;
    this.init();
    this.ajustarAltoPantalla();
    /*window.addEventListener("keypress", e => {
      console.log("presiono tecla"+e);      
      
    });*/
  },
  methods: {
    async init() {
      //--inciando venta
      this.venta = new VeVenta();
      this.ventaDetalle = new VeVentaDetalle();
      await this.cargarCatalogo();
      await this.cargarCategorias();
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
    async buscarPorCriterioNombreCarrito(){
      this.mensajeBusquedaProducto = "";      
      if(!this.criterioNombre){
        this.$notificacion.warn("Escribe un nombre","Escribe un nombre o una parte del nombre del articulo");
        return;
      }
      this.loaderCatalogo = true;      
      this.catalogoArticulos = await this.getAsync(
        `${URL.ARTICULO}/nombre/${this.criterioNombre}/${
          this.usuarioSesion.co_sucursal
        }`
      );

      if(this.catalogoArticulos == null || this.catalogoArticulos.length == 0){
         this.mensajeBusquedaProducto = `Ningún producto conincide con '${this.criterioNombre}'..`;
      }
      this.loaderCatalogo = false;

    },
    async filtrarArticulosPorCategoria(categoria){
      this.categoriaSeleccionada = categoria;
      console.log(" Categoria seleccionada "+JSON.stringify(this.categoriaSeleccionada));
      this.mensajeBusquedaProducto = "";
      this.criterioNombre = "";      
      if(!this.categoriaSeleccionada){

        return;
      }      
      this.loaderCatalogo = true;
      console.log("@c@@@@argarCatalogo por categoria");
      console.log(`${URL.ARTICULO}/sucursal/${this.usuarioSesion.co_sucursal}`);
      this.catalogoArticulos = await this.getAsync(
        `${URL.ARTICULO}/categoria/${categoria.cat_categoria}/${this.usuarioSesion.co_sucursal}`
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
      this.categoriaSeleccionada = {id:-1,categoria:"Todos"};
      this.loaderCatalogo = false;
    },
    iniciarBuscarProducto() {
      this.criterioNombre = "";
      this.articulosEncontradosCriterio = [];
      $("#buscar-producto").modal("show");
      setTimeout(x => {
        this.$nextTick(() => this.setFocusBuscar());
      }, 500);
    },
    iniciarNuevaVenta() {
      this.venta = new VeVenta();
      this.ventaDetalle = new VeVentaDetalle();
      this.listaDetalleVenta = [];
      this.mensajeCobro = "";
      this.cambio = 0;
      this.total = 0;
      this.countEnterCobro = 0;
      this.activarBotonCobro = false;
    },
    async buscarPorCriterioNombre() {
      console.log("buscar por criterio " + this.criterioNombre);
      
      if(!this.criterioNombre){
        this.$notificacion.warn("Escribe un nombre","Escribe un nombre o una parte del nombre del articulo");
        return;
      }
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
      console.log("SELECCION"+JSON.stringify(item));
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
          "Escribe el código ."
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
        .setUnidadMedida(producto.unidad_medida)
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
    recalcularPorEnter(detalle) {
      console.log("recalcular por enter");
      if (detalle.cantidad <= 0) {
        detalle.cantidad = 1;
      }

      const nuevoImporte = Number(detalle.cantidad * detalle.precio);

      detalle.setImporte(nuevoImporte);
      this.calcularTotal();
    },
    eliminarDetalleCarrito(item) {
      this.listaDetalleVenta = removeItemArray(this.listaDetalleVenta, item);
      this.calcularTotal();
    },
    sumarCantidad(row) {
      this.modificarCantidad(row, AFECTACION.SUMAR);
    },
    restarCantidad(row) {
      this.modificarCantidad(row, AFECTACION.RESTAR);
    },
    modificarCantidad(row, afectacion) {
      if (row.cantidad == null || row.cantidad <= 0) {
        row.cantidad = 1;
        this.$notificacion.warn("Escribe la Cantidad", "Escribe el Cantidad.");
        return;
      }

      let nuevaCantidad;

      if (afectacion == AFECTACION.SUMAR) {
        //nuevaCantidad = row.cantidad + this.cantidad;
        nuevaCantidad = row.cantidad + 1;
      }
      if (afectacion == AFECTACION.RESTAR) {
        //nuevaCantidad = row.cantidad - this.cantidad;
        nuevaCantidad = row.cantidad - 1;
      }
      const nuevoImporte = Number(nuevaCantidad * row.precio);

      row.setCantidad(nuevaCantidad).setImporte(nuevoImporte);

      this.calcularTotal();
    },
    setFocusRecibe() {
      this.$refs.input_recibe.focus();
    },
    setFocusBuscar() {
      this.$refs.input_buscar_producto.focus();
    },
    setFocusBuscarCodigo() {
      this.$refs.input_buscar_codigo.focus();
    },
    cerrarPopupYFocusBuscarCodigo() {
      setTimeout(x => {
        this.$nextTick(() => this.setFocusBuscarCodigo());
      }, 500);
    },
    confirmEliminarDetalle(detalle){
       if (confirm(`¿Esta seguro de quitar el articulo ${detalle.articulo}?`) == true){  
           this.eliminarDetalleCarrito(detalle);
      } else { text = "You canceled!"; }
    },
    iniciarCobrar() {
      this.mensajeCobro = "";
      this.cambio = 0;
      this.countEnterCobro = 0;
      this.activarBotonCobro = false;

      const procedeCobro =
        this.listaDetalleVenta.length > 0 &&
        this.total > 0 &&
        this.totalArticulos > 0;

      if (procedeCobro) {
        /*$('#popup_cobrar').on('show.bs.modal', function (event) {        
        let modal = $(this)                  
          $('#input_recibe').focus()
      });*/

        this.recibe = undefined;
        $("#popup_cobrar").modal("show");

        setTimeout(x => {
          this.$nextTick(() => this.setFocusRecibe());
        }, 700);
      } else {
        this.$notificacion.warn("Selecciona productos", "");
      }
    },
    async cobrar() {
      this.mensajeCobro = "";

      if (!this.recibe) {
        this.mensajeCobro = `Escribe la cantidad recibida.`;
        return;
      }

      //verificar lo recibido sea mayor al total
      if (this.recibe < this.total) {
        this.mensajeCobro = `Lo recibido debe ser mayor a ${formatPrice(
          this.total
        )}`;
        return;
      }

      this.cambio = this.recibe - this.total;

      if (this.countEnterCobro > 1) {
        //confirmo el primer enter
        this.mensajeCobrar = "Espere...";
        this.loaderCobro = true;

        //proceder a guardar el pago
        const venta = new VeVenta();
        venta
          .setTotal(this.total)
          .setCantidadArticulos(this.totalArticulos)
          .setRecibido(this.recibe)
          .setCoSucursal(this.usuarioSesion.co_sucursal)
          .setCoEmpresa(this.usuarioSesion.id_empresa)
          .setCambio(this.cambio)
          .setNotaVenta("")
          .setCatCliente(1)
          .setGenero(this.usuarioSesion.id)
          .buildForInsert();

        const data = {
          venta: venta,
          detalleVenta: this.listaDetalleVenta,
          co_empresa: this.usuarioSesion.id_empresa,
          co_sucursal: this.usuarioSesion.co_sucursal,
          genero: this.usuarioSesion.id
        };

        const ventaGuardada = await this.postAsync(`${URL.VENTA}`, data);
        console.log(ventaGuardada);
        if (ventaGuardada.error) {
          this.mensajeCobro = `Ups¡ existió un error al guardar la venta, ponte en contacto con el equipo de soporte.`;
          this.loaderCobro = true;
        } else {
          this.mensajeCobrar = "Venta realizada";
          $("#popup_cobrar").modal("hide");
          this.iniciarNuevaVenta();
          this.loaderCobro = false;
          this.cerrarPopupYFocusBuscarCodigo();

          //consultar ticker
          const { venta } = ventaGuardada;
          await this.imprimirTicket(venta.id);
        }
      }

      this.countEnterCobro++;
      this.activarBotonCobro = true;
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
    },
    async imprimirTicket(id) {
      console.log("@imprimir ticket " + id);
      const html = await this.getAsync(URL.VENTA + "/ticket/" + id);

      const WinPrint = window.open("", "", "width=800,height=900");

      WinPrint.document.write(`
             <center>
              ${html}
              </center>
          `);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    }
    ,
    ajustarAltoPantalla(){
      this.screenHeight = screen.height;
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
  height: 600px;
  overflow-y: scroll;
}

.scroll-productos {
  height: 700px;
  overflow-y: scroll;
}
</style>
