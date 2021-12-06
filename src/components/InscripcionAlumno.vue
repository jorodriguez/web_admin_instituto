<template>
  <div class="cat_alumno">
    <h1>Inscripción Alumno</h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>
    <div class="row">
      <div class="col-auto mr-auto">
        <router-link to="/CatAlumno" class="btn btn-secondary btn-lg">
          <i class="fas fa-arrow-circle-left text-gray"></i>
        </router-link>
        <button
          type="button"
          class="btn btn-primary btn-lg"
          v-on:click="nuevo()"
        >
          Nueva Inscripción
        </button>
      </div>
      <div class="col-auto"></div>
    </div>

    <br />

    <div class="container text-left" :disabled="loader">
      <div class="form-row">
        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>Alumno<span class="text-danger">*</span></label>
          <input
            type="text"
            v-model="input.nombre"
            class="form-control"
            placeholder="Nombre"
            required
            autofocus
          />
        </div>

        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>Apellidos<span class="text-danger">*</span></label>
          <input
            type="text"
            v-model="input.apellidos"
            class="form-control"
            placeholder="Apellidos"
            required
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>Dirección</label>
          <input
            type="text"
            v-model="input.direccion"
            class="form-control"
            placeholder="Dirección "
          />
        </div>
        <div class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>Télefono<span class="text-danger">*</span></label>
          <input
            type="text"
            v-model="input.telefono"
            class="form-control"
            placeholder="(52)"
            required
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>
            Fecha de nacimiento
            <span class="text-danger">*</span>
          </label>
          <datepicker
            name="fecha_nacmiento"
            v-model="input.fecha_nacimiento"
            input-class="form-control"
            :format="'yyyy-MM-dd'"
            :bootstrap-styling="true"
            :language="es"
            required
          ></datepicker>
        </div>
        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>Sexo<span class="text-danger">*</span></label>
          <select
            v-model="input.cat_genero"
            class="form-control"
            placeholder="Grupo"
            required
          >
            <option
              id="selectGeneroAlumno"
              v-for="genero in listaGeneroAlumno"
              v-bind:value="genero.id"
              v-bind:key="genero.id"
              >{{ genero.nombre }}</option
            >
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>
            Especialidad
            <span class="text-danger">*</span>
          </label>
          <select
            v-model="input.cat_especialidad"
            @change="onChangeEspecialidad()"
            class="form-control"
            placeholder="Especialidad"
            required
          >
            <option
              v-for="especialidad in listaEspecialidades"
              v-bind:value="especialidad.id"
              v-bind:key="especialidad.id"
              >{{ especialidad.nombre }}
            </option>
          </select>
        </div>
        <div class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>
            Curso
            <span class="text-danger">*</span>
          </label>          
          <select
            v-model="input.co_curso"                        
            class="form-control"
            placeholder="Grupo"
            required
          >
            <option            
              v-for="curso in listaCurso"
              v-bind:value="curso.id"
              v-bind:key="curso.id"
              >{{ curso.nombre }}</option
            >
          </select>                    
        </div>
      </div>

      <div class="form-row">
        <div class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>
            Colegiatura
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
        <div class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>
            Inscripción
            <span class="text-danger">*</span>
          </label>
          <input
            type="number"
            v-model="input.costo_inscripcion"
            class="form-control"
            placeholder="Costo Inscripcion"
            min="0"
            required
          />
        </div>
      </div>
     
      <div class="form-group ">
        <label for="inputFechaLimitePago">Nota </label>
        <textarea
          rows="2"
          v-model="input.nota"
          class="form-control"
          placeholder="Notas "
        />
      </div>

    
      <button
        class="btn btn-block btn-primary"
        :disabled="loader"
        v-on:click="guardar()"
      >
        <Loader :loading="loader" :mini="true" />
        Guardar
      </button>
      <br />
    </div>
  </div>
</template>

<script>
import { operacionesApi } from "../helpers/OperacionesApi";
import { getUsuarioSesion } from "../helpers/Sesion";
import AlumnoModel from "../models/AlumnoModel";
import Datepicker from "vuejs-datepicker";
import URL from "../helpers/Urls";
import { validacionDatosAlumno } from "../helpers/AlumnoValidacion";
import { en, es } from "vuejs-datepicker/dist/locale";
import Loader from "../components_utils/Loader";
import moment from "moment";

