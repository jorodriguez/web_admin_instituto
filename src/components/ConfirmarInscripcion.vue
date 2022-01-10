<template>
  <div class="cat_alumno">
    <h1>
      Confirmar Inscripción ({{
        listaInscripciones != [] ? listaInscripciones.length : 0
      }})
    </h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>
    <div class="row">
      <div class="col-auto mr-auto">
        <router-link to="/CatCurso" class="btn btn-secondary btn-lg">
          <i class="fas fa-arrow-circle-left text-gray"></i>
        </router-link>
      </div>
      <div class="col-auto"></div>
    </div>

    <br />

    <!-- </form>-->

    <div class="card">
      <div class="card-body text-left">
        <div class="form-row ">
          <div
            class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6"
          >
            <label>
              Especialidad
              <span class="text-danger">*</span>
            </label>
            <select
              v-model="cat_especialidad"
              @change="onChangeEspecialidad()"
              class="form-control"
              placeholder="Especialidad"
              required
            >
              <option
                v-for="especialidad in listaEspecialidades"
                v-bind:value="especialidad.id"
                v-bind:key="especialidad.id"
              >
                {{ especialidad.nombre }}
              </option>
            </select>
          </div>

          <div
            class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6"
          >
            <label>
              Curso
              <span class="text-danger">*</span>
            </label>
            <select
              v-model="uidCurso"
              @change="onChangeCurso()"
              class="form-control"
              placeholder="Curso"
              required
            >
              <option
                v-for="curso in listaCursos"
                v-bind:value="curso.uid"
                v-bind:key="curso.uid"
              >
                {{
                  `${curso.dias} horario ${curso.horario} / inicia ${curso.fecha_inicio_previsto_format}`
                }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="loader" class="mx-auto">
          <Loader :loading="loader" :mini="true" />
        </div>

        <div class="card">           
              <div class="card-body">        
              <TablaAlumnosConfirmar :listaInscripciones="listaInscripciones" :reload="this.cargarAlumnosCurso" :mostrar_acciones="true" />
              </div>
        </div>
      </div>
    </div>

  

  </div>
</template>

<script>
import { operacionesApi } from "../helpers/OperacionesApi";
import { getUsuarioSesion } from "../helpers/Sesion";
import AlumnoModel from "../models/AlumnoModel";
import Datepicker from "vuejs-datepicker";
import URL from "../helpers/Urls";
import Emit from "../helpers/Emit";
import { validacionDatosAlumno } from "../helpers/AlumnoValidacion";
import { en, es } from "vuejs-datepicker/dist/locale";
import Loader from "../components_utils/Loader";
import moment from "moment";
import Popup from "../controller/Popup";
import TablaAlumnosConfirmar from "./fragmentos/inscripciones/TablaAlumnosConfirmar";

export default {
  name: "confirmar-inscripcion",
  components: {
    Datepicker,
    Loader,
    Popup,
    TablaAlumnosConfirmar
  },
  mixins: [operacionesApi],
  data() {
    return {
      uidCurso: "",
      operacion:"",
      alumno:AlumnoModel,
      usuarioSesion: {},
      cat_especialidad: null,
      listaEspecialidades: [],
      listaCursos: [],
      listaInscripciones: [],
      lista: [],
      es: es,
      loader: false,
      isModificacion: false,
    };
  },
  mounted() {
    console.log("##### CONFIRMAR INSCRIPCIONES  ####");
    this.usuarioSesion = getUsuarioSesion();
    console.log(
      `DATOS curso uidCurso ${this.$route.params} especialidad ${this.$route.params.cat_especialidad} `
    );
    this.uidCurso = `${this.$route.params.uidCurso}`;
    this.cat_especialidad = `${this.$route.params.cat_especialidad}`;
    this.init();
  },

  methods: {
    async init() {
      this.listaEspecialidades = await this.getAsync(
        `${URL.ESPECIALIDADES_BASE}/${this.usuarioSesion.id_empresa}`
      );

      if (this.cat_especialidad) {
        this.listaCursos = await this.getAsync(
          `${URL.CURSO}/${this.usuarioSesion.co_sucursal}/${this.cat_especialidad}`
        );
      } else {
        console.log("No va a la db por los cursos");
        this.listaCursos = [];
      }
      await this.cargarAlumnosCurso();
    },
    async cargarAlumnosCurso() {
      console.log("@cargarAlumnosCurso");
      if (this.uidCurso) {
        console.log("this.uidCurso "+this.uidCurso);
        this.listaInscripciones = await this.getAsync(
          `${URL.ALUMNOS_BASE}/curso/${this.uidCurso}`
        );
        console.log(this.listaInscripciones);
      }
    },
     async onChangeEspecialidad(event) {
      console.log("@onChangeEspecialidad " + this.cat_especialidad);
      if (this.cat_especialidad) {
        this.listaCursos = await this.getAsync(
          `${URL.CURSO}/${this.usuarioSesion.co_sucursal}/${this.cat_especialidad}`
        );
      } else {
        console.log("No va a la db por los cursos");
        this.listaCursos = [];
      }      
    },
    async onChangeCurso(event) {
      console.log("@onChangeCurso " + this.uidCurso);
      await this.cargarAlumnosCurso();      
    }
   
  },
};
</script>

<style scoped></style>
