<template>
  <!-- vista de 2 columnas  lo hace el row superos este solo crea un card de -->
  <div :class="`card  rounded  ${curso.inscripciones_cerradas ? 'border-danger':'border-primary'}  text-left`" 
      style="min-height: 170px">
    <div class="card-header ml-2 p-1 d-flex justify-content-end">                 
  
    </div>
    <div class="card-body row p-2 no-gutters ">
      <div class="col-auto shadow-sm">      
        <img
          v-if="curso.foto_curso"
          class="mr-3 img-fluid rounded border border-gray pointer"
          :style="`opacity: ${curso.inscripciones_cerradas ? 0.5 : 1}`"
          width="150"
          :src="curso.foto_curso"
          alt="Especialidad"          
        />
        <div v-else class="card border border-gray" style="width: 140px">
          <div class="card-body">
            <button class="btn btn-link" @click="() => this.cargarFoto()">
              <i class="fa fa-plus"></i>
            </button>
          </div>
        </div>        
      </div>
      <div class="col">
        <div class="card-block p-0">
          <h3 class="card-title mb-0 pb-0 pointer" @click="() => this.clickHead()">
            <i v-if="curso.inscripciones_cerradas" class="fa fa-lock text-danger text-sm"></i> 
            {{ curso.especialidad }}            
          </span>
      </h3/>          
          <small>
            <i class="fa fa-calendar text-gray" /> {{ curso.dia }} de {{ curso.horario }}
          </small>          
          <span v-if="curso.es_nuevo" class="badge badge-pill badge-warning">
            Nuevo
          </span>
          <p class="card-text text-sm ">
            {{
              curso.fecha_inicio_format
                ? curso.fecha_inicio_format
                : ` ${curso.fecha_inicio_previsto_format}`
            }}
            -
            <span class="text-orange">({{ curso.numero_semanas }} semanas)</span>
            <span v-if="curso.inicia_manana" class="badge badge-warning">
              Inicia Mañana
            </span>
          </p>
          <div class="card-text">
          <table class="table table-sm">
            <tr>
              <td>Colegiatura</td>
              <td>${{formatPrice(curso.costo_colegiatura_base) }}</td>
            </tr>
            <tr>
              <td>Inscripción</td>
              <td>${{formatPrice(curso.costo_inscripcion_base) }}</td>
            </tr>
          </table>          
          </div>          
        </div>        
      </div>     
    </div>
    <div class="card-footer p-0 w-100 text-muted ">                  
      <div class="card-body p-1 no-gutters ">
        <div class="col-4 bg-gray">   
          <span>      
            <sup
              style="font-size: 10px"
              :class="`badge badge-pill ${
                curso.inscripciones == 0 ? ' badge-dark' : ' badge-primary'
              }`"
            >
              {{ curso.inscripciones }}
            </sup> 
            <i class="fa fa-user-graduate"></i> alumnos
          </span>
        </div>        
      </div>          
    </div>
    <div v-if="curso.inscripciones_cerradas"
         class="card-footer p-0 bg-danger w-100  text-center">                  
         <div  class="col-auto ">   
              
                <i class="fa fa-lock"></i>
                Inscripciones cerradas
              
        </div>        
    </div>
  </div>
</template>

<script>
import { operacionesApi } from "../../../helpers/OperacionesApi";
import { getUsuarioSesion } from "../../../helpers/Sesion";
import Datepicker from "vuejs-datepicker";
import { en, es } from "vuejs-datepicker/dist/locale";
import moment from "moment";
import { formatPrice } from '../../../helpers/Utils';

export default {
  name: "card-curso",
  components: {},
  mixins: [operacionesApi],
  props: ["curso", "clickHeader"],
  data() {
    return {
      uidCurso: "",
      usuarioSesion: {},
      es: es,
      loader: false,
      formatPrice
    };
  },
  mounted() {
    console.log("##### INCIAR CARD CURSO  ####");
    //this.usuarioSesion = getUsuarioSesion();
    //this.init();
  },

  methods: {
    clickHead() {
      if (this.clickHeader) {
        this.clickHeader();
      }
    },
    cargarFoto() {
      this.$router.push({ name: "SubirFotoCurso", params: { uid: this.curso.uid } });
    },
  },
};
</script>

<style scoped>
.text-strike {
  text-decoration: line-through;
}
</style>
