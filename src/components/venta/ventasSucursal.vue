<template>
  <div class="ventas">
  <h1>Ventas Sucursal</h1>   
  <small>{{usuarioSesion.nombre_sucursal}}</small> 
    <div class="card ">
      <div class="card-body pl-0 pr-0 ">
        
          <div class="form-group row">
            <label for="fecha" class="sr-only">Fecha</label>
             <div class="col-3">
              <datepicker
                name="fecha" 
                v-model="fecha"
                input-class="form-control"
                :bootstrap-styling="true"
                :language="es"            
                @selected="cambiarFecha"
                format="yyyy-MM-dd"
              ></datepicker>        
             </div>                            
              <button class="btn btn-primary" @click="cargarLista()">
               <div v-if="loader" class="spinner-border spinner-border-sm " role="status"/>                  
                Cargar
              </button>
          </div>
 

        <vue-good-table
          :columns="columnas"
          :rows="lista"          
          :isLoading="loader"
          :line-numbers="true"        
          :search-options="TABLE_CONFIG.SEARCH_OPTIONS"
          :pagination-options="TABLE_CONFIG.PAGINATION_OPTIONS"          
          :selectOptions="TABLE_CONFIG.NO_SELECT_OPTIONS"          
          class="table-striped text-xs"                    
          :groupOptions="{
  	          enabled: false,               
          }"
        >
        <div slot="table-actions">
        </div>
        <template slot="loadingContent">              
               <div  class="spinner-border text-info" role="status"/>              
        </template>
         <div slot="emptystate">
              Sin registros para mostrar
         </div>
          <template slot="table-header-row" slot-scope="props">
                <span v-if="props.row.id_estatus == 1" class="font-weight-bold text-info h5">{{ props.row.label }}</span>
                <span v-else class="font-weight-bold text-info h5">{{ props.row.label }}</span>
          </template>

          <template slot="table-row" slot-scope="props">            
            <span v-if="props.column.field == 'total'">              
                  <h4 v-if="props.row.id_estatus == 1">${{props.row.total}}</h4>                  
                  <h4 class="text-danger" v-else><del>${{props.row.total}}</del></h4>                  
            </span>

            <span v-else-if="props.column.field == 'recibido'">              
                  <span  v-if="props.row.id_estatus == 1">${{props.row.recibido}}</span>               
                  <span class="text-danger" v-else><del>${{props.row.recibido}}</del></span>                     
            </span>

            <span v-else-if="props.column.field == 'cambio'">              
                  <span  v-if="props.row.id_estatus == 1">${{props.row.cambio}}</span>                  
                  <span class="text-danger" v-else><del>${{props.row.cambio}}</del></span>                     
            </span>

            <span v-else-if="props.column.field == 'estatus'">              
                  <span v-if="props.row.id_estatus == 1" :class="` ${'badge  badge-success'}`">{{props.row.estatus}}</span>                  
                  <span v-else-if="props.row.id_estatus == 2" :class="` ${'badge  badge-warning'}`">{{props.row.estatus}}</span>                  
                  <span v-else-if="props.row.id_estatus == 3" :class="` ${'badge  badge-danger'}`">{{props.row.estatus}}</span>                  
                  <span v-else :class="`'badge  badge-secondary'}`">{{props.row.estatus}}</span>                  
            </span>

            <span v-else-if="props.column.field == 'acciones'">   
            <div v-if="props.row.id_estatus == 1" class="btn-group" role="group" aria-label="Basic example">                                      

                <button type="button" class="btn btn-link btn-sm text-warning">
                  <i class="fas fa-reply" title="Devolver venta" @click="iniciarCancelacionVenta(props.row)"></i>
                </button>                
                <button type="button" class="btn btn-link btn-sm text-primary" @click="imprimirTicket(props.row.id)">
                  <i class="fas fa-print" title="Reimprimir"></i>
                </button>
                <!--<button type="button" class="btn btn-link text-danger btn-sm">
                  <i class="fas fa-trash" title="Editar venta"></i>
                </button>-->
            </div>
            </span>                                           
            <span v-else>
                  <span  v-if="props.row.id_estatus == 1">{{props.formattedRow[props.column.field]}}</span>
                  <span  v-else class="text-danger" ><del> {{props.formattedRow[props.column.field]}}</del></span>
            </span>
          </template>
        </vue-good-table>
           
      </div>    
    </div>  

    <!-- popup para cancelar la venta -->
     <Popup id="popup_cancelar_venta" size="lg" :show_button_close="true">
      <div slot="header">
        Cancelar Venta {{ventaSeleccionada.folio}}
      </div>    

      <div slot="content" >        
      
        <div class="row">
          <div class="col-7 text-left">
           <div class="form-group">
            <label>Selecciona el movimiento</label>
              <select
                v-model="idEstatusSeleccionado"
                class="form-control"
                placeholder="Grupo"
                required
                autofocus
              >
              <option
                v-for="estatusItem in listaEstatus"
                v-bind:value="estatusItem.id"
                v-bind:key="estatusItem.id"
              >{{ estatusItem.nombre }}</option>
            </select>
          </div>

          <div v-if="idEstatusSeleccionado != idEstatusSeleccionadoAnterior"  class="form-group">
              <label>Motivo <span class="text-danger">*</span></label>
             <textarea v-model="motivo" placeholder="Escribe el motivo .." class="form-control border border-warning" rows="4">
              </textarea>
          </div>
          
          </div>          
          <div :class="`col-5 p-1  border border-light ${loaderTicketPreview && 'bg-light'}`"  :style="`height:500px;overflow-y:scroll;`">
              <div v-if="loaderTicketPreview" class="spinner-border text-info" role="status">
                  <span class="sr-only">Loading...</span>
              </div>
              <span v-html="htmlTicket"></span>

          </div>          
        </div>        
      </div>
      <div slot="footer">
        <button
          class="btn btn-danger"                              
          :disabled="(idEstatusSeleccionado == idEstatusSeleccionadoAnterior) || loaderConfirmacion"
           @click="confirmarCancelacion()"
        >
          <div v-if="loaderConfirmacion" class="spinner-border spinner-border-sm" role="status"/> Confirmar
        </button>
      </div>
    </Popup> 

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
import TABLE_CONFIG from "../../helpers/DatatableConfig";
import { VueGoodTable } from 'vue-good-table';

