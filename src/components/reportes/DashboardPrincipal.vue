<template>
  <span id="dashboard"  >   
   <div class="header  pb-4 pt-1 pt-md-3 ">
      <div class="container-fluid">
        <div class="header-body">
          <!-- Card stats -->
          <div class="row">
            <div class="col-xl-3 col-lg-6">
              <div class="card card-stats mb-4 mb-xl-0">
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">Alumnos</h5>
                      <span class="h2 font-weight-bold mb-0">{{loadingContadores ? '-': contadores.alumnos }}</span>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-danger text-white rounded-circle shadow">
                        <i class=" fas fa-graduation-cap"></i>
                      </div>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-muted text-sm">
<!--                    <span class="text-success mr-2"><i class="fa fa-arrow-up"></i> 3.48%</span>-->
                    <span class="text-nowrap">Al día de hoy</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-lg-6">
              <div class="card card-stats mb-4 mb-xl-0">
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">Talleres</h5>
                      <span class="h2 font-weight-bold mb-0">{{loadingContadores ? '-': contadores.talleres }}</span>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <i class="fas fa-chart-pie"></i>
                      </div>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-muted text-sm">
                    <!--<span class="text-danger mr-2"><i class="fas fa-arrow-down"></i> 3.48%</span>-->
                    <span class="text-nowrap">Al día de hoy</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-lg-6">
              <div class="card card-stats mb-4 mb-xl-0">
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">Sales</h5>
                      <span class="h2 font-weight-bold mb-0">924</span>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-yellow text-white rounded-circle shadow">
                        <i class="fas fa-users"></i>
                      </div>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-muted text-sm">
                    <span class="text-warning mr-2"><i class="fas fa-arrow-down"></i> 1.10%</span>
                    <span class="text-nowrap">Since yesterday</span>
                  </p>
                </div>
              </div>
            </div>
            <div class="col-xl-3 col-lg-6">
              <div class="card card-stats mb-4 mb-xl-0">
                <div class="card-body">
                  <div class="row">
                    <div class="col">
                      <h5 class="card-title text-uppercase text-muted mb-0">Performance</h5>
                      <span class="h2 font-weight-bold mb-0">49,65%</span>
                    </div>
                    <div class="col-auto">
                      <div class="icon icon-shape bg-info text-white rounded-circle shadow">
                        <i class="fas fa-percent"></i>
                      </div>
                    </div>
                  </div>
                  <p class="mt-3 mb-0 text-muted text-sm">
                    <span class="text-success mr-2"><i class="fas fa-arrow-up"></i> 12%</span>
                    <span class="text-nowrap">Since last month</span>
                  </p>
                </div>
              </div>
            </div>
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
      formatPrice:formatPrice,
      loading:false,
      loadingContadores:false
    };
  },
  mounted() {
    console.log("====iniciando el componente dashboard ===");
    
    this.usuarioSesion = getUsuarioSesion();
    this.fechaInicio = new Date();
    this.fechaFin = new Date();
    
    this.init();    
  },
  methods: {
    init(){      
      this.loadFunction();
    },
    async loadFunction(){            
       this.loadingContadores = true;
       
        this.contadores = await this.getAsync(`${URL.REPORTES_BASE}/contadores/${this.usuarioSesion.id_empresa}/sucursal/${this.usuarioSesion.co_sucursal}`);
       //this.corte =  await this.putAsync(URL.REPORTES_BASE +'/corte/dia/sucursal/'+this.usuarioSesion.co_sucursal,
       //{ fechaInicio:this.fechaInicio,fechaFin:this.fechaFin,id_usuario:this.usuarioSesion.id });
       //this.lista = this.corte.detalleIngreso;
       //this.listaGastos = this.corte.detalleGasto;
       
       this.loadingContadores = false;
    },
     
    
  }   
};

</script>

<style scoped>

</style>
