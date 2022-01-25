<template>
  <span id="corte-dia" >   
   <h1>Cierres por día </h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small> 
    
    <div class="card">
      <div class="card-body">
        <div v-if="mensaje" class="alert alert-warning">{{mensaje}}</div>
        <div v-if="loading" class="h4">
          <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
            <span class="sr-only">Cargando...</span>
          </div>
        </div>
        
         <div class="row justify-content-between">
          <div class="col-3 h4 text-left">
             Fecha
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
          <div class="col-3 text-right">
                <button :disabled="loading" @click="imprimir()" class="btn btn-outline-primary"><i class="fas fa-print"></i> Imprimir</button>
          </div>      
         </div>
 
          <div class="row justify-content-between border border-light border-top-0 border-left-0 border-right-0  border-bottom-2 ">
          <div class="col-3 h4 text-left">
             <h2 class="mb-0">Ingreso</h2>                          
          </div>
          <div class="col-3 border border-primary border-top-0 border-left-0 border-right-0  border-bottom-2  ">           
                  <h2 class="mt-0 mb-1 "> ${{corte ? formatPrice(corte.totalIngreso) : ''}}</h2>                                       
          </div>
         </div>

        <div class="collapse" id="collapseExample">
        <vue-good-table
          :columns="columnas"
          :rows="lista"
          :line-numbers="true"
          @on-row-click="onRowClick"
          @on-search="onSearch"
          :search-options="TABLE_CONFIG.SEARCH_OPTIONS"
          :pagination-options="TABLE_CONFIG.PAGINATION_OPTIONS"
          @on-selected-rows-change="selectionChanged"
          :selectOptions="TABLE_CONFIG.NO_SELECT_OPTIONS"
          @on-select-all="selectAll"
          class="table-striped"
          :groupOptions="{
  	          enabled: false,               
          }"
        >
          <template slot="table-header-row" slot-scope="props">
            <span class="font-weight-bold text-info h5">{{ props.row.label }}</span>
          </template>

          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'foto'">
              <img :src="props.row.foto" alt class="rounded-circle" width="50" height="50" />
            </span>            
            <span v-else-if="props.column.field == 'nombre_cargo'" class="text-left">
              <span>
                <p class="mb-0 border-bottom-0">{{props.row.nombre_cargo}}</p>
                <p class="text-muted mb-0 border-bottom-0 small">{{props.row.materia}}</p>                
                <p class="text-muted mb-0 border-bottom-0 small">{{props.row.especialidad}}</p>               
              </span>
            </span>
            <span v-else-if="props.column.field == 'pago'" class="text-left">
              <span>
                <p class="mb-0 border-bottom-0 font-weight-bold">${{formatPrice(props.row.pago)}}</p>                
              </span>
            </span>
            <span v-else-if="props.column.field == 'alumno'">
              <span>
                <p class="mb-0 border-bottom-0">{{props.row.alumno}}</p>
                <small class="text-muted mt-0 b-0">{{props.row.apellidos}}</small>                
              </span>
            </span>            
                      
            <span v-else>{{props.formattedRow[props.column.field]}}</span>
          </template>
        </vue-good-table>
        </div>
         <a class="pointer text-primary text-sm" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                  <small>({{lista.length}}) Ingresos</small>
              </a>

