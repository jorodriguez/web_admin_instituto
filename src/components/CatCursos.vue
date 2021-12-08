<template>
  <div class="cat_curso">
    <h1>Cursos ({{ lista != [] ? lista.length : 0 }})</h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>
    <div class="row">
      <div class="col-auto mr-auto">
        <router-link to="/principal" class="btn btn-secondary btn-lg">
          <i class="fas fa-arrow-circle-left text-gray"></i>
        </router-link>
        <button
          type="button"
          class="btn btn-primary btn-lg"
          v-on:click="nuevo()"
        >
          Nuevo Curso
        </button>
      </div>
    </div>

    <br />

    <Popup id="popup_curso" :show_button_close="true">
      <div slot="header">
        Registrar Curso en <strong> {{ usuarioSesion.nombre_sucursal }}</strong>
      </div>
      <div slot="content" class="text-left">
        <div class="form-group">
          <label>
            Especialidad
            <span class="text-danger">*</span>
          </label>
          <select
            v-model="input.cat_especialidad"
            class="form-control"
            placeholder="Especialidad"
            required
          >
            <option
              v-for="grupo in listaEspecialidades"
              v-bind:value="grupo.id"
              v-bind:key="grupo.id"
            >
              {{ grupo.nombre }}
            </option>
          </select>
        </div>

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
              <input type="checkbox" id="checkbox" v-model="item.checked" />
              <label class="font-weight-bold"> {{ item.nombre }}</label>
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
              v-model="input.cat_horario"
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
              v-model="input.fecha_inicio_previsto"
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
              v-model="input.costo_colegiatura"
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
              v-model="input.costo_inscripcion"
              class="form-control"
              placeholder="Costo Inscripción"
              min="0"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label> Nota </label>
          <input type="text" v-model="input.nota" class="form-control" />
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-primary" @click="guardar()">Guardar</button>
      </div>
    </Popup>

    <div class="card">
      <div class="card-body">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Buscar por nombre.."
            v-model="criterioNombre"
            v-on:keyup.enter="buscarPorNombre()"
            aria-label="Buscar por nombre.."
          />
          <div class="input-group-append">
            <button
              class="btn btn-outline-secondary"
              type="button"
              v-on:click="buscarPorNombre()"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <div v-if="loader" class="mx-auto">
          <Loader :loading="loader" :mini="true" />
        </div>

        <div
          class="row border-bottom border-top"
          v-for="item in lista"
          :key="item.id"
        >
          <div class="col-2">
            <img
              class="mr-3 img-fluid rounded"
              width="150"
              :src="item.foto_curso"
              alt="Especialidad"
            />
          </div>
          <div class="col">
            <div class="text-left">
              <h3 class="mt-0">{{ item.especialidad }}</h3>
              <p class="card-text text-sm">
                <span class="text-muted">Fecha de inicio</span>
                {{
                  item.fecha_inicio_format
                    ? item.fecha_inicio_format
                    : ` previsto ${item.fecha_inicio_previsto_format}`
                }}
              </p>
              <p class="card-text text-sm">
                <span class="text-muted">Día(s)</span> {{ item.dias }}
                <span class="text-muted"> Horario</span> {{ item.horario }}
              </p>
              <p class="card-text text-sm">
                <span class="text-muted">Inscripción:</span>
                <span class="font-weight-bold"
                  >${{ item.costo_inscripcion_base }}</span
                >
              </p>
              <p class="card-text text-sm">
                <span class="text-muted">Colegiatura:</span>
                <span class="font-weight-bold"
                  >${{ item.costo_colegiatura_base }}</span
                >
              </p>
              <span class="text-muted">Alumnos Inscritos :</span>
              <span class="badge badge-pill badge-primary">{{
                item.inscripciones
              }}</span>
            </div>
            <div class="card-footer text-right">
              <button class="btn btn-link">Agregar alumno</button>
              <button class="btn btn-link">Modificar</button>
              <button class="btn btn-link">Eliminar</button>
            </div>
          </div>

          <div v-if="loader" class="mx-auto">
            <Loader :loading="loader" :mini="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { operacionesApi } from "../helpers/OperacionesApi";
