<template>
  <div class="cat_alumno">
    <h1>Cobranza </h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>
    <div class="row">
      <!--<div class="col-auto mr-auto">       
        <router-link to="/Inscripcion" class="btn btn-primary btn-lg">
          
        </router-link>              
        
      </div>
      <div class="col-auto">
       
      </div>-->
    </div>

    <br />
    
    <!-- </form>-->

    
    <div class="card">      
        <!--<div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Buscar por nombre.."
            v-model="criterioNombre"
            v-on:keyup.enter="buscarPorNombre()"
            aria-label="Buscar por nombre.."            
          />
           <div class="input-group-append">
            <button
              class="btn btn-outline-secondary "
              type="button"
              v-on:click="buscarPorNombre()"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        -->
        
        
        <div v-if="loader" class="mx-auto">
            <Loader :loading="loader" :mini="true" />
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
            <span v-if="props.column.field == 'alumno'">              
              <div class="media">
                <img  @click="verPerfil(props.row)" :src="props.row.foto_alumno" alt class="pointer mr-3 rounded-circle" width="50" height="50" />                
                <div  @click="verPerfil(props.row)" class="pointer media-body">                
                  <h4>{{props.row.alumno}} {{props.row.apellidos}}</h4>
                  <h5 class="font-weight-normal">{{props.row.matricula}}</h5>                                  
                </div>
              </div>
            </span>
            <span v-else-if="props.column.field == 'especialidad'">              
                  <h4>Semana {{props.row.numero_semana_curso}}</h4>
                  <h5 class="font-weight-normal">{{props.row.especialidad}}</h5>                  
            </span>
            <span v-else-if="props.column.field == 'dia'">              
                  <h4>{{props.row.dia}}</h4>
                  <h5 class="font-weight-normal">{{props.row.fecha_clase}}</h5>
                  
            </span>                                           
            <span  v-else-if="props.column.field == 'cargo'">              
                  <h4 class="">${{props.row.cargo}}</h4>                                    
            </span>  
            
            <span  v-else-if="props.column.field == 'acciones'">              
                <button type="button"  @click="verPerfil(props.row)" class="btn btn-outline-primary">Cobrar</button>
            </span>                                           
            <span v-else>{{props.formattedRow[props.column.field]}}</span>
          </template>
        </vue-good-table>
           
            
    </div>
  </div>
</template>

<script>

import Datepicker from 'vuejs-datepicker';
import URL from "../helpers/Urls";
import { operacionesApi } from "../helpers/OperacionesApi";
import { en, es } from 'vuejs-datepicker/dist/locale'
import { getUsuarioSesion } from '../helpers/Sesion';
import Loader from '../components_utils/Loader';
import moment from 'moment';
import {formatPrice} from '../helpers/Utils';
import TABLE_CONFIG from "../helpers/DatatableConfig";
import { VueGoodTable } from 'vue-good-table';

export default {
  name: "Cobranza",
  components: {
    Datepicker,Loader,VueGoodTable
  },
  mixins: [operacionesApi],
  data() {
    return {            
      response: "",
      usuarioSesion: {},
      sesion: {},      
      criterioNombre: "",
      lista: [],      
      listaRespaldo: [],           
      mensaje: "",
      es: es,           
      observacionesBaja:"",
      loader:false,
      TABLE_CONFIG:TABLE_CONFIG,
      columnas:[
      {
        label: 'Id',
        field: 'id',
        hidden: true
      },
      {
        label: 'Fecha Cargo',
        field: 'fecha_cargo',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center',
        hidden: true
      },
      {
        label: 'Cargo',
        field: 'Cargo',
        filterable: true,
        thClass: 'text-center',
        tdClass: 'text-left',
        hidden:true
      
      },
      {
        label: 'uid_alumno',
        field: 'uid_alumno',
        filterable: true,
        thClass: 'text-center',
        tdClass: 'text-left',
        hidden:true
      },
      {
        label: 'foto_alumno',
        field: 'uid_alumno',
        filterable: true,
        thClass: 'text-center',
        tdClass: 'text-left',
        hidden:true
      },      
      {
        label: 'Alumno',
        field: 'alumno',
        filterable: true,
        thClass: 'text-center',
        tdClass: 'text-left',
        hidden:false
      },
      
      {
        label: 'Especialidad',
        field: 'especialidad',
        filterable: true,
        thClass: 'text-center',
        tdClass: 'text-left',
        hidden:false        
      },
      {
        label: 'Clase',
        field: 'dia',
        filterable: true,
        thClass: 'text-center',
        tdClass: 'text-left',
        hidden:false
      },
      {
        label: 'Cargo',
        field: 'cargo',
        filterable: true,
        thClass: 'text-center',
        tdClass: 'text-center',
        hidden:false
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
    console.log("##### iniciando lista de cobranza ####");

    this.usuarioSesion = getUsuarioSesion();
            
    this.TABLE_CONFIG.PAGINATION_OPTIONS.perPage = 50;

    this.cargarListaCobranza();  
  },
  methods: {   
    async cargarListaCobranza(){
      this.loader = true;
      this.lista = await this.getAsync(URL.COBRANZA + "/colegiaturas/" + this.usuarioSesion.co_sucursal);
      this.listaRespaldo = Object.assign(this.lista,{});
      this.loader = false;
    },    
    select(rowSelect, operacion) {
      console.log("fila seleccionada " + rowSelect.adeuda);
      this.operacion = operacion;
      this.input = rowSelect;
      this.mensaje = "";      
    },
    verPerfil(rowSelect) {
      console.log("fila seleccionada " + rowSelect.uid);
      this.$router.push({ name: "PerfilAlumno", params: { uid: rowSelect.uid_alumno } });
    },
    buscarPorNombre() {
      console.log("Buscar por nombre " + this.criterioNombre);
      if (this.criterioNombre == '') {
        this.lista = this.listaRespaldo;
      } else {

        this.lista = this.listaRespaldo
          .filter(
            e =>
              e.alumno.toUpperCase().includes(this.criterioNombre.toUpperCase())
              || (e.apellidos ? e.apellidos.toUpperCase().includes(this.criterioNombre.toUpperCase()) : false)
          );

      }
    },
    cambiarSucursal(row) {
      this.$router.push({ name: "CambioSucursal", params: { id_alumno: row.id } });
    },
    subirFotoPerfil(id) {

      this.$router.push({ name: "SubirFotoAlumno", params: { id: id } });
    }
  }
};
</script>

<style scoped></style>