<!--        <div class="row justify-content-end">   
          <div class="col-2 text-right">-->
              <!--<download-excel
                v-if="corte"
                class="btn btn-link "
                :data="lista"
                :fields="columnasFiltradas"
                :worksheet="nombre_libro"
                :name="nombre_reporte+'.xls'"
              >
                <i class="fas fa-download" /> XLS
              </download-excel>        -->
          <!--</div>
          <div class="col-3 light border border-primary border-top-0 border-left-0 border-right-0  border-bottom-2">           
            <div class="media">
                <div class="media-body">
                  <h2 class="mt-0 mb-1">${{corte ? formatPrice(corte.totalIngreso) : ''}}</h2>                                    
                </div>  
            </div>           
          </div>
         </div>
        <br/>
        -->
        
          <div class="row justify-content-between border border-light border-top-0 border-left-0 border-right-0  border-bottom-2">
          <div class="col-3 h4 text-left">
             <h2>Gasto</h2>                               
          </div>
          <div class="col-3 border border-danger border-top-0 border-left-0 border-right-0  border-bottom-2 ">
           
                  <h2 class="mt-0 mb-1"> ${{corte ? formatPrice(corte.totalGasto) : ''}}</h2>                  
           
          </div>
         </div>

       <div class="collapse" id="collapseGastos">
        <vue-good-table
          :columns="columnasGasto"
          :rows="listaGastos"
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
            <span v-if="props.column.field == 'observaciones'">
              <textarea class="form-control" disabled v-model="props.row.observaciones">

              </textarea>
            </span>            
            <span v-else>{{props.formattedRow[props.column.field]}}</span>
          </template>
        </vue-good-table>           
       </div>

        <a class="pointer text-primary text-sm text-left" data-toggle="collapse" href="#collapseGastos" role="button" aria-expanded="false" aria-controls="collapseExample">
                  <small>({{listaGastos.length}}) Gastos </small>
        </a> 
        

         <br/>
          <div class="row justify-content-between">
          <div class="col-3 h4 text-left">
             <h1>Total</h1>             
          </div>
          <div :class="`col-3 border  border-top-0 border-left-0 border-right-0  border-bottom-2 ${(corte.totalIngreso - corte.totalGasto) <= 0 ? ' border-danger':' border-success'}`">
            
                  <h1 :class="`mt-0 mb-1 ${(corte.totalIngreso - corte.totalGasto) <= 0 ? ' text-danger':' text-primary'} `"> ${{corte ? formatPrice(corte.totalIngreso - corte.totalGasto) : ''}}</h1>                  
            
          </div>
         </div>
       
      </div>
    </div>
  </span>
</template>

<script >

import Vue from "vue";
import { operacionesApi } from "../../helpers/OperacionesApi";
import URL from "../../helpers/Urls";
import { VueGoodTable } from 'vue-good-table';
import Datepicker from 'vuejs-datepicker';
import { en, es } from "vuejs-datepicker/dist/locale";
import TABLE_CONFIG from "../../helpers/DatatableConfig";
import {getUsuarioSesion} from '../../helpers/Sesion';
import {formatPrice} from '../../helpers/Utils';
import moment from 'moment';

