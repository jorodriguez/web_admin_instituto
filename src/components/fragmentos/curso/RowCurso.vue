<template>
  <div class="row mt-2">
    <div class="col-md-2 mt-2">
      <img v-if="curso.foto_curso" 
              :style="`opacity: ${curso.inscripciones_cerradas ? 0.5 : 1 }`"
              class="mr-3 img-fluid rounded border border-gray pointer" width="150"
              :src="curso.foto_curso" alt="Especialidad" @click="() => this.clickHead()" />
      <div v-else class="card border border-gray" style="width: 140px">
        <div class="card-body">
          <button class="btn btn-link">
            <i class="fa fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="col-6 mt-2">
      <div class="text-left">              
        <small v-if="curso.inscripciones_cerradas" class=" badge badge-pill text-md text-red"><i class="fa fa-lock"></i></small>
        <h3 class="mt-0 pointer" :class="curso.inscripciones_cerradas ? 'text-strike':''"  @click="() => this.clickHead()"> {{ curso.especialidad }}
          <i class="fa fa-users text-gray"></i><sup
            :class="`badge badge-pill ${curso.inscripciones == 0 ? ' badge-secondary' : ' badge-primary'}`">
            {{ curso.inscripciones }} </sup>
          <span v-if="curso.es_nuevo" class="badge  badge-warning">Nuevo</span>
        </h3>
        <p class="card-text text-sm">
          <span><i class="fa fa-calendar-check text-gray"></i> Fecha de inicio</span>
          <span class="font-weight-bold">{{
              curso.fecha_inicio_format
                ? curso.fecha_inicio_format
                : `${curso.fecha_inicio_previsto_format}`
          }}
          </span>
          <!--<span class="text-orange">({{ curso.numero_semanas }} semanas de clases)</span>-->
          <span v-if="curso.inicia_manana" class="badge  badge-warning">Inicia Mañana</span>
        </p>
        <p class="card-text text-sm">
             <i class="fa fa-clock text-muted"></i> {{ curso.dia }} de {{ curso.horario }} <!--<span class="text-indigo">(Pago {{ curso.esquema }})</span>-->
        </p>
        <!--<p class="card-text text-sm">
          Colegiatura <strong>{{ curso.esquema }}</strong> <span
            class="font-weight-bold d-inline p-2 bg-gray rounded text-white m-2">${{ curso.costo_colegiatura_base
            }}</span>
          Inscripción <span class="font-weight-bold d-inline p-2 bg-gray rounded text-white m-2">${{
              curso.costo_inscripcion_base
          }}</span>
        </p>-->
      </div>
    </div>
    <div class="col-4 text-left">          
          <h3><span class="text-gray"> ${{curso.costo_colegiatura_base}} /<span class="text-gray">{{ curso.esquema }}</span> </span></h3>
          <span class="text-sm text-orange">duración {{ curso.numero_semanas }} ({{curso.esquema}})</span>
    </div>
    <div class="col-2 text-left">          
          <small v-if="curso.inscripciones_cerradas" class=" badge badge badge-danger  "><i class="fa fa-lock"></i> Inscripciones cerradas</small>                 
    </div>
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
  props: ["curso", "clickHeader"],
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
    clickHead() {
      if (this.clickHeader) {
        this.clickHeader();
      }
    }
  },
};
</script>

<style scoped>

.text-strike{
  text-decoration: line-through;
}

</style>
