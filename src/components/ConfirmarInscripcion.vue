<template>
  <div class="cat_alumno">
    <h1>
      Confirmar Inscripciòn ({{
        listaInscripciones != [] ? listaInscripciones.length : 0
      }})
    </h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>
    <div class="row">
      <div class="col-auto mr-auto">
        <router-link to="/principal" class="btn btn-secondary btn-lg">
          <i class="fas fa-arrow-circle-left text-gray"></i>
        </router-link>
      </div>
      <div class="col-auto"></div>
    </div>

    <br />

    <!-- </form>-->

    <div class="card">
      <div class="card-body">
        <div class="form-row">
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

        <div class="row">
          <table class="table">
            <th>
                <td>Alumno</td>
                <td>Teléfono</td>
                <td></td>
            </th>
            <tbody 
              v-for="row in listaInscripciones"
              :key="row.id">
                <tr>
                  <td>{{row.alumno}}</td>
                  <td>{{row.telefono}}</td>
                  <td>
                    <button class="btn btn-success">
                      Confirmar
                    </button>
                    <button class="btn btn-success">
                      Cancelar
                    </button>
                  </td>
                </tr>                
            </tbody>
          </table>
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

export default {
  name: "confirmar-inscripcion",
  components: {
    Datepicker,
    Loader,
  },
  mixins: [operacionesApi],
  data() {
    return {
      uidCurso: "",

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
      /*let cursoSeleccionado = this.listaCurso.find(
        (e) => e.id == this.input.co_curso
      );
      this.input.costo_colegiatura = cursoSeleccionado.costo_colegiatura_base;
      this.input.costo_inscripcion = cursoSeleccionado.costo_inscripcion_base;*/
    },
    async guardarConfirmacionInscripcion() {
      console.log("@guardarConfirmacionInscripcion");

      this.loader = true;
      
      /*const respuesta = await this.putAsync(
        `${URL.ALUMNOS_BASE}/${this.input.id}`,
        values
      );*/

      console.log(respuesta);
      if (respuesta) {
        this.$notificacion.info(
          `Inscripción realizada`,
          `Se modificó el alumno`
        );

        this.$root.$emit(Emit.ACTUALIZAR_ALUMNO, Emit.ACTUALIZAR_ALUMNO);
      } else {
        this.$notificacion.error(
          "Ups!",
          "Algo sucedió al intentar guardar el alumno, ponte en contacto con soporte técnico."
        );
  
      }
      this.loader = false;
    },
  },
};
</script>

<style scoped></style>
