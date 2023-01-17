<template>
  <span id="facturacion" >   
    
   <h1>Facturación {{usuarioSesion.nombre_sucursal}} </h1>
        
    <div class="card">
      <div class="card-body">
        <div v-if="mensaje" class="alert alert-warning">{{mensaje}}</div>
        <div v-if="loading" class="h4">
          <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
            <span class="sr-only">Cargando...</span>
          </div>
        </div>       
        <div v-else>                          

          <div class="row">
              <div class="col text-right">
                    <h1 class="text-red"> <span class="text-gray">Adeudo:</span>  ${{formatPrice(adeudo.adeuda)}}</h1>
              </div>
          </div>          

          <table class="table table-striped text-left">          
            <tr>                
                <th>Concepto</th>
                <th>Monto</th>
                <th class="text-center">Día de Pago</th>
                <th></th>
            </tr>
            <tbody 
              v-for="row in lista"
              :key="row.id">
                <tr>                
                  <td>
                    <strong>{{row.nombre_mensualidad}}</strong> <br/>
                    {{row.nota}}
                  </td>
                  <td :class="`font-weight-bold ${row.pago_aceptado ? 'text-gray':'text-red'}` ">${{formatPrice(row.monto)}} <i v-if="row.pago_aceptado" class="fa fa-check text-green"/> </td>
                  <td class="text-center" >                                      
                    {{row.dia_pago}}
                  </td>                  
                  <td  >                                      
                    <span v-if="row.pago_aceptado">
                        <span v-if="row.pago_aceptado"><i class="fa fa-check text-green"></i> Pagado</span>
                        <span v-if="!row.pago_aceptado"><i class="fa fa-check text-red"></i>NO Aceptado</span>
                    </span>
                    <span class="text-gray" v-else>
                          Pendiente de pago
                    </span>
                  </td>                  
                </tr>                
            </tbody>
          </table>      
          <div class="text-warning h4 p-3"> Te recomendamos pagar en los primeros 10 días de cada mes para evitar corte del servicio o recargos</div>   
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
      lista: [], 
      adeudo:null,
      mensaje: "",
      formatPrice:formatPrice,      
      loading:Boolean      
    };
  },
  mounted() {
    console.log("====iniciando el componente reporte de corte diario ===");
    
    this.usuarioSesion = getUsuarioSesion();        
    this.init();    
  },
  methods: {
    init(){            
      this.loadFunction();

    },
    async loadFunction(){            
       this.loading = true;       
       this.lista =  await this.getAsync(URL.FACTURACION_SUCURSAL +'/'+this.usuarioSesion.co_sucursal);      
       this.adeudo =  await this.getAsync(URL.FACTURACION_SUCURSAL +'/'+this.usuarioSesion.co_sucursal+'/adeudo');      
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
  }   
};

</script>