import Datepicker from 'vuejs-datepicker';


export default {
  name: "ventas-sucursal",
  components: {
    Popup,VueGoodTable, Datepicker
  },
  mixins: [operacionesApi],  
    data() {
    return {
      uidCurso: "",
      usuarioSesion: {},
      operacion: "",
      TABLE_CONFIG:TABLE_CONFIG,
      loaderConfirmacion:false,
      loader:false,
      loaderTicketPreview:false,
      idEstatusSeleccionado:-1,
      idEstatusSeleccionadoAnterior:-1,
      motivo:"",
      ventaSeleccionada:VeVenta,      
      htmlTicket:"",
      es: es,

      fecha:Date,
      lista:[],
      listaEstatus:[],
      columnas:[
      {
        label: 'Id',
        field: 'id',
        hidden: true
      },
      {
        label: 'Folio',
        field: 'folio',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center',
        hidden: false
      },      
      {
        label: 'Fecha',
        field: 'fecha',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center',
        hidden: false
      },
      {
        label: 'No. Art.',
        field: 'cantidad_articulos',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center',
        hidden: false
      },      
      {
        label: 'Recibido',
        field: 'recibido',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center',
        hidden: false
      },
      {
        label: 'Cambio',
        field: 'cambio',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center',
        hidden: false
      },
      {
        label: 'Nota',
        field: 'nota_venta',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center',
        hidden: false
      },
      {
        label: 'Total',
        field: 'total',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center',
        hidden: false
      },
      {
        label: 'Vendió',
        field: 'nombre_usuario',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center',
        hidden: false
      },            
      {
        label: 'Estado',
        field: 'estatus',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center',
        hidden: false
      },            
      {
        label: '',
        field: 'acciones',
        filterable: true,
        thClass: 'text-center',
        tdClass: 'text-left',
        hidden:false
      },
     
      ],
    };
  },
  mounted() {
    console.log("##### INCIAR LISTA DE VENTAS ####");
    this.usuarioSesion = getUsuarioSesion();    
    this.fecha = new Date();
    this.init();    
  },
  methods: {
    async init() {
        await this.cargarLista();
    }, 
    async iniciarCancelacionVenta(itemVenta){      
      
      console.log("iniciarCancelacionVenta");

    this.htmlTicket = "";

      if(this.listaEstatus.length == 0){
        console.log(`${URL.ESTATUS}`);
          this.listaEstatus = await this.getAsync(`${URL.ESTATUS}`);        
      }      

      //ir por la informacion de la venta
      //const ventaData = await this.getAsync(URL.VENTA + "/venta/" + id);
      this.ventaSeleccionada = Object.assign({},itemVenta);
      this.idEstatusSeleccionado = this.ventaSeleccionada.id_estatus;
      this.idEstatusSeleccionadoAnterior = this.ventaSeleccionada.id_estatus;
      
      if(this.ventaSeleccionada && this.ventaSeleccionada.id_estatus == 1){
          this.loaderTicketPreview=true;
          setTimeout(async() => {
            this.htmlTicket = await this.getAsync(URL.VENTA + "/ticket/" + this.ventaSeleccionada.id);  
            this.loaderTicketPreview=false;
          },800);
          
                      
          $("#popup_cancelar_venta").modal('show');
      }

    },
    async confirmarCancelacion(){
      this.loaderConfirmacion = true;

      if(this.idEstatusSeleccionadoAnterior == this.idEstatusSeleccionado){
          this.$notificacion.warn("Selecciona un movimiento","Selecciona un movimiento de la lista .");
          this.loaderConfirmacion = false;
          return;
      }

      if(this.idEstatusSeleccionadoAnterior != this.idEstatusSeleccionado && !this.motivo){
          this.$notificacion.warn("Escribe el motivo","Escribe el motivo.");
          this.loaderConfirmacion = false;
          return;
      }

     const data = await  this.putAsync(`${URL.VENTA}/cancelar`,  {
                    id_venta:this.ventaSeleccionada.id,
                    id_estatus:this.idEstatusSeleccionado,
                    motivo:this.motivo,
                    genero:this.usuarioSesion.id});
    
    if(data){

        $("#popup_cancelar_venta").modal('hide');
        await this.cargarLista();
    }   
    this.loaderConfirmacion = false;
    

    },
    async imprimirTicket(id) {
      console.log("@imprimir ticket "+id);
      const html = await this.getAsync(URL.VENTA + "/ticket/" + id);

      const WinPrint = window.open('', '', 'width=800,height=900');

      WinPrint.document.write(`
             <center>
              ${html}
              </center>
          `);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    },
    cambiarFecha(){
         this.$nextTick(async () => {
           
           await this.cargarLista();
         });        
    },
    async cargarLista(){
        this.loader =true;
        setTimeout(async()=>{
            this.lista = await this.putAsync(`${URL.VENTA}/sucursal/${this.usuarioSesion.co_sucursal}`,{fecha:this.fecha});        
             this.loader =false;
        },800);                
    },
    

  } // methods
   
};

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
