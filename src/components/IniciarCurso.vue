<template>
  <div class="cat_alumno">
    <h1>Iniciar taller</h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>
    <div class="row">
      <div class="col-auto mr-auto">
        <router-link to="/CatCursos" class="btn btn-secondary btn-lg">
          <i class="fas fa-arrow-circle-left text-gray"></i>
        </router-link>
        <button  @click="iniciarTaller()" class="btn btn-success btn-lg">Iniciar taller</button>
      </div>
      <div class="col-auto"></div>
    </div>

    <div class="card mt-2 mb-2 ">
      <RowCurso :curso="cursoSeleccionado" />
      <div class="row mt-2 ">
        <div class="col-md-8 offset-md-4  text-right">
          <button class="btn btn-link" @click="iniciarModificacionCurso(item)">
            Modificar
          </button>
        </div>
      </div>
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
              ><span v-if="listaSemanas" class="badge badge-pill badge-info">{{
                listaInscripciones.length
              }}</span>
              Alumnos</a
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
              ><span v-if="listaSemanas" class="badge badge-pill badge-info">{{
                listaSemanas.length
              }}</span>
              Semanas
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
                  <th scope="col">#</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Clase</th>
                  <th scope="col"></th>
                </tr>
                <tbody v-for="(row, index) in listaSemanas" :key="row.id">
                  <tr :class="index % 2 == 0 ? 'bg-secondary' : ''">
                    <td>{{ row.numero_periodo }}</td>
                    <td class="font-weight-bold">
                      {{ row.fecha_semana_clase_format }}
                    </td>
                    <td>{{ row.clase }}</td>
                    <td>{{ row.modulo }}</td>
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
     <Popup id="popup_iniciar" :show_button_close="true">
      <div slot="header">                    
            <h4>Iniciar taller </h4>          
      </div>
      <div slot="content" >      
      <table class="table text-left">
        <tr>
            <td>Taller</td>
            <td><strong>
            {{cursoSeleccionado.especialidad}}</strong></td>
        </tr>
        <tr>
          <td>Confirmados</td>
          <td><span class="h6 badge badge-primary text-white"> {{alumnosConfirmados}}</span></td>
        </tr>
        <tr>
          <td>Fecha de Inicio</td>
          <td><datepicker
              name="fecha_inicio"
              v-model="fecha_inicio_real"
              input-class="form-cntrol"
              :format="'yyyy-MM-dd'"
              :bootstrap-styling="true"
              :language="es"              
            ></datepicker></td>
        </tr>
      </table>    
      </div>
      <div slot="footer">        
        <button class="btn btn-success" @click="confirmarIniciarTaller()">
          Confirmar inicio
        </button>
      </div>
    </Popup>-
    <Popup id="popup_curso" :show_button_close="true">
      <div slot="header">
        <div class="row text-left">
          <div class="col-md-2">
            <img
              v-if="cursoSeleccionado.foto_curso"
              class="img-fluid rounded border border-gray"
              width="150"
              :src="cursoSeleccionado.foto_curso"
              alt="Especialidad"
            />            
          </div>
          <div class="col">
            <h4>{{cursoSeleccionado.especialidad}}</h4>
          </div>
        </div>
      </div>
      <div slot="content" class="text-left mt-0" >        
        <div class="form-group">
          <label>
            Dias
            <span class="text-danger">*</span>
          </label>
          <div class="form-control text-center">
            <span
              v-for="item in listaDias"
              v-bind:key="item.id"
              style="margin-left: 10px"
            >
              <input
                type="checkbox"
                :id="`checkbox_${item.id}`"
                v-model="item.checked"
              />
              <label :for="`checkbox_${item.id}`" class="font-weight-bold">
                {{ item.nombre }}</label
              >
            </span>
          </div>
        </div>

        <div class="form-row">
          <div
            class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6"
          >
            <label>
              Horario
              <span class="text-danger">*</span>
            </label>
            <select
              v-model="cursoSeleccionado.cat_horario"
              class="form-control"
              placeholder="horario"
              required
            >
              <option
                v-for="item in listaHorarios"
                v-bind:value="item.id"
                v-bind:key="item.id"
              >
                {{ item.nombre }}
              </option>
            </select>
          </div>
          <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <label>
              Fecha Inicio
              <span class="text-danger">*</span>
            </label>
            <datepicker
              name="fecha_inicio_previsto"
              v-model="cursoSeleccionado.fecha_inicio_previsto"
              input-class="form-control"
              :format="'yyyy-MM-dd'"
              :bootstrap-styling="true"
              :language="es"
              required
            ></datepicker>
          </div>
        </div>

        <div class="form-row">
          <div
            class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6"
          >
            <label>
              Costo Colegiatura
              <span class="text-danger">*</span>
            </label>
            <input
              type="number"
              v-model="cursoSeleccionado.costo_colegiatura_base"
              class="form-control"
              placeholder="Costo Colegiatura"
              min="0"
              required
            />
          </div>
          <div
            class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6"
          >
            <label>
              Costo Inscripción
              <span class="text-danger">*</span>
            </label>
            <input
              type="number"
              v-model="cursoSeleccionado.costo_inscripcion_base"
              class="form-control"
              placeholder="Costo Inscripción"
              min="0"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label> Nota </label>
          <input
            type="text"
            v-model="cursoSeleccionado.nota"
            class="form-control"
          />
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-primary" @click="guardar()">
          Modificar
        </button>
      </div>
    </Popup>
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
    TablaAlumnosConfirmar
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
      listaDias: [],
      listaHorarios: [],
      es: es,
      loader: false,
      isModificacion: false, 
      alumnosConfirmados:0,
      fecha_inicio_real:new Date()
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
      console.log("Cargar semanas " + this.uidCurso);
      if (this.uidCurso) {
        this.listaSemanas = await this.getAsync(
          `${URL.PERIODOS_CURSO}/curso/${this.uidCurso}`
        );
      }
    },
    async cargarMaterias() {
      console.log("Cargar materuias " + this.uidCurso);
      if (this.uidCurso) {
        this.listaSemanas = await this.getAsync(
          `${URL.MATERIAS_ESPECIALIDAD}/${
            this.cursoSeleccionado.cat_especialidad
          }`
        );
      }
    },
    iniciarTaller(row) {
      //obtener alumnos confirmados
      this.alumnosConfirmados = this.listaInscripciones.filter(item=>item.confirmado==true).length;
      this.fecha_inicio_real = this.cursoSeleccionado.fecha_inicio_previsto;

      $("#popup_iniciar").modal("show");
    },
    async confirmarIniciarTaller(){
       
      const res = await this.postAsync(`${URL.CURSO}/iniciar`,{uid:this.cursoSeleccionado.uid,genero:this.usuarioSesion.id});
      console.log("respuesta "+res);
    },
    async iniciarModificacionCurso(row) {
      this.input = Object.assign({}, row);

      await this.cargarCatalogos();
      console.log(this.input);

      this.cursoSeleccionado.dias_array.forEach(i => {
        this.listaDias.forEach(e => {
          if (e.id == i) {
            e.checked = true;
          }
        });
      });
      $("#popup_curso").modal("show");
    },

    async cargarCatalogos() {
      let lDias = await this.getAsync(
        `${URL.DIAS_BASE}/${this.usuarioSesion.id_empresa}`
      );

      this.listaDias = lDias.map(e => {
        return { checked: false, ...e };
      });

      this.listaHorarios = await this.getAsync(
        `${URL.HORARIOS_BASE}/${this.usuarioSesion.id_empresa}`
      );
    },
    async guardar() {
      console.log("@guardar");

      const diasArray = this.listaDias.reduce(function (filtered, item) {
        if (item.checked) {
          filtered.push(item.id);
        }
        return filtered;
      }, []);

      this.cursoSeleccionado.dias_array = diasArray;
      this.cursoSeleccionado.genero = this.usuarioSesion.id;
      //this.cursoSeleccionado.co_empresa = this.usuarioSesion.id_empresa;
      //this.cursoSeleccionado.co_sucursal = this.usuarioSesion.co_sucursal;

      if (!this.validarDatos()) {
        return;
      }

      this.loader = true;      
      console.log(`inciando ${this.operacion} de curso ${this.cursoSeleccionado.id}`);

      const respuesta = await this.putAsync(`${URL.CURSO}/${this.cursoSeleccionado.id}`, this.cursoSeleccionado);       
     
      if (respuesta) {
        this.$notificacion.info(
          `Curso  modificado`, `Se modificado el curso`
        );
        await this.init();
        $("#popup_curso").modal("hide");        
      } else {
        this.$notificacion.error(
          "Ups!",
          "Algo sucedió al intentar guardar el curso, ponte en contacto con soporte técnico."
        );
      }
      this.loader = false;
    },  
    validarDatos() {
      let val = true;     

      if (this.cursoSeleccionado.dias_array.length == 0) {
        this.$notificacion.error("Dias", "Selecciona al menos 1 día a impartir");
        val = false;
      }

      if (this.cursoSeleccionado.cat_horario == -1) {
        this.$notificacion.error("Horario", "Selecciona los el horario");
        val = false;
      }

      if (
        this.cursoSeleccionado.fecha_inicio_previsto == null ||
        this.cursoSeleccionado.fecha_inicio_previsto == ""
      ) {
        this.$notificacion.error(
          "Fecha de inicio",
          "Selecciona la fecha de inicio"
        );
        val = false;
      }

      if (this.cursoSeleccionado.costo_colegiatura_base == 0) {
        this.$notificacion.error(
          "Colegiatura",
          "Escribe el costo de la colegiatura"
        );
        val = false;
      }

      if (this.cursoSeleccionado.costo_inscripcion_base == 0) {
        this.$notificacion.error(
          "Inscripción",
          "Escribe el costo de la inscripción"
        );
        val = false;
      }
      return val;
    },
  }
};
</script>

<style scoped></style>
