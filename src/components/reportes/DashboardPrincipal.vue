<template>
  <span id="dashboard"  >   
   <span v-if="loading" class="spinner-border  text-info" role="status" aria-hidden="true"></span>   
   <div class="header  pb-4 pt-1 pt-md-3 ">
      <div class="container-fluid">
        <div class="header-body">
          <!-- Card stats -->
          <div class="row">
            <div class="col-xl-4 col-lg-6">
              <div class="card card-stats mb-4 mb-xl-0">
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">Alumnos total</h5>
                      <span v-if="loadingContadores" class="spinner-border spinner-border-sm text-info" role="status" aria-hidden="true"></span>                      
                      <span v-else class="h1 font-weight-bold mb-0"> {{ contadores.alumnos }} </span>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <i class=" fas fa-graduation-cap"></i>
                      </div>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-muted text-sm">
<!--                    <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>-->
                    <span v-if="contadores" class="text-nowrap">En  {{contadores.talleres }} talleres</span>
                  </p>
                </div>
              </div>
            </div>

                
            <div class="col-xl-4 col-lg-6">
              <div class="card card-stats mb-4 mb-xl-0">
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">Inscripciones Mes</h5>
                      <span v-if="loadingInscripciones" class="spinner-border spinner-border-sm text-info" role="status" aria-hidden="true"></span>
                      <span v-else :class="`h1 font-weight-bold mb-0  ${informacionInscripciones && informacionInscripciones.inscritos_mes_actual == 0 ? 'text-danger':''}`">
                         <span v-if="informacionInscripciones.inscritos_mes_actual != null" >{{informacionInscripciones.inscritos_mes_actual}}</span> 
                      </span>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-info text-white rounded-circle shadow">
                        <i class="fas fa-percent"></i>
                      </div>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-muted text-sm">
                    <span v-if="informacionInscripciones != null" :class="`text-success mr-2  ${informacionInscripciones && informacionInscripciones.inscritos_mes_actual == 0 ? 'text-danger':''}`"> {{informacionInscripciones.inscritos_mes_anterior}}</span>
                    <span class="text-nowrap">mes anterior</span>
                  </p>
                </div>
              </div>
            </div>

             <div class="col-xl-4 col-lg-6">
              <div class="card card-stats mb-4 mb-xl-0">
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">Cobros pendiente</h5>
                      <span v-if="loadingCargos" class="spinner-border spinner-border-sm text-info" role="status" aria-hidden="true"></span>
                      <span class="h1 font-weight-bold mb-0">${{ formatPrice(informacionCargos.adeudo_total)}}</span>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-yellow text-white rounded-circle shadow">
                        <i class="fas fa-cash-register"></i>
                      </div>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-muted text-sm">
                    <!--<span class="text-warning mr-2"><i class="fas fa-arrow-down"></i> 1.10%</span>-->
                    <span class="text-nowrap">{{informacionCargos.numero_cargos}} cargos pendientes de cobrar</span>
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- desglose de cargos -->
    <div class="row mt-3">               
          <!-- Desglose de alumnos deudores -->
         <div class="col-xl-7">
          <div class="card shadow">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h3 class="mb-0">Alumnos </h3>
                </div>
                <div class="col text-right">
                  <!--<a href="#!" class="btn btn-sm btn-primary">See all</a>-->
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <!-- Projects table -->
              <span v-if="loadingTotalAlumnosDeudores" class="spinner-border spinner-border-sm text-info" role="status" aria-hidden="true"></span>
              <table v-else class="table align-items-center table-flush">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">Nombre</th>                    
                    <th scope="col">Adeuda</th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in informacionTotalAlumnosDeudores" :key="index">
                    <td scope="row" class="text-left">
                      <strong>{{item.alumno}} {{item.apellidos}}</strong> <br/>
                      {{item.curso}} {{item.dia}} {{item.hora_inicio}}-{{item.hora_fin}}
                    </td>                    
                    <td>
                         <strong> ${{ formatPrice(item.total_adeudo)}}</strong>
                    </td>
                  </tr>                 
                </tbody>
              </table>
            </div>
          </div>      
    </div>
    <!-- fin desglose de cargos-->
     <div class="col-xl-5 mb-4 mb-xl-0 ">
          <div class="card shadow">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h3 class="mb-0">Cobros pendientes</h3>
                </div>
                <div class="col text-right">
                 <!--- <a href="#!" class="btn btn-sm btn-primary">See all</a>-->
                </div>
              </div>
            </div>
            <div class="table-responsive">  
              <span v-if="loadingCargos" class="spinner-border spinner-border-sm text-info" role="status" aria-hidden="true"></span>              
              <table v-else class="table align-items-center table-flush">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">Cargo</th>
                    <!--<th scope="col">Adeudo</th>-->
                    <th scope="col">No. Cargos</th>
                    <th scope="col">Total </th>
                  </tr>
                </thead>              
                <tbody>
                  <tr v-for="(item,index) in informacionCargos.totalAdeudoDesgloseCargos" :key="index">
                    <th scope="row" class="text-left">
                      {{item.nombre_cargo}}
                    </th>
                    <td>
                      {{item.numero_cargos}}
                    </td>                    
                    <td>
                     <strong> ${{ formatPrice(item.total_adeudo)}}</strong>
                    </td>
                  </tr>                 
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>



       <!-- alumnos deudores -->
      <div class="row mt-3">     
         <!-- Desglose de cargos -->
         <div class="col-xl-12">
          <div class="card shadow">
            <div class="card-header border-0">
              <div class="row align-items-center">
                <div class="col">
                  <h3 class="mb-0">Cobros por Cursos </h3>
                </div>
                <div class="col text-right">
                  <!--<a href="#!" class="btn btn-sm btn-primary">See all</a>-->
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <!-- Projects table -->
              <table class="table align-items-center table-flush">
                <thead class="thead-light">
                  <tr>
                    <th scope="col">Curso</th>                    
                    <th scope="col">Total</th>
                  </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in informacionTotalAdeudosCurso" :key="index">
                    <td scope="row" class="text-left">
                      <strong>{{item.curso}}</strong> <br/> <span class="text-gray">{{item.dia}} {{item.hora_inicio}}-{{item.hora_fin}}</span>
                    </td>
                    
                    <td>
                         <strong> ${{ formatPrice(item.total_adeudo)}}</strong>
                    </td>
                  </tr>                 
                </tbody>
              </table>
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
import {getUsuarioSesion} from '../../helpers/Sesion';
import {formatPrice} from '../../helpers/Utils';
import moment from 'moment';
import Emit from "../../helpers/Emit";


