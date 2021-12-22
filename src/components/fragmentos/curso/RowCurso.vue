<template>
    
        <div class="row  border-top mt-2">
             <div class="col-md-2 mt-2">
              <img
                v-if="curso.foto_curso"
                class="mr-3 img-fluid rounded border border-gray"
                width="150"
                :src="curso.foto_curso"
                alt="Especialidad"
              />
              <div
                v-else
                class="card border border-gray"
                style="width: 140px"
              >
                <div class="card-body">
                  <button class="btn btn-link">
                    <i class="fa fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
            <div class="col mt-2">
              <div class="text-left">
                <h3 class="mt-0 pointer"  @click="this.clickHead()"> {{ curso.especialidad }}</h3>
                <p class="card-text text-sm">
                  <span class="text-muted">Fecha de inicio</span>
                  {{
                    curso.fecha_inicio_format
                      ? curso.fecha_inicio_format
                      : ` previsto ${curso.fecha_inicio_previsto_format}`
                  }}
                  <span class="text-muted">Fecha de fin</span>
                  {{
                    curso.fecha_fin_format
                      ? curso.fecha_fin_format
                      : ` previsto ${curso.fecha_fin_previsto_format}`
                  }}
                </p>
                <p class="card-text text-sm">
                  <span class="text-muted">Día(s)</span> {{ curso.dias }}
                  <span class="text-muted"> Horario</span> {{ curso.horario }}
                </p>
                 <p class="card-text text-sm">
                  <span class="text-muted">Colegiatura </span> <span class="font-weight-bold d-inline p-2 bg-gray rounded text-white m-2">${{ curso.costo_colegiatura_base }}</span>
                  <span class="text-muted"> Inscripción </span><span class="font-weight-bold d-inline p-2 bg-gray rounded text-white m-2">${{ curso.costo_inscripcion_base }}</span>
                </p>
              </div>
            </div>     
            <!--<div class="col-4 mt-2 mb-2 text-right">
              <p class="card-text text-sm ">                
                <span class="font-weight-bold"
                  >${{ item.costo_inscripcion_base }}</span
                ><span class="text-muted">Inscripción</span>
              </p>
              <p class="card-text text-sm">                
                <span class="font-weight-bold"
                  >${{ item.costo_colegiatura_base }}</span
                ><span class="text-muted">Colegiatura</span>
              </p>
              <p class="card-text text-sm">              
              <span
                :class="`badge badge-pill ${
                  item.inscripciones && item.inscripciones > 0
                    ? 'badge-primary'
                    : 'badge-secondary'
                }`"
                >{{ item.inscripciones }}</span
              >
              <span class="text-muted">Inscritos</span>
              </p>
            </div>-->          
          </div>
    
</template>
              

<script>
import { operacionesApi } from "../../../helpers/OperacionesApi";
import { getUsuarioSesion } from "../../../helpers/Sesion";
import Datepicker from "vuejs-datepicker";
import { en, es } from "vuejs-datepicker/dist/locale";
import moment from "moment";

export default {
  name: "card-curso",
  components: {
    
  },
  mixins: [operacionesApi],
  props:["curso","clickHeader"],
  data() {
    return {
      uidCurso: "",
      usuarioSesion: {},            
      es: es,
      loader: false      
    };
  },
  mounted() {
    console.log("##### INCIAR CARD CURSO  ####");
    //this.usuarioSesion = getUsuarioSesion();        
    //this.init();
  },

  methods: {
        clickHead(){
            if(this.clickHeader){
                this.clickHeader();
            }
        }
  },
};
</script>

<style scoped></style>
