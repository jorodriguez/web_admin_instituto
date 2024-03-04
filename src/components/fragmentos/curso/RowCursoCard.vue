<template>
  <!-- vista de 2 columnas  lo hace el row superos este solo crea un card de -->
  <div class="card rounded border-primary text-left" style="min-height: 150px;">
    <div class="row no-gutters">
      <div class="col-auto">
        <img
          v-if="curso.foto_curso"
          class="mr-3 img-fluid rounded border border-gray pointer"
          :style="`opacity: ${curso.inscripciones_cerradas ? 0.5 : 1}`"
          width="150"
          :src="curso.foto_curso"
          alt="Especialidad"
          @click="() => this.cargarFoto()"
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
        <div class="card-block  p-2">
          <h3 class="card-title mt-0 pointer" @click="() => this.clickHead()">
            {{ curso.dia }} de {{ curso.horario }}
          </h3>
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
            style="font-size: 10px"
            :class="`badge badge-pill ${
              curso.inscripciones == 0 ? ' badge-dark' : ' badge-primary'
            }`"
          >
            {{ curso.inscripciones }}
          </sup>
          <span v-if="curso.es_nuevo" class="badge badge-pill badge-warning">
            Nuevo
          </span>
          <p class="card-text text-sm">            
            {{
              curso.fecha_inicio_format
                ? curso.fecha_inicio_format
                : ` ${curso.fecha_inicio_previsto_format}`
            }} -
            <span class="text-orange">({{ curso.numero_semanas }} semanas)</span>
            <span v-if="curso.inicia_manana" class="badge badge-warning">
              Inicia Mañana
            </span>
          </p>

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
          <small v-if="curso.inscripciones_cerradas" class="badge badge badge-danger">
            <i class="fa fa-lock"></i>
            Inscripciones cerradas
          </small>
        </div>
      </div>
    </div>
    <!--<div class="card-footer w-100 text-muted">
      Footer stating cats are CUTE little animals
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
  components: {},
  mixins: [operacionesApi],
  props: ["curso", "clickHeader"],
  data() {
    return {
      uidCurso: "",
      usuarioSesion: {},
      es: es,
      loader: false,
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
