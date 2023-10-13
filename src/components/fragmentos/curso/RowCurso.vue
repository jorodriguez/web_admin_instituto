<template>
  <div :class="`row mt-2 `">
    <div class="col-md-2 mt-2">
      <img
        v-if="curso.foto_curso"
        class="mr-3 img-fluid rounded border border-gray pointer"
        :style="`opacity: ${curso.inscripciones_cerradas ? 0.5 : 1}`"
        width="150"
        :src="curso.foto_curso"
        alt="Especialidad"
        @click="() => this.cargarFoto()"
      />
      <div v-else class="card border border-gray" style="width: 140px;">
        <div class="card-body">
          <button class="btn btn-link" @click="() => this.cargarFoto()">
            <i class="fa fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-7 mt-2">
      <div class="text-left">
        <h3 class="mt-0 pointer" @click="() => this.clickHead()">
          <small
            v-if="curso.inscripciones_cerradas"
            class="badge badge-pill text-md text-red"
          >
            <i class="fa fa-lock"></i>
          </small>
          <span :class="curso.inscripciones_cerradas ? 'text-strike' : ''">
            {{ curso.especialidad }}
          </span>
          <i class="fa fa-user-graduate"></i>
          <sup
            style="font-size: 10px;"
            :class="`badge badge-pill ${
              curso.inscripciones == 0 ? ' badge-dark' : ' badge-primary'
            }`"
          >
            {{ curso.inscripciones }}
          </sup>
          <span v-if="curso.es_nuevo" class="badge badge-pill badge-warning">
            Nuevo
          </span>
        </h3>
        <p class="card-text text-sm">
          <span class="text-muted">Fecha de inicio</span>
          {{
            curso.fecha_inicio_format
              ? curso.fecha_inicio_format
              : ` previsto ${curso.fecha_inicio_previsto_format}`
          }}
          <span class="text-orange">({{ curso.numero_semanas }} semanas)</span>
          <span v-if="curso.inicia_manana" class="badge badge-warning">
            Inicia Mañana
          </span>
        </p>
        <p class="card-text text-sm">{{ curso.dia }} de {{ curso.horario }}</p>
        <p class="card-text text-sm">
          Colegiatura
          <span class="font-weight-bold d-inline p-2 rounded m-2">
            ${{ curso.costo_colegiatura_base }}
          </span>
          Inscripción
          <span class="font-weight-bold d-inline p-2 rounded m-2">
            ${{ curso.costo_inscripcion_base }}
          </span>
        </p>
        <small
          v-if="curso.inscripciones_cerradas"
          class="badge badge badge-danger"
        >
          <i class="fa fa-lock"></i>
          Inscripciones cerradas
        </small>
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
        },
        cargarFoto(){
          this.$router.push({ name: "SubirFotoCurso", params: { uid: this.curso.uid } });
        }
  }
};
</script>

<style scoped>
.text-strike {
  text-decoration: line-through;
}
</style>
