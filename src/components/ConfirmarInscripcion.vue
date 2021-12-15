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
          <table class="table text-left">          
            <tr>                
                <th>Alumno</th>
                <th>Teléfono</th>
                <th></th>
            </tr>
            <tbody 
              v-for="row in listaInscripciones"
              :key="row.id">
                <tr>                
                  <td>{{row.alumno}} {{row.apellidos}}</td>
                  <td class="font-weight-bold">{{row.telefono}}</td>
                  <td class="text-right">                  
                    <span v-if="row.confirmado">
                        <i class="fa fa-check-circle text-success"></i>                    
                        <span class="text-success"> Confirmado el {{row.fecha_confirmado}}</span>                         
                        <!--<span @click="seleccionar(row,'NO_CONFIRMAR')" class="text-danger pointer" title="Quitar confirmación"><i class="fa fa-times "></i></span>  -->
                    </span>
                    <span v-else>
                      <button class="btn btn-success " @click="seleccionar(row,'CONFIRMAR')">
                        Confirmar
                      </button>                      
                    </span>
                    <button class="btn btn-light" @click="seleccionar(row,'NO_CONFIRMAR')" >
                        Cancelar
                    </button>
                  </td>
                </tr>                
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- confirmar inscripcion -->
    <Popup id="popup_confirmar_inscripcion" :show_button_close="true">
      <div slot="header">
          <span v-if="operacion == 'CONFIRMAR'">Confirmar inscripción</span> 
          <span v-if="operacion == 'NO_CONFIRMAR'" class="text-danger">Cancelar inscripción</span>
      </div>
      <div slot="content">
        <div class="row text-left">
          <table class="table">
            <tr>  
              <td>Alumno</td>            
              <td>
                <span class="font-weight-bold">{{ alumno.alumno }} {{alumno.apellidos}}</span>
                <span v-if="alumno.confirmado" class="text-success">
                  <i class="fa fa-check-circle text-success"></i>                    
                 Confirmado el {{alumno.fecha_confirmado}}
                 </span>                                         
              </td>
            </tr>
            <tr>  
              <td>Teléfono</td>            
              <td>
                <span class="font-weight-bold">{{ alumno.telefono }}</span>
              </td>
            </tr>
            <tr>  
              <td>Taller</td>            
              <td>
                <span class="font-weight-bold">{{ alumno.especialidad }}</span>
              </td>
            </tr>
            <tr>
              <td>Inicia</td>
              <td>
                <span class="font-weight-bold">
                  {{
                    alumno.fecha_inicio_format
                      ? alumno.fecha_inicio_format
                      : ` previsto ${alumno.fecha_inicio_previsto_format}`
                  }}
                </span>
              </td>
            </tr>
            <tr>
            <td>Dias</td>
              <td>
                <span class="font-weight-bold">{{ alumno.dias }}</span>
                -<span class="font-weight-bold">{{ alumno.horario }}</span>
              </td>
            </tr>
            <tr>           
            
            <tr>
              <td>Nota</td>
              <td>
                <textarea v-model="alumno.nota" class="form-control" rows="2">
                </textarea>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div slot="footer">
        <button v-if="operacion == 'CONFIRMAR'" class="btn btn-success"  @click="confirmarInscripcion(true)">Confirmar</button>
        <button v-if="operacion == 'NO_CONFIRMAR'" class="btn btn-dark" @click="confirmarInscripcion(false)">Cancelar inscripción</button>
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

export default {
  name: "confirmar-inscripcion",
  components: {
    Datepicker,
    Loader,
    Popup
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
    },
    seleccionar(row,operacion){
        console.log("iniciar confirmacion");
        this.alumno =  Object.assign({},row);
        this.operacion = operacion;        
        this.alumno.nota = '';
        $("#popup_confirmar_inscripcion").modal("show");        
    },
    async confirmarInscripcion(confirmacion) {
      console.log("@confirmarInscripcion "+confirmacion+" alumno "+this.alumno.id_alumno);

      this.loader = true;
      const values ={
          confirmacion:confirmacion,
          nota:this.alumno.nota,
          genero:this.usuarioSesion.id
      };  

      const respuesta = await this.putAsync(`${URL.INSCRIPCION_BASE}/confirmar/${this.alumno.id_alumno}`, values);

      console.log(respuesta);
      if (respuesta) {
        this.$notificacion.info(`Inscripción confirmada`,`${this.alumno.nombre} ${this.alumno.apellidos} fué confirmado para el taller ${this.alumno.especialidad} `);
        await this.cargarAlumnosCurso();
        //this.$root.$emit(Emit.ACTUALIZAR_ALUMNO, Emit.ACTUALIZAR_ALUMNO);
      } else {
        this.$notificacion.error("Ups!","Algo sucedió al intentar confirmar la inscripción, ponte en contacto con soporte técnico.");  
      }
      this.loader = false;
    },
  },
};
</script>

<style scoped></style>
