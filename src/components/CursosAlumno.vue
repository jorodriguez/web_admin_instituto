<template>
  <div class="container" >
    <!--<div class="row mb-1">
      <div class="col-auto mr-auto">
        <button class="btn btn-primary">
          <i class="fas fa-plus text-gray"></i>Inscribir a otra especialidad
        </button>
      </div>
    </div>-->
    <span
      v-for="item in lista"
      :key="item.id"      
      :disabled="loader"
    >
      <div class="card border-light border-bottom-2 mb-3">
        <div class="card-header bg-transparent border-light">
          <div class="row">
            <div class="col-1 ">
              <img
                v-if="item.foto_curso"
                class="img-fluid rounded"
                :src="item.foto_curso ? item.foto_curso : '...'"                                
              />
              <span v-else class="border border-primary"></span>
            </div>
            <div class="col">
              <h3>{{ item.especialidad }}</h3>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col">
              <p class="card-text">
                <span class="text-muted">Fecha de inicio</span>
                {{
                  item.fecha_inicio_format
                    ? item.fecha_inicio_format
                    : ` previsto ${item.fecha_inicio_previsto_format}`
                }}
              </p>
              <p class="card-text">
                <span class="text-muted">Día(s)</span> {{ item.dias }}
              </p>
              <p class="card-text">
                <span class="text-muted">Horario</span> {{ item.horario }}
              </p>
            </div>
            <div class="col">
              <p class="card-text">
                <span class="text-muted">Inscripción:</span>
                <span class="font-weight-bold"
                  >${{ item.costo_inscripcion }}</span
                >
              </p>
              <p class="card-text">
                <span class="text-muted">Colegiatura:</span>
                <span class="font-weight-bold"
                  >${{ item.costo_colegiatura }}</span
                >
              </p>
              <p class="card-text">
                <span class="text-muted">Fecha de inscripción</span>
                {{
                  item.fecha_inscripcion_format
                    ? item.fecha_inscripcion_format
                    : ""
                }}
              </p>
            </div>
          </div>
        </div>
        <div class="card-footer bg-light ">
          <div class="row">
            <div class="col">
              Semana Actual: <strong>{{ item.semana_actual }}</strong> de
              <strong>{{ item.duracion_curso }}</strong>
            </div>
            <div class="col">
              Pagado: <strong>{{ item.pagado ? "SI" : "NO" }}</strong>
            </div>
            <div class="col">
                <button class="btn btn-link">Modificar</button>
                <button class="btn btn-link">Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </span>
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
  name: "datos-alumno",
  components: {
    Datepicker,
    Loader
  },
  props: ["lista"],
  mixins: [operacionesApi],
  data() {
    return {
      uid: "",
      usuarioSesion: {},
      input: AlumnoModel,
      listaInscripciones: [],
      generoAlumno: { id: -1, nombre: "", foto: "" },
      es: es,
      loader: false,
      isModificacion: false
    };
  },
  mounted() {
    console.log("##### DATOS ALUMNO  ####");
    this.usuarioSesion = getUsuarioSesion();
    console.log(`DATOS ALUMNO ${this.$route.params.uid}`);
    this.uid = `${this.$route.params.uid}`;
    this.init();
  },
  watch: {
    lista: function (newId, oldId) {
      console.log(`Observador para cambios de valor de la lista de curso ${newId} - ${oldId}`);
      
      
    }
  },
  methods: {
    async init() {
      //this.listaInscripciones=this.lista;
        
      
    },
    async cargarCursosAlumno(){
      if (this.uid) {
      this.listaInscripciones = await this.getAsync(
          `${URL.INSCRIPCION_BASE}/alumno/${this.uid}`
        );
      }
    },
    async guardar() {
      console.log("@guardar");
      const NO_VALIDAR_ESPECIALIDAD = false;

      if (!validacionDatosAlumno(this.input, NO_VALIDAR_ESPECIALIDAD)) {
        console.log("No paso la validacion");
        return;
      }

      let values = this.getValues();

      this.loader = true;
      console.log("inciando id alumno " + this.input.id);

      const respuesta = await this.putAsync(
        `${URL.ALUMNOS_BASE}/${this.input.id}`,
        values
      );

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
        this.$router.push({
          name: "PerfilAlumno",
          params: { uid: this.input.uid }
        });
      }
      this.loader = false;
    },
    getValues() {
      return {
        //co_curso: this.input.co_curso,
        cat_genero: this.input.cat_genero,
        nombre: this.input.nombre,
        apellidos: this.input.apellidos,
        direccion: this.input.direccion,
        telefono: this.input.telefono,
        fecha_nacimiento: this.input.fecha_nacimiento,
        nota: this.input.nota,
        //costo_colegiatura: this.input.costo_colegiatura,
        //costo_inscripcion: this.input.costo_inscripcion,
        foto: this.getFoto(),
        fecha_nacimiento: moment(this.input.fecha_nacimiento).format(
          "YYYY-MM-DD"
        ),
        genero: this.usuarioSesion.id
      };
    },
    getFoto() {
      let elemento = this.listaGeneroAlumno.find(
        e => e.id == this.input.cat_genero
      );
      return elemento.foto;
    }
  }
};
</script>

<style scoped></style>
