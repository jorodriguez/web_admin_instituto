<template>
  <div class="cat_alumno">
    <h1>Confirmar Inscripciòn ({{ lista != [] ? lista.length : 0 }})</h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>
    <div class="row">
      <div class="col-auto mr-auto">
        <router-link to="/principal" class="btn btn-secondary btn-lg">
          <i class="fas fa-arrow-circle-left text-gray"></i>
        </router-link>

      </div>
      <div class="col-auto">
       
      </div>
    </div>

    <br />
    
    <!-- </form>-->

    <div class="card">
      <div class="card-body">
        <div class="input-group mb-3 text-right">
          
        
        </div>

        <div v-if="loader" class="mx-auto">
            <Loader :loading="loader" :mini="true" />
        </div>

        <div class="row">                 
          <div
            class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 mt-2"
            v-for="row in lista"
            :key="row.id"            
          >
            <div class="card border-light">
              <div class="d-flex justify-content-end ">
                <div class="btn-group" role="group">
                  <button
                    id="btnGroupDrop1"
                    type="button"
                    class="btn btn-link btn-block btn-sm dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  ></button>
                  <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">                  
                    <button
                      class="dropdown-item"
                      @click="select(row, 'DELETE')"
                      href="#"
                    >
                      <i class="fas fa-user-minus"></i> Iniciar Baja
                    </button>
                  </div>
                </div>
              </div>

              <img
                class="card-img-top pointer rounded-circle mx-auto"
                style="width:100px"                
                :src="row.foto"
                alt="Foto"
                @click="verPerfil(row)"
                title="Cambiar la foto"
              />

              <div class="card-body pointer" @click="verPerfil(row)" >
                <h4 class="card-text">
                  {{ row.alumno }}                  
                </h4>
                <h5 class="card-text small">
                  {{ row.apellidos }}
                </h5>
                <h6
                  :style="row.color_especialidad ? 'background-color:' + row.color_especialidad : ''"
                  class="badge badge-info text-wrap"
                >
                  {{ row.especialidad }}
                </h6>                
                <h5><span class="font-weight-normal">Inicia</span> {{ row.fecha_inicio_previsto_format }}</h5>                
                <h5><span class="font-weight-normal"></span>{{row.dias}} turno {{ row.horario }}</h5>
              </div>
            </div>
          </div>

          

          <!-- Mensajes para la busqueda y carga-->
          <div v-if="criterioNombre != '' && lista.length == 0" class="mx-auto">
            <p class="text-muted ">Ningún resultado</p>
          </div>
          <div
            v-if="criterioNombre == '' && lista.length == 0 && !loader"
            class="mx-auto"
          >
            <p class="text-muted ">Oprime ENTER para listar todo</p>
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
   
   
  }
};
</script>

<style scoped></style>
