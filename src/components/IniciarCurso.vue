<template>
  <div class="cat_alumno">
    <h1>Iniciar curso</h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>
    <div class="row">
      <div class="col-auto mr-auto">
        <router-link to="/CatCursos" class="btn btn-secondary btn-lg">
          <i class="fas fa-arrow-circle-left text-gray"></i>
        </router-link>
        <button class="btn btn-success btn-lg">Iniciar curso</button>
      </div>
      <div class="col-auto"></div>
    </div>

    <div class="card mt-2 mb-2 pb-3">
      <RowCurso :curso="cursoSeleccionado" />
    </div>

    <div class="card">
      <div class="card-body text-left">
        <div v-if="loader" class="mx-auto">
          <Loader :loading="loader" :mini="true" />
        </div>

        <ul class="nav nav-pills nav-justified" id="pills-tab" role="tablist">
          <li class="nav-item">
            <a
              class="nav-link active"
              id="pills-alumnos-tab"
              data-toggle="pill"
              href="#pills-alumnos"
              role="tab"
              aria-controls="pills-alumnos"
              aria-selected="true"
              ><span v-if="listaSemanas" class="badge badge-pill badge-info">{{listaInscripciones.length}}</span> Alumnos</a
            >
          </li>

          <li class="nav-item">
            <a
              class="nav-link"
              id="pills-semanas-tab"
              data-toggle="pill"
              href="#pills-semanas"
              role="tab"
              aria-controls="pills-semanas"
              aria-selected="false"
              ><span v-if="listaSemanas" class="badge badge-pill badge-info">{{listaSemanas.length}}</span> Semanas 
            </a>
          </li>

          <li class="nav-item">
            <a
              class="nav-link"
              id="pills-info-tab"
              data-toggle="pill"
              href="#pills-info"
              role="tab"
              aria-controls="pills-info"
              aria-selected="false"
              >Mas información
            </a>
          </li>
        </ul>
        <div class="tab-content" id="pills-tabContent">
          <div
            class="tab-pane fade show active"
            id="pills-alumnos"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
          >
            <div class="card">
              <div class="card-body">
                <TablaAlumnosConfirmar
                  :listaInscripciones="listaInscripciones"
                  :reload="this.cargarAlumnosCurso"
                />
              </div>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="pills-semanas"
            role="tabpanel"
            aria-labelledby="pills-semanas-tab"
          >
            <div class="row">
              <table class="table table-sm table-hover text-left ">
                <tr>
                  <th scope="col"># </th>                  
                  <th scope="col">Clase</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Módulo </th>                  
                </tr>
                <tbody v-for="(row, index) in listaSemanas" :key="row.id">
                  <tr :class="(index % 2) == 0 ? 'bg-secondary':''">
                    <td>{{ row.numero_periodo }} </td>
                    <td class="font-weight-bold">{{ row.fecha_semana_clase_format }}</td>                                                            
                    <td>{{ row.clase }} </td>                    
                    <td>{{ row.modulo }} </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="pills-info"
            role="tabpanel"
            aria-labelledby="pills-info-tab"
          >
            info
          </div>
        </div>
      </div>
    </div>

    <!-- detalle de confirmación -->
    <!-- <Popup id="popup_detalle" :show_button_close="true">
      <div slot="header">
          Confirmar iniciar taller
      </div>
      <div slot="content">
        <div class="row text-left">
          
        </div>
      </div>
      <div slot="footer">        
        
      </div>
    </Popup>-->
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
import RowCurso from "./fragmentos/curso/RowCurso";
import TablaAlumnosConfirmar from "./fragmentos/inscripciones/TablaAlumnosConfirmar";

export default {
  name: "iniciar-curso",
  components: {
    Datepicker,
    Loader,
    Popup,
    RowCurso,
    TablaAlumnosConfirmar,
  },
  mixins: [operacionesApi],
  data() {
    return {
      uidCurso: "",
      operacion: "",
      cursoSeleccionado: {},
      alumno: AlumnoModel,
      usuarioSesion: {},
      cat_especialidad: null,
      listaEspecialidades: [],
      listaCursos: [],
      listaInscripciones: [],
      lista: [],
      listaSemanas: [],
      es: es,
      loader: false,
      isModificacion: false,
    };
  },
 async mounted() {
    console.log("##### INCIAR CURSO  ####");
    this.usuarioSesion = getUsuarioSesion();
    this.uidCurso = `${this.$route.params.uidCurso}`;
    await this.init();
  },

  methods: {
    async init() {
      await this.cargarCurso();
      await this.cargarAlumnosCurso();
      await this.cargarSemanas();
    },
    async cargarAlumnosCurso() {
      console.log("@cargarAlumnosCurso");
      if (this.uidCurso) {
        this.listaInscripciones = await this.getAsync(
          `${URL.INSCRIPCION_BASE}/curso/${this.uidCurso}`
        );
        console.log(this.listaInscripciones);
      }
    },
    async cargarCurso() {
      if (this.uidCurso) {
        this.cursoSeleccionado = await this.getAsync(
          `${URL.CURSO}/uid/${this.uidCurso}`
        );
      }
    },
    async cargarSemanas() {
      console.log("Cargar semanas "+this.uidCurso);
      if (this.uidCurso) {
        this.listaSemanas = await this.getAsync(
          `${URL.PERIODOS_CURSO}/curso/${this.uidCurso}`
        );
      }
    },
     async cargarMaterias() {
      console.log("Cargar materuias "+this.uidCurso);
      if (this.uidCurso) {
        this.listaSemanas = await this.getAsync(
          `${URL.MATERIAS_ESPECIALIDAD}/${this.cursoSeleccionado.cat_especialidad}`
        );
      }
    },
  },
};
</script>

<style scoped></style>