export default {
  name: "corte-dia",
  components: {
    Datepicker,VueGoodTable
  },
  mixins:[operacionesApi],
  data() {
    return {      
      usuarioSesion: {},
     // sesion: {}, 
      fecha:Date,
      lista: [],                                    
      listaGastos: [],                                    
      corte:undefined,  
      corteGasto:undefined,
      alumno_seleccionado:{},
      columnas:[
      {
        label: 'Id',
        field: 'co_pago_cargo_balance_alumno',
        hidden: true
      },
      {
        label: 'Folio',
        field: 'folio',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center',
      },
      {
        label: 'Alumno',
        field: 'alumno',
        filterable: true,
        thClass: 'text-center',
        tdClass: 'text-left',
      },
      {
        label: 'Sem.',
        field: 'numero_semana_curso', 
        thClass: 'text-center',
        tdClass: 'text-center',
        filterable: false,
        hidden:false
      },
        {
        label: 'Horario',
        field: 'horario',                
        thClass: 'text-center',
        tdClass: 'text-center',        
      },
                     
      {
        label: 'Fecha',
        field: 'fecha',
        hidden: false
      },      
      {
        label: 'Apellidos',
        field: 'apellidos',
        filterable: true,
        thClass: 'text-center',
        tdClass: 'text-center',
        hidden: true
      },
      {
        label: 'Nota',
        field: 'nota',
        hidden: true
      },
      {
        label: 'Forma',
        field: 'forma_pago',        
        thClass: 'text-center',
        tdClass: 'text-center',        
        hidden:true
        
      },
      {
        label: 'Taller',
        field: 'especialidad',                
        thClass: 'text-left',
        tdClass: 'text-left',
        filterable: false,        
        hidden:true
      },    
      
      {
        label: 'Concepto',
        field: 'nombre_cargo', 
        thClass: 'text-left',
        tdClass: 'text-left',
        filterable: false,
        hidden:false
      },
      {
        label: 'Materia',
        field: 'materia',                
        thClass: 'text-center',
        tdClass: 'text-center',        
        hidden:true
      },
      {
        label: 'Adeudo Total',
        field: 'total_adeudo',                
        thClass: 'text-center',
        tdClass: 'text-center',
        filterable: true,
        hidden:true
      },
       {
        label: 'Pago',
        field: 'pago',
        hidden: false
      },
      
],
 columnasGasto:[
      {
        label: 'id',
        field: 'id',
        hidden:true
      },
      {
        label: 'Fecha',
        field: 'fecha_text'        
      },
      {
        label: 'Gasto',
        field: 'nombre_tipo_gasto',
        hidden: true
      },
      {
        label: 'Forma pago',
        field: 'nombre_tipo_gasto',
        hidden: true
      },
      {
        label: 'Gasto',
        field: 'gasto',
        hidden: false
      },
      {
        label: 'Observaciones',
        field: 'observaciones',
        hidden: false
      },
      ],
      TABLE_CONFIG:TABLE_CONFIG,
      es: es,
      mensaje: "",
      formatPrice:formatPrice,
      loading:Boolean,      
      nombre_reporte: "corte.xls",
      nombre_libro: "libro1",
      columnasFiltradas:{},
      columnsExport: {
        folio:"folio",
        alumno: "alumno",
        apellidos:"apellidos",                            
        numero_semana_curso:"sem",                    
        horario:"horario",        
        fecha:"fecha",    
        nombre_cargo:"concepto",                  
        pago:"pago",              
        total_adeuda:"total_adeuda"        
      },
    };
  },
  mounted() {
    console.log("====iniciando el componente reporte de corte diario ===");
    
    this.usuarioSesion = getUsuarioSesion();
    this.fecha = new Date();
    this.TABLE_CONFIG.PAGINATION_OPTIONS.perPage = 50;   
    this.columnasFiltradas = this.columnsExport;
    this.init();    
  },
  methods: {
    init(){
      this.nombre_reporte = `Corte del día ${this.fecha}`;
      this.nombre_libro = `Corte `;     
      this.loadFunction();
    },
    async loadFunction(){            
       this.loading = true;
       console.log(URL.REPORTES_BASE +'/corte/dia/sucursal/'+this.usuarioSesion.co_sucursal);
       this.corte =  await this.putAsync(URL.REPORTES_BASE +'/corte/dia/sucursal/'+this.usuarioSesion.co_sucursal,
       { fecha:this.fecha,id_usuario:this.usuarioSesion.id });
       this.lista = this.corte.detalleIngreso;
       this.listaGastos = this.corte.detalleGasto;
       
       this.loading = false;
    },
    async imprimir() {
      const html =  await this.putAsync(URL.REPORTES_BASE +'/corte/dia/sucursal/imprimir/'+this.usuarioSesion.co_sucursal,
            { fecha:this.fecha,id_usuario:this.usuarioSesion.id });

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
         this.$nextTick(() => {
           console.log(this.fecha)
           this.loadFunction();
         });        
    },
    customFormatter(date) {
      return moment(date).format('yyyy-MM-dd');
    },
    onRowClick(params) {
      console.log(JSON.stringify(params));      
      
    },
    onSearch(params) {
      console.log(JSON.stringify(params));      
    },
    selectAll(selected, selectedRows) {
      
    },
    selectionChanged(params) {
      this.rowSelection = params.selectedRows;
      console.log("Seleccion");      
    },
  }   
};

</script>