export default {
  name: "inscripcion-alumno",
  components: {
    Datepicker,
    Loader
  },
  mixins: [operacionesApi],
  data() {
    return {
      usuarioSesion: {},
      input: AlumnoModel,
      listaGeneroAlumno: [],
      listaCurso: [],
      listaEspecialidades: [],
      generoAlumno: { id: -1, nombre: "", foto: "" },
      es: es,
      loader: false
    };
  },
  mounted() {
    console.log("##### INSCRIPCION ALUMNO  ####");
    this.usuarioSesion = getUsuarioSesion();
    this.init();
  },
  methods: {
    async init() {   

      this.listaGeneroAlumno = await this.getAsync(`${URL.GENERO_ALUMNO}`);      
      this.listaEspecialidades = await this.getAsync(`${URL.ESPECIALIDADES_BASE}/${this.usuarioSesion.id_empresa}`);      
      console.log("this.listaEspecialidadesvv",JSON.stringify(this.listaEspecialidades));
      
      await this.nuevo();
    },
    async nuevo() {
      console.log("Nuevo");
      this.operacion = "INSERT";
      this.input = {
        id: 0,
        co_sucursal: 0,
        co_grupo: 0,
        nombre: "",
        apellidos: "",
        direccion: "",       
        telefono: "",       
        cat_genero: -1,
        nombre_grupo: "",
        nombre_sucursal: "",
        fecha_nacimiento: null,
        nota: "",      
        costo_inscripcion: "",
        costo_colegiatura: "",
        cat_especialidad:-1,
        fecha_inicio: null,
        fecha_fin: null,        
        foto: "",
        genero: 1
      };

      this.generoAlumno = { id: -1, nombre: "", foto: "" };      
      this.input.fecha_inicio = new Date();      
    },
    async onChangeEspecialidad(event){
      console.log("@onChangeEspecialidad "+this.input.cat_especialidad);
      if(this.input.cat_especialidad){
          this.listaCurso = await this.getAsync(`${URL.CURSO}/${this.usuarioSesion.co_sucursal}/${this.input.cat_especialidad}`);            
          console.log(JSON.stringify(this.listaCurso));
      }else{
        console.log("No va a la db");
        this.listaCurso = [];
      }
    },
    async guardar() {
      console.log("Insertar");

      if (!validacionDatosAlumno(this.input)) {
        console.log("No paso la validacion");
        return;
      }

      this.input.foto = this.getFoto();

      this.input.co_sucursal = this.usuarioSesion.co_sucursal;
      this.input.co_empresa = this.usuarioSesion.id_empresa;
      this.input.genero = this.usuarioSesion.id;
      this.input.fecha_nacimiento = moment(this.input.fecha_nacimiento).format(
        "YYYY-MM-DD"
      );
      this.input.fecha_inscripcion = moment(
        this.input.fecha_inscripcion
      ).format("YYYY-MM-DD");  

      this.loader = true;
      console.log("inciando");
      const respuesta = await this.postAsync(URL.ALUMNOS_BASE, this.input);
      console.log(respuesta);
      if (respuesta) {
        this.$notificacion.info("Registro de alumno", "Se registró el alumno.");
         this.$router.push({ name: "PerfilAlumno", params: { id: respuesta.id } });      
      } else {
        this.$notificacion.error(
          "Ups!",
          "Algo sucedió al intentar guardar el alumno, ponte en contacto con soporte técnico."
        );
      }
      this.loader = false;
    },
   /* modificar() {
      console.log("Modificar el id " + this.input.id);

      //if (!this.validacionGuardarFunction()) {
      if (!validacionDatosAlumno(this.input)) {
        console.log("No paso la validacion");
        return;
      }

      this.put(
        URL.ALUMNOS_BASE + "/" + this.input.id,
        this.input,

        result => {
          this.response = result.data;
          if (this.response != null) {
            console.log("" + this.response);
            //this.mensaje = "Se modificó el alumno";
            this.$notificacion.info(
              "Modificación de alumno",
              "Se actualizarón los datos del alumno."
            );
            
            $("#modal_alumno").modal("hide");
          }
        }
      );
    },*/
   
  }
};
</script>

<style scoped></style>