import { getUsuarioSesion } from "../helpers/Sesion";
import Datepicker from "vuejs-datepicker";
import URL from "../helpers/Urls";
import Emit from "../helpers/Emit";
import { validacionDatosAlumno } from "../helpers/AlumnoValidacion";
import { en, es } from "vuejs-datepicker/dist/locale";
import Loader from "../components_utils/Loader";
import moment from "moment";
import Popup from "../controller/Popup";
import InscripcionAlumno from "./InscripcionAlumno.vue";

export default {
  name: "cat-cursos",
  components: {
    Datepicker,
    Loader,
    Popup,
    InscripcionAlumno,
  },
  mixins: [operacionesApi],
  data() {
    return {
      criterioNombre: "",
      operacion: "",
      usuarioSesion: {},
      input: {
        cat_especialidad: -1,
        cat_dia: -1,
        cat_horario: -1,
        co_empresa: -1,
        co_sucursal: -1,
        costo_colegiatura_base: 0,
        costo_inscripcion_base: 0,
        nota: "",
        fecha_inicio_previsto: new Date(),
        fecha_fin_previsto: new Date(),
        genero: 0,
      },
      lista: [],
      listaEspecialidades: [],
      listaDias: [],
      listaHorarios: [],
      es: es,
      loader: false,
      isModificacion: false,
    };
  },
  mounted() {
    console.log("##### CATALOGO DE CURSOS  ####");
    this.usuarioSesion = getUsuarioSesion();
    console.log(`catalogo de cursos`);
    this.init();
  },
  methods: {
    async init() {
      await this.cargarCursos();
    },
    async cargarCursos() {
      this.lista = await this.getAsync(
        `${URL.CURSO}/sucursal/${this.usuarioSesion.co_sucursal}`
      );
    },
    async nuevo() {
      let lDias = await this.getAsync(
        `${URL.DIAS_BASE}/${this.usuarioSesion.id_empresa}`
      );

      this.listaDias = lDias.map((e) => {
        return { checked: false, ...e };
      });

      this.listaHorarios = await this.getAsync(
        `${URL.HORARIOS_BASE}/${this.usuarioSesion.id_empresa}`
      );

      this.listaEspecialidades = await this.getAsync(
        `${URL.ESPECIALIDADES_BASE}/${this.usuarioSesion.id_empresa}`
      );
      $("#popup_curso").modal("show");
    },
    async guardar() {
      console.log("@guardar");

      const diasArray = this.listaDias.reduce(function(filtered, item) {
        if (item.checked) {          
          filtered.push(item.id);
        }
        return filtered;
      }, []);

  console.log(diasArray);
      //let seleccion = this.listaDias.filter(e=>{e.checked});

      //this.input.dias = seleccion.map(e=>e.id);
      this.input.dias = diasArray;
      this.input.genero = this.usuarioSesion.id;
      this.input.co_empresa = this.usuarioSesion.id_empresa;
      this.input.co_sucursal = this.usuarioSesion.co_sucursal;

      this.loader = true;
      console.log("inciando guardado de curso " + this.input.id);

      const respuesta = await this.postAsync(`${URL.CURSO}`, this.input);

      console.log(respuesta);
      if (respuesta) {
        this.$notificacion.info(`Curso registrado`, `Se registró el curso`);
        this.cargarCursos();
        //this.$root.$emit(Emit.ACTUALIZAR_ALUMNO, Emit.ACTUALIZAR_ALUMNO);
      } else {
        this.$notificacion.error(
          "Ups!",
          "Algo sucedió al intentar guardar el curso, ponte en contacto con soporte técnico."
        );
      }
      this.loader = false;
    },
  },
};
</script>

<style scoped></style>
