<template>
  <div class="datos_alumno">
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
        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label> Escolaridad </label>
          <select
            v-model="input.cat_escolaridad"
            class="form-control"
            placeholder="Escolaridad"
          >
            <option
              id="selectEscolaridad"
              v-for="escolaridad in listaEscolaridad"
              v-bind:value="escolaridad.id"
              v-bind:key="escolaridad.id"
            >
              {{ escolaridad.nombre }}
            </option>
          </select>
        </div>
        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>Ocupación</label>
          <input
            type="text"
            v-model="input.ocupacion"
            class="form-control"
            placeholder=""
          />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label> Tutor(a) </label>
          <input
            type="text"
            v-model="input.tutor"
            class="form-control"
            placeholder="Nombre del padre o tutor"
          />
        </div>
        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>Teléfono del tutor(a)</label>
          <input
            type="text"
            v-model="input.telefono_tutor"
            class="form-control"
            placeholder="Teléfono"
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
  props: ["uuidAlumno"],
  mixins: [operacionesApi],
  data() {
    return {
      uid:"",
      usuarioSesion: {},
      input: AlumnoModel,
      listaGeneroAlumno: [],
      listaEscolaridad: [],
      generoAlumno: { id: -1, nombre: "", foto: "" },
      es: es,
      loader: false,
      isModificacion: false,
      cargado:false
    };
  },
  mounted() {
    console.log("##### MOUNTED DATOS ALUMNO  ####");
    this.usuarioSesion = getUsuarioSesion();    
    console.log(`DATOS ALUMNO ${this.$route.params.uid}`);
    this.uid = `${this.$route.params.uid}`;
    this.init();
  },
  methods: {
    async init() {
      if(this.uid && !this.cargado){
         
         console.log("==== CARGANDO DATOS DE ALUMNO  " +  JSON.stringify(this.uid));
         
         this.listaGeneroAlumno = await this.getAsync(`${URL.GENERO_ALUMNO}`);
          
         this.listaEscolaridad = await this.getAsync(`${URL.ESCOLARIDAD}`);          
          
         this.input = await this.getAsync(`${URL.ALUMNOS_BASE}/id/${this.uid}`);

         this.cargado = true;
         
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
      console.log("inciando id alumno "+this.input.id);

      const respuesta = await this.putAsync(`${URL.ALUMNOS_BASE}/${this.input.id}`, values);

      console.log(respuesta);
      if (respuesta) {
        this.$notificacion.info(
          `Inscripción realizada`,`Se modificó el alumno`
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
        cat_genero: this.input.cat_genero,
        nombre: this.input.nombre,
        apellidos: this.input.apellidos,
        direccion: this.input.direccion,
        telefono: this.input.telefono,
        fecha_nacimiento: this.input.fecha_nacimiento,
        nota: this.input.nota,        
        foto: this.getFoto(), 
        cat_escolaridad: this.input.cat_escolaridad,
        ocupacion: this.input.ocupacion,
        originario: this.input.originario,
        tutor: this.input.tutor,
        telefono_tutor: this.input.telefono_tutor,       
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
