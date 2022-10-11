<template>
  <div class="container">
    <!--<div class="row mb-1">
      <div class="col-auto mr-auto">
        <button class="btn btn-primary">
          <i class="fas fa-plus text-gray"></i>Inscribir a otra especialidad
        </button>
      </div>
    </div>-->
    <span v-for="item in lista" :key="item.id" :disabled="loader">
      <div class="card border-light border-bottom-2 mb-3">
        <div class="card-header bg-transparent border-light">          
          <div class="row">
            <div class="col-2">
              <img
                v-if="item.foto_curso"
                class="img-fluid rounded"
                :src="item.foto_curso ? item.foto_curso : '...'"
              />
              <span v-else class="border border-primary"></span>
            </div>
            <div class="col">
              <h3>{{ item.especialidad }}</h3>
              <small>{{item.duracion_curso}} semanas</small>
            </div>
            <div class="col-2 ">              
              <PopupCambiarTallerAlumno :idAlumno="item.id_alumno" :callback="regresarCatalogoAlumnos" />
            </div>
            <div class="col-2 ">              
              <PupupBajaAlumno :idAlumno="item.id_alumno" :callback="regresarCatalogoAlumnos" />
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
                <span class="text-muted">Día</span> {{ item.dias }}
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
                <span
                  @click="iniciarModificacion(item)"
                  class="pointer font-weight-bold"
                  >${{ item.costo_colegiatura }}</span
                >
                <button
                  @click="iniciarModificacion(item)"
                  class="btn btn-link btn-sm"
                >
                  <i class="fa fa-edit"></i> Modificar
                </button>
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
        <div class="card-footer bg-light">
          <div class="row">
            <div class="col">
              <i class="fa fa-user"></i>
              <span >Inscribió</span> {{ item.inscribio ? item.inscribio : "-" }}
              <!--Semana Actual: <strong>{{ item.semana_actual }}</strong> de
              <strong>{{ item.duracion_curso }}</strong>-->
            </div>
            <div class="col">
              <i class="fa fa-user"></i>
              <span >Registró {{item.nombre_genero}}</span>                
              <!--Pagado completo: <strong>{{ item.pagado ? "SI" : "NO" }}</strong>-->
            </div>
          </div>
          <div v-if="item.nota_inscripcion" class="row">
            <div class="col bg-yellow border border-1">
              <p class="small font-weight-bold mt-1">
                <i>Nota: {{ item.nota_inscripcion }}</i>
              </p>
            </div>
          </div>
        </div>
      </div>
    </span>

    <!-- modificar colegiatura -->
    <Popup id="popup_modificar_colegiatura" :show_button_close="true">
      <div slot="header">
        <h4>Modificar Colegiatura </h4>
      </div>
      <div slot="content" class="text-left">
         <div class="row mb-2">
          <div class="col-4">
            <strong>Taller:</strong>
          </div>
          <div class="col">
            {{input.especialidad}}
          </div>
        </div>

        <div class="row mb-2" >
          <div class="col-4">
            <strong>Alumno:</strong>
          </div>
          <div class="col">
            {{input.alumno}} {{input.alumno}}
          </div>
        </div>

         <div class="row">
          <div class="col-4">
            <strong>Colegiatura :</strong>
          </div>
          <div class="col">
            <div class="input-group border border-success">
              <div class="input-group-prepend">
                <span class="input-group-text text-success" id="basic-addon1"
                  >$</span
                >
              </div>
              <input
                type="number"
                v-model="input.costo_colegiatura"
                class="form-control font-weight-bold"
                placeholder="Costo Colegiatura"
                min="0"
                required                
              />              
            </div>
            <small class="text-gray"> costo actual <strong> ${{costo_colegiatura_anterior}} </strong> </small>
          </div>
        </div>
        
        <div class="form-group">
          <label for="inputFechaLimitePago">Nota </label>
          <textarea
            rows="2"
            v-model="input.nota"
            class="form-control"
            placeholder="Notas "
          />
        </div>
        
      </div>

      <div slot="footer">
        <button
          class="btn btn-block btn-primary"
          :disabled="loader"
          v-on:click="modificar()"
        >
          <Loader :loading="loader" :mini="true" />
          Guardar
        </button>
      </div>
    </Popup>
    <!-- fin - modificar colegiatura-->
  </div>
