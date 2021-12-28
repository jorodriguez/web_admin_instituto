<template>
<span>
  <div class="row" 
      v-for="row in listaModulos"
      :key="row.id" >

     <h3>{{row.nombre}}</h3>
     <h5>{{row.descripcion}}</h5>
     <table class="table text-left">          
            <tr>                
                <th>Modulo</th>
                <th>materias</th>
                <th></th>
            </tr>
            <tbody 
              v-for="row in row.materias"
              :key="row.id">
                <tr>                
                  <td>{{row.nombre}} </td>
                  <td class="font-weight-bold">{{row.telefono}}</td>
                  <td class="text-right" >                  
                    <span v-if="row.confirmado" class="btn btn-link btn-sm">
                        <i class="fa fa-check-circle text-success "></i>                    
                        <span class="text-success pointer" @click="seleccionar(row,'DETALLE')"> Confirmado</span>                         
                        <!--<span @click="seleccionar(row,'NO_CONFIRMAR')" class="text-danger pointer" title="Quitar confirmación"><i class="fa fa-times "></i></span>  -->
                    </span>
                    <span v-else >
                      <button class="btn btn-success " @click="seleccionar(row,'CONFIRMAR')">
                        Confirmar
                      </button>                      
                    </span>
                    <span v-if="row.confirmado == false" class="btn btn-link btn-sm">
                        <i class="fa fa-times text-dark "></i>                    
                        <span class="text-dark pointer" @click="seleccionar(row,'DETALLE')">Cancelado</span>                                                 
                    </span>
                    <span v-else >
                    <button  class="btn btn-light" @click="seleccionar(row,'NO_CONFIRMAR')" >
                        Cancelar
                    </button>
                    </span>
                  </td>                  
                </tr>                
            </tbody>
          </table>               
  </div>
</span>
</template>
              

<script>
import { operacionesApi } from "../../../helpers/OperacionesApi";
import { getUsuarioSesion } from "../../../helpers/Sesion";
import AlumnoModel from "../../../models/AlumnoModel";
import URL from "../../../helpers/Urls";
import { en, es } from "vuejs-datepicker/dist/locale";
import moment from "moment";
import Popup from "../../../controller/Popup";

export default {
  name: "tabla-inscripcion-confirmar-inscripcion",
  components: {
    Popup
  },
  mixins: [operacionesApi],
  props:["listaModulos","reload"],
  data() {
    return {
      uidCurso: "",
      usuarioSesion: {},            
      operacion:"",
      inscripcion:{id:0,nota:''},
      es: es,
      loader: false      
    };
  },
  mounted() {
    console.log("##### INCIAR TABLA materias CONFIRMACION  ####");
    this.usuarioSesion = getUsuarioSesion();        
    //this.init();
  },

  methods: {
    seleccionar(row,operacion){
        console.log("iniciar confirmacion");
        this.inscripcion =  Object.assign({},row);
        this.operacion = operacion;        
        this.inscripcion.nota = '';
        console.log(JSON.stringify(this.inscripcion));
        if(operacion == 'DETALLE'){
          $("#popup_detalle").modal("show");        
        }else{
            $("#popup_confirmar_inscripcion").modal("show");        
        }
    },
    
  },
};
</script>

<style scoped></style>
