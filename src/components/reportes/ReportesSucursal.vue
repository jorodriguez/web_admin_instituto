<template>
  <span id="corte-dia" >   
    <PopupPagoPendiente/>
   <h1>Reporteo </h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small> 
    
    <div class="card">
      <div class="card-body">
        <div v-if="mensaje" class="alert alert-warning">{{mensaje}}</div>
        <div v-if="loading" class="h4">
          <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
            <span class="sr-only">Cargando...</span>
          </div>
        </div>
        <div class="form-inline">
          <div class="form-group ml-2 mb-2">
            <label for="reporte-id" class="sr-only">Reporte</label>
            <select
              id="reporte-id"
              v-model="cat_especialidad"
              @change="onChangeEspecialidad()"
              class="form-control"
              placeholder="Especialidad"
              required
            >
              <option
                v-for="especialidad in listaEspecialidades"
                v-bind:value="especialidad.id"
                v-bind:key="especialidad.id"
              >
                {{ especialidad.nombre }}
              </option>
            </select>
          </div>
          <div class="form-group ml-2 mb-2">
                <label for="f-inicio" class="sr-only">Fecha inicio</label>
                <datepicker
                id="f-inicio"
                name="fecha" 
                v-model="fechaInicio"
                input-class="form-control"
                :bootstrap-styling="true"
                :language="es"            
                @selected="cambiarFecha"
                format="yyyy-MM-dd"
              ></datepicker>    
          </div>
          <div class="form-group ml-2 mb-2">
                <label for="f-fin" class="sr-only">Fecha fin</label>
                <datepicker
                id="f-fin"
                name="fecha" 
                v-model="fechaFin"
                input-class="form-control"
                :bootstrap-styling="true"
                :language="es"            
                @selected="cambiarFecha"
                format="yyyy-MM-dd"
              ></datepicker>    
          </div>
              <button :disabled="loading" @click="imprimir()" class="btn btn-outline-primary mb-2"><i class="fas fa-print"></i> Imprimir</button>
        </div>
           
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
import  PopupPagoPendiente  from "../PopupPagoPendiente.vue";

export default {
  name: "corte-dia",
  components: {
    Datepicker,VueGoodTable,PopupPagoPendiente
  },
  mixins:[operacionesApi],
  data() {
    return {      
      usuarioSesion: {},
     // sesion: {}, 
      fechaInicio:Date,
      fechaFin:Date,
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
    this.fechaInicio = new Date();
    this.fechaFin = new Date();
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
       { fechaInicio:this.fechaInicio,fechaFin:this.fechaFin,id_usuario:this.usuarioSesion.id });
       this.lista = this.corte.detalleIngreso;
       this.listaGastos = this.corte.detalleGasto;
       
       this.loading = false;
    },
    async imprimir() {
      const html =  await this.putAsync(URL.REPORTES_BASE +'/corte/dia/sucursal/imprimir/'+this.usuarioSesion.co_sucursal,
            { fechaInicio:this.fechaInicio,fechaFin:this.fechaFin,id_usuario:this.usuarioSesion.id });

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
           console.log(this.fechaInicio)
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