</template>

<script>
import Vue from "vue";
import { operacionesApi } from "../helpers/OperacionesApi";
import { getUsuarioSesion } from "../helpers/Sesion";
import AlumnoModel from "../models/AlumnoModel";
import Datepicker from "vuejs-datepicker";
import URL from "../helpers/Urls";
import { en, es } from "vuejs-datepicker/dist/locale";
import Loader from "../components_utils/Loader";
import moment from "moment";
import Popup from "../controller/Popup";
import PupupBajaAlumno from "../components/fragmentos/baja/pupupBajaAlumno.vue";
import PopupCambiarTallerAlumno from "../components/fragmentos/inscripciones/PopupCambiarTallerAlumno.vue";


export default {
  name: "datos-alumno",
  components: {
    Datepicker,
    Loader,
    Popup,
    PupupBajaAlumno,
    PopupCambiarTallerAlumno
},
  props: ["lista"],
  mixins: [operacionesApi],
  data() {
    return {
      uid: "",
      usuarioSesion: {},
      input: AlumnoModel,
      costo_colegiatura_anterior:0,
      listaInscripciones: [],
      generoAlumno: { id: -1, nombre: "", foto: "" },
      es: es,
      loader: false,
      isModificacion: false,
    };
  },
  mounted() {
    console.log("##### MOUNTED CURSO ALUMNOS  ####");
    this.usuarioSesion = getUsuarioSesion();
    this.uid = `${this.$route.params.uid}`;
    this.init();
  },
  watch: {
    lista: function (newId, oldId) {
      console.log(
        `Observador para cambios de valor de la lista de curso ${newId} - ${oldId}`
      );
    },
  },
  methods: {
    async init() {
      
      //this.listaInscripciones=this.lista;

    },
    async cargarCursosAlumno() {
      if (this.uid) {
        this.listaInscripciones = await this.getAsync(
          `${URL.INSCRIPCION_BASE}/alumno/${this.uid}`
        );
      }
    },
 
    iniciarModificacion(row) {      
    
      this.input = Object.assign({}, row);

      this.costo_colegiatura_anterior = row.costo_colegiatura;

      $("#popup_modificar_colegiatura").modal("show");

      console.log("finalizo")

    },
    async modificar() {

        if(this.costo_colegiatura_anterior == this.input.costo_colegiatura){
          Vue.prototype.$notificacion.warn(
          "No hay cambios",
            "Modifica el costo de la colegiatura."
        );
        return;  
        }

      if (
        this.input.costo_colegiatura == "" ||
        this.input.costo_colegiatura == 0
      ) {
        Vue.prototype.$notificacion.error(
          "Escribe el costo de la colegiatura",
          "El valor de costo de colegiatura es requerido."
        );
        return;
      }

      if (this.input.nota == "" || this.input.nota == null) {
        Vue.prototype.$notificacion.error(
          "Nota requerida",
          "Es necesario escribir una nota de referencia."
        );
        return;
      }

      const data = {
        costo_colegiatura: this.input.costo_colegiatura,
        nota: this.input.nota,
        genero: this.usuarioSesion.id,
      };

      const resp = await this.putAsync(
        `${URL.INSCRIPCION_BASE}/${this.input.id_inscripcion}`,
        data
      );

      if (resp) {        
        Vue.prototype.$notificacion.info(
          "Colegiatura Modificada",
          "Se modificó la colegiatura de " + this.input.nombre
        );
              
        
        //await  this.cargarCursosAlumno();
        this.lista = await this.getAsync(
          `${URL.INSCRIPCION_BASE}/alumno/${this.input.uid}`
        );

         $("#popup_modificar_colegiatura").modal("hide");
      }
    },
    getFoto() {
      let elemento = this.listaGeneroAlumno.find(
        (e) => e.id == this.input.cat_genero
      );
      return elemento.foto;
    },
    regresarCatalogoAlumnos(row) {
      this.$router.go(-1);
      //this.$router.push({ name: "CatAlumno", params: {  } });
    },
  },
};
</script>

<style scoped></style>
