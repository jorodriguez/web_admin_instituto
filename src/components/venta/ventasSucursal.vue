<template>
  <div class="ventas">
    <div class="card ">
      <div class="card-body  ">
        
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
              <button class="btn btn-primary" @change="cargarLista()">Cargar</button>
          </div>
        

        <vue-good-table
          :columns="columnas"
          :rows="lista"
          :line-numbers="true"        
          :search-options="TABLE_CONFIG.SEARCH_OPTIONS"
          :pagination-options="TABLE_CONFIG.PAGINATION_OPTIONS"          
          :selectOptions="TABLE_CONFIG.NO_SELECT_OPTIONS"          
          class="table-striped"
          :groupOptions="{
  	          enabled: false,               
          }"
        >
          <template slot="table-header-row" slot-scope="props">
            <span class="font-weight-bold text-info h5">{{ props.row.label }}</span>
          </template>

          <template slot="table-row" slot-scope="props">            
            <span v-if="props.column.field == 'total'">              
                  <h4>${{props.row.total}}</h4>                  
            </span>

            <span v-else-if="props.column.field == 'recibido'">              
                  <span>${{props.row.recibido}}</span>                  
            </span>

            <span v-else-if="props.column.field == 'cambio'">              
                  <span>${{props.row.cambio}}</span>                  
            </span>
            <span v-else-if="props.column.field == 'estatus'">              
                  <span :class="` ${props.row.id_estatus == 1 ? 'badge  badge-success':'badge  badge-secondary'}`">{{props.row.estatus}}</span>                  
            </span>

            <span v-else-if="props.column.field == 'acciones'">   
            <div class="btn-group" role="group" aria-label="Basic example">         
                <button type="button" class="btn btn-link btn-sm text-warning">
                  <i class="fas fa-reply" title="Devolver venta" @click="iniciarCancelacionVenta(props.row)"></i>
                </button>                
                <button type="button" class="btn btn-link btn-sm text-primary" @click="imprimirTicket(props.row.id)">
                  <i class="fas fa-print" title="Reimprimir"></i>
                </button>
                <button type="button" class="btn btn-link text-danger btn-sm">
                  <i class="fas fa-trash" title="Editar venta"></i>
                </button>
            </div>
            </span>                                           
            <span v-else>{{props.formattedRow[props.column.field]}}</span>
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
          <div class="col-8">
           <div class="form-group">
        <label>Actividad</label>
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
          
          </div>          
          <div class="col-4 p-1 border border-light "  :style="`height:500px;overflow-y:scroll;`">
              <span v-html="htmlTicket"></span>
          </div>          
        </div>        
      </div>
      <div slot="footer">
        <button
          class="btn btn-danger"                              
        >
          Confirmar
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
      loader:false,
      idEstatusSeleccionado:-1,
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

      if(this.listaEstatus.length == 0){
          this.listaEstatus = await this.getAsync(`${URL.ESTATUS}`);        
      }      

      //ir por la informacion de la venta
      //const ventaData = await this.getAsync(URL.VENTA + "/venta/" + id);
      const ventaSeleccionada = Object.assign({},itemVenta);
      
      if(ventaSeleccionada && ventaSeleccionada.id_estatus == 1){
          
          this.htmlTicket = await this.getAsync(URL.VENTA + "/ticket/" + ventaSeleccionada.id);
                      
          $("#popup_cancelar_venta").modal('show');
      }

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
        this.lista = await this.putAsync(`${URL.VENTA}/sucursal/${this.usuarioSesion.co_sucursal}`,{fecha:this.fecha});        
        console.log("this.lista");
        console.log(this.lista);
        this.loader =false;
    }
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
