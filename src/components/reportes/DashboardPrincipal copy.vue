<template>
  <span id="dashboard" >   
    <div class="container">
	<div class="row">
	    <br/>
	   <div class="col text-center">		
		  <p>Bienvenido {{usuarioSesion.nombre}}</p>
		  </div>
             
		
	</div>
		<div class="row text-center">
	        <div class="col">
	          <div class="counter">
              <i class="fa fa-code fa-2x"></i>
              <h2 class="timer count-title count-number" data-to="100" data-speed="1500">14</h2>
              <p class="count-text ">Alumnos</p>
            </div>
	        </div>
          <div class="col">
               <div class="counter">
      <i class="fa fa-coffee fa-2x"></i>
      <h2 class="timer count-title count-number" data-to="1700" data-speed="1500">0</h2>
      <p class="count-text ">Happy Clients</p>
    </div>
              </div>
              <div class="col">
                  <div class="counter">
      <i class="fa fa-lightbulb-o fa-2x"></i>
      <h2 class="timer count-title count-number" data-to="11900" data-speed="1500">0</h2>
      <p class="count-text ">Project Complete</p>
    </div></div>
              <div class="col">
              <div class="counter">
      <i class="fa fa-bug fa-2x"></i>
      <h2 class="timer count-title count-number" data-to="157" data-speed="1500">0</h2>
      <p class="count-text ">Coffee With Clients</p>
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
      formatPrice:formatPrice,
      loading:false
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
       this.loading = true;
       
       //this.corte =  await this.putAsync(URL.REPORTES_BASE +'/corte/dia/sucursal/'+this.usuarioSesion.co_sucursal,
       //{ fechaInicio:this.fechaInicio,fechaFin:this.fechaFin,id_usuario:this.usuarioSesion.id });
       //this.lista = this.corte.detalleIngreso;
       //this.listaGastos = this.corte.detalleGasto;
       
       this.loading = false;
    },
     
    
  }   
};

</script>

<style scoped>
.counter {
    background-color:#f5f5f5;
    padding: 20px 0;
    border-radius: 5px;
}

.count-title {
    font-size: 40px;
    font-weight: normal;
    margin-top: 10px;
    margin-bottom: 0;
    text-align: center;
}

.count-text {
    font-size: 13px;
    font-weight: normal;
    margin-top: 10px;
    margin-bottom: 0;
    text-align: center;
}

.fa-2x {
    margin: 0 auto;
    float: none;
    display: table;
    color: #4ad1e5;
}
</style>