export default {
  name: "dashboard-principal",
  components: {
    
  },
  mixins:[operacionesApi],
  data() {
    return {      
      usuarioSesion: {},     
      fechaInicio:Date,
      fechaFin:Date,
      lista: [],                                       
      alumnosTotal:0,        
      contadores:null, 
      informacionCargos:null,            
      informacionInscripciones:null,            
      informacionTotalAdeudosCurso:null,
      informacionTotalAlumnosDeudores:null,
      formatPrice:formatPrice,
      loading:false,
      loadingCargos:false,
      loadingContadores: false,  
      loadingInscripciones:false,
      loadingTotalAdeudoPorCursos:false,
      loadingTotalAlumnosDeudores:false,
    };
  },
  mounted() {
    console.log("====iniciando el componente dashboard ===");
    
    this.usuarioSesion = getUsuarioSesion();
        
    this.init();    

    this.$root.$on("CAMBIO_SUCURSAL", text => {
            console.log("Actualizar dashboard " + text);                
             this.init();               
    });

  },
  methods: {
    init(){      
      this.loadingContadores = true;    
      this.loading = true;
        
      this.cargarContadores();
   

     this.loadingCargos = true;
      setTimeout(()=>{
          this.cargarCargos();
      },1000);

      this.loadingInscripciones = true;      
      setTimeout(()=>{
          this.cargarInscripciones();
      },3000);

      this.loadingTotalAlumnosDeudores = true;      
      setTimeout(()=>{
        this.cargarTotalAlumnosDeudores();          
      },4000);

      this.loadingTotalAdeudoPorCursos = true;      
      setTimeout(()=>{
        this.cargarTotalAdeudosPorCurso();
        this.loading = false;
      },8000);
      
      
      
    },
    async cargarContadores(){       
      this.contadores = await this.getAsync(`${URL.REPORTES_BASE}/contadores/${this.usuarioSesion.id_empresa}/sucursal/${this.usuarioSesion.co_sucursal}`);
      this.loadingContadores = false;
    },
   async cargarCargos(){                  
        this.informacionCargos = await this.getAsync(`${URL.REPORTES_BASE}/totales-cargos/${this.usuarioSesion.id_empresa}/sucursal/${this.usuarioSesion.co_sucursal}`);
        this.loadingCargos = false;      
    },
    async cargarInscripciones(){     
      
        this.informacionInscripciones = await this.getAsync(`${URL.REPORTES_BASE}/totales-inscripciones/${this.usuarioSesion.id_empresa}/sucursal/${this.usuarioSesion.co_sucursal}`);
        this.loadingInscripciones = false;
      
    },
    async cargarTotalAdeudosPorCurso(){     
      
        this.informacionTotalAdeudosCurso = await this.getAsync(`${URL.REPORTES_BASE}/totales-adeudos-por-curso/${this.usuarioSesion.id_empresa}/sucursal/${this.usuarioSesion.co_sucursal}`);
        this.loadingTotalAdeudoPorCursos = false;
      
    },
     async cargarTotalAlumnosDeudores(){ 
           
        this.informacionTotalAlumnosDeudores = await this.getAsync(`${URL.REPORTES_BASE}/top-alumnos-deudores/${this.usuarioSesion.id_empresa}/sucursal/${this.usuarioSesion.co_sucursal}`);
        this.loadingTotalAlumnosDeudores = false;
      
    },
    
  }   
};

</script>

<style scoped>

</style>
