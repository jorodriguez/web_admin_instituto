<template>
  <div class="cat_alumno">
    <h1>Taller</h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>
    <div class="row">
      <div class="col-auto mr-auto">
        <router-link to="/CatCurso" class="btn btn-secondary btn-lg">
          <i class="fas fa-arrow-circle-left text-gray"></i>
        </router-link>        
        <button @click="iniciarInscripcion()" :disabled="cursoSeleccionado.inscripciones_cerradas" class="btn btn-success btn-lg ">
          <i class="fa fa-plus"></i> Agregar inscripción
        </button>
      </div>
      <div class="col-auto"></div>
    </div>

    <div class="card mt-2 mb-2 ">
      <RowCurso :curso="cursoSeleccionado" />
      <div class="row mt-2 ">
        <div class="col-md-8 offset-md-4  text-right">
          <button
            v-if="!cursoSeleccionado.activo"
            class="btn btn-link"
            :disabled="cursoSeleccionado.inscripciones_cerradas"
            @click="iniciarModificacionCurso()"
          >
            Modificar          
          </button>        

          <button v-else class="btn btn-link text-danger" :disabled="cursoSeleccionado.inscripciones_cerradas">
            Cancelar curso
          </button>

          <ImprimirListaAlumnos  :uuidCurso="cursoSeleccionado.uid" />


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
              ><span v-if="listaSemanas" class="badge badge-pill badge-info"
                >{{ listaInscripciones.length }}</span
              >
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
                <TablaAlumnos
                  :listaInscripciones="listaInscripciones"
                  :reload="this.cargarAlumnosCurso"
                  :mostrar_acciones="true"
                >
                 <!--<template v-slot="{alumnoRow}"  >                 
                      <PopupBajaAlumno :idAlumno="alumnoRow.id_alumno" :callback="cargarCurso" />
                 </template>
                 -->
                 <span slot="acciones"  >                                
                 
                 
                 </span>
                </TablaAlumnos>
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
                  <th scope="col">Fecha</th>
                  <th scope="col">Semana</th>
                  <th scope="col"></th>
                </tr>
                <tbody v-for="(row, index) in listaSemanas" :key="row.id">
                  <tr :class="index % 2 == 0 ? 'bg-secondary' : ''">                    
                    <td
                      :class="
                        `${row.semana_actual && 'bg-info font-weight-bold'}`
                      "
                    >
                      {{ row.fecha_clase_format }}
                    </td>
                    <td :class="`${row.semana_actual && 'bg-info'}`">
                      Semana {{ row.numero_semana_curso }}
                    </td>
                    <td></td>                    
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
        <h4>Iniciar taller</h4>
      </div>
      <div slot="content">
        <table class="table text-left">
          <tr>
            <td>Taller</td>
            <td>
              <strong> {{ cursoSeleccionado.especialidad }}</strong>
            </td>
          </tr>
          <tr>
            <td>Confirmados</td>
            <td>
              <span class="h6 badge badge-primary text-white">
                {{ alumnosConfirmados }}</span
              >
            </td>
          </tr>
          <!--
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
        --></table>
      </div>
      <div slot="footer">
        <button class="btn btn-success" @click="confirmarIniciarTaller()">
          Confirmar inicio
        </button>
      </div>
    </Popup>

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
            <h4>{{ cursoSeleccionado.especialidad }}</h4>
          </div>
        </div>
      </div>
      <div slot="content" class="text-left mt-0">
        <div class="form-row">
         
          <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <label>
              Fecha Inicio
              <span class="text-danger">*</span>
            </label>
            <datepicker
              name="fecha_inicio_previsto"              
              v-model="cursoSeleccionado.fecha_inicio_previsto"
              input-class="form-control bg-white"              
              :format="'yyyy-MM-dd'"
              :bootstrap-styling="true"
              :language="es"
              required
            ></datepicker>
            <small class="text-gray">{{getNombreDia()}} </small>                        
          </div>
           <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <label>
              Número Semanas
              <span class="text-danger">*</span>
            </label>
             <input
              disabled
              type="number"
              v-model="cursoSeleccionado.numero_semanas"
              class="form-control"
              placeholder="No. semanas del curso"
              min="1"
              required
            />             
          </div>          
        </div>     

        <div class="form-row">
            <div
            class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6"
          >
              <label>
                Hora Inicio
                <span class="text-danger">*</span>
              </label>
              <vue-timepicker
                v-model="cursoSeleccionado.hora_inicio"
                :minute-interval="30"
                :hour-range="[[7, 20]]"
                :hide-disabled-hours="true"
                hour-label="hora"
                minute-label="minuto"
                format="HH:mm"
                placeholder="00:00"                
              ></vue-timepicker>
            </div>
             <div
            class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6"
          >
              <label>
                Hora Fin
                <span class="text-danger">*</span>
              </label>
              <vue-timepicker
                v-model="cursoSeleccionado.hora_fin"
                :min="cursoSeleccionado.hora_inicio"
                :minute-interval="30"
                :hour-range="[[7, 20]]"
                :hide-disabled-hours="true"
                hour-label="hora"
                minute-label="minuto"
                format="HH:mm"
                placeholder="00:00"
              ></vue-timepicker>
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
        <button class="btn btn-primary"  :disabled="loader" @click="guardar()">
          <span v-if="loader" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Modificar
        </button>
      </div>
    </Popup>

    <!-- agregar alumno -->
    <Popup id="popup_inscripcion" :show_button_close="true">
      <div slot="header">
        <h4>Inscripción a {{cursoSeleccionado.especialidad}}</h4>
      </div>
      <div slot="content"  class="text-left ">
        
        <div class="form-row">
          <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
            <label>Alumno<span class="text-danger">*</span></label>
            <input
              type="text"
              v-model="input.nombre"
              class="form-control"
              placeholder="Nombre"
              required
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
          <label>Correo<span class="text-danger">*</span></label>
          <input
            type="text"
            v-model="input.correo"
            class="form-control"
            placeholder="Correo "
          />
        </div>
        <div class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>Télefono/Whatsapp<span class="text-danger">*</span></label>
          <input
            type="text"
            v-model="input.telefono"
            class="form-control"
            placeholder="(52)"
            required
          />
        </div>
      </div>


          <div
            class="form-group form-group"
          >
            <label>Dirección<span class="text-danger">*</span></label>
            <input
              type="text"
              v-model="input.direccion"
              class="form-control"
              placeholder="Dirección "
            />
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
              >
                {{ genero.nombre }}
              </option>
            </select>
          </div>
        </div>

         <div class="form-row ">
        <div class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6 ">
          <label>
            Colegiatura 
            <span class="text-danger">*</span>
          </label>
          <div class="input-group  border border-success ">
            <div class="input-group-prepend ">
              <span class="input-group-text text-success" id="basic-addon1">$</span>
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
        </div>
        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>
            Inscripción 
            <span class="text-danger">*</span>
          </label>
          <div class="input-group  border border-success">
            <div class="input-group-prepend ">
              <span class="input-group-text text-success" id="basic-addon1">$</span>
            </div>
            <input
              type="number"
              v-model="input.costo_inscripcion"
              class="form-control font-weight-bold"
              placeholder="Costo Inscripción"
              min="0"
              required
            />
          </div>
        </div>
      </div>

       <div class="form-group ">
          <label for="inputAsesor">Inscribe </label>
          <select                
            id="inputAsesor"   
            class="form-control"
            placeholder="Inscribe"
            autofocus
            v-model="input.usuario_inscribe"
            required
          >
            <option
              v-for="asesor in listaAsesores"
              v-bind:value="asesor.id"
              v-bind:key="asesor.id"
            >
              {{ asesor.nombre }}
            </option>
          </select>
        </div>

        <div class="form-group mb-0">
          <label for="inputFechaLimitePago">Nota </label>
          <textarea
            rows="1"
            v-model="input.nota"
            class="form-control"
            placeholder="Notas "
          />
        </div>
       

      </div>

      <div slot="footer" >
       <button
        class="btn btn-block btn-primary"
        :disabled="loader"
        v-on:click="guardarInscripcion()"
      >
        <span v-if="loader" class="spinner-border spinner-border-sm"/>
        Guardar
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
import TablaAlumnos from "./fragmentos/inscripciones/TablaAlumnos";
import InscripcionAlumno from "./InscripcionAlumno.vue";
import VueTimepicker from "vue2-timepicker";
//import PopupBajaAlumno from './fragmentos/baja/pupupBajaAlumno.vue'
import ImprimirListaAlumnos from "./fragmentos/curso/ImprimirListaAlumnos.vue";

export default {
  name: "detalle-curso",
  components: {
    Datepicker,
    Loader,
    Popup,
    RowCurso,
    TablaAlumnos,
    InscripcionAlumno,
    VueTimepicker,
    ImprimirListaAlumnos
  //  PopupBajaAlumno
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
      listaAsesores:[],
      es: es,
      loader: false,
      isModificacion: false,
      alumnosConfirmados: 0,
      fecha_inicio_real: new Date(),
      fechaInicioOriginal:undefined,
      listaGeneroAlumno:[],
      input: AlumnoModel,
      generoAlumno: { id: -1, nombre: "", foto: "" },
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
        this.alumnosConfirmados = this.listaInscripciones.filter(
          item => item.confirmado == true
        ).length;
      }
    },
    async cargarCurso() {
      if (this.uidCurso) {
        this.cursoSeleccionado = await this.getAsync(
          `${URL.CURSO}/uid/${this.uidCurso}`
        );
        const fechaParser =  this.cursoSeleccionado.fecha_inicio_previsto;
        this.fechaInicioOriginal = fechaParser;//moment(fechaParser,'yyyy-MM-dd').toDate();
       // this.cursoSeleccionado.fecha_inicio_previsto = moment(fechaParser,'yyyy-MM-dd').toDate();
       this.cursoSeleccionado.fecha_inicio_previsto = new Date(this.cursoSeleccionado.fecha_inicio_previsto+' 00:00:00');
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
   
    
    async iniciarModificacionCurso(row) {
      //this.input = Object.assign({}, row);

      await this.cargarCatalogos();
      console.log(this.input);
      
      $("#popup_curso").modal("show");
    },

    async cargarCatalogos() {
      this.listaDias = await this.getAsync(
        `${URL.DIAS_BASE}/${this.usuarioSesion.id_empresa}`
      );
  
    },
    async guardar() {
      console.log("@guardar");
      
      //this.cursoSeleccionado.dias_array = diasArray;
      //this.cursoSeleccionado.genero = this.usuarioSesion.id;
      //this.cursoSeleccionado.co_empresa = this.usuarioSesion.id_empresa;
      //this.cursoSeleccionado.co_sucursal = this.usuarioSesion.co_sucursal;

      if (!this.validarDatos()) {
        return;
      }

      this.loader = true;
      console.log(
        `inciando ${this.operacion} de curso ${this.cursoSeleccionado.id}`
      );

      //const modificacionFecha = moment(this.fechaInicioOriginal).isSame(this.cursoSeleccionado.fecha_inicio_previsto);
    //  console.log(`fecha inic  ${moment(this.cursoSeleccionado.fecha_inicio_previsto).toDate()}`);      

      const cursoSend ={
            cat_dia:this.cursoSeleccionado.cat_dia,
            hora_inicio:this.cursoSeleccionado.hora_inicio,
            hora_fin:this.cursoSeleccionado.hora_fin,            
            costo_colegiatura_base:this.cursoSeleccionado.costo_colegiatura_base,
            costo_inscripcion_base:this.cursoSeleccionado.costo_colegiatura_base,
            nota :this.cursoSeleccionado.nota,
            numero_semanas:this.cursoSeleccionado.numero_semanas,
            fecha_inicio_previsto: this.cursoSeleccionado.fecha_inicio_previsto,            
            genero : this.usuarioSesion.id
      };

      

      const respuesta = await this.putAsync(
        `${URL.CURSO}/${this.cursoSeleccionado.id}`,
         cursoSend        
      );

      if (respuesta) {
        this.$notificacion.info(`Curso  modificado`, `Se modificado el curso`);
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

      if (this.cursoSeleccionado.cat_especialidad == null) {
        this.$notificacion.error("Especialidad", "Selecciona la especialidad");
        val = false;
      }

      if (this.cursoSeleccionado.numero_semanas == 0 || this.input.numero_semanas == '') {
        this.$notificacion.error("Semanas", "Escriba el número de semanas");
        val = false;
      }

      if (this.cursoSeleccionado.hora_inicio == "" || this.input.hora_fin == "") {
        this.$notificacion.error("Hora de inicio", "Selecciona la hora de inicio y fin");
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

      if (this.cursoSeleccionado.costo_inscripcion_base == '') {
        this.$notificacion.error(
          "Inscripción",
          "Escribe el costo de la inscripción"
        );
        val = false;
      }
      return val;
    },
    verPerfilAlumno(rowAlumno){
    this.$router.push({
          name: "PerfilAlumno",
          params: { uid: rowAlumno.uid },
        });
    },
    async iniciarInscripcion() {
    this.input = {
        id: 0,
        co_sucursal: 0,
        co_curso: this.cursoSeleccionado.id,        
        nombre: "",
        apellidos: "",
        direccion: "",
        telefono: "",
        correo: "",
        cat_genero: -1,
        nombre_grupo: "",
        nombre_sucursal: "",
        fecha_nacimiento: null,
        nota: "",
        costo_inscripcion:this.cursoSeleccionado.costo_inscripcion_base,
        costo_colegiatura:this.cursoSeleccionado.costo_colegiatura_base,
        cat_especialidad: this.cursoSeleccionado.cat_especialidad,
        fecha_inicio: null,
        fecha_fin: null,
        foto: "",       
        usuario_inscribe:-1,
        genero: 1,
      };
         this.listaGeneroAlumno = await this.getAsync(`${URL.GENERO_ALUMNO}`);
         this.listaAsesores = await this.getAsync(
               `${URL.USUARIO_BASE}/asesores/${this.usuarioSesion.co_sucursal}/${this.usuarioSesion.id_empresa}`
          );

          let user = {id:this.usuarioSesion.id,nombre:this.usuarioSesion.nombre};

          this.listaAsesores.unshift(user);
          this.input.usuario_inscribe = this.usuarioSesion.id;
          $("#popup_inscripcion").modal("show");
    },    
    async guardarInscripcion() {
      console.log("@guardar");

      if (!validacionDatosAlumno(this.input, true)) {
        console.log("No paso la validacion");
        return;
      }

      let values = this.getValues();

      this.loader = true;
      console.log("inciando");

      const respuesta = await this.postAsync(URL.INSCRIPCION_BASE, values);

      console.log(respuesta);
      if (respuesta) {
        this.$notificacion.info(
          `Inscripción realizada`,
          `Se registró el alumno`
        );
        console.log(respuesta);

        await this.cargarAlumnosCurso();
        $("#popup_inscripcion").modal("hide");
        
      } else {
        this.$notificacion.error(
          "Ups!",
          "Algo sucedió al intentar guardar el alumno, ponte en contacto con soporte técnico."
        );
      }
      this.loader = false;
    },
     getNombreDia(){
      let nombreDia='';
      if(this.cursoSeleccionado && this.cursoSeleccionado.fecha_inicio_previsto){
        const diaOfList = this.getDiaFechaInicioSeleccionadaList();
        this.cursoSeleccionado.cat_dia = diaOfList && diaOfList.id;
        nombreDia = diaOfList && diaOfList.nombre;
      }
      return nombreDia;
        
    },
    getDiaFechaInicioSeleccionadaList(){
        let dia = null;
        if(this.cursoSeleccionado.fecha_inicio_previsto && this.listaDias){
          const  nDia = moment(this.cursoSeleccionado.fecha_inicio_previsto).isoWeekday()-1;
          dia = this.listaDias[nDia];         
        }
        return dia;
    },
    setNumeroSemanasEspecialidad(){
        if(this.cursoSeleccionado.cat_especialidad){
            this.cursoSeleccionado.numero_semanas = this.cursoSeleccionado.cat_especialidad.duracion;
        }
    },
     getValues() {
      return {
        co_curso: this.input.co_curso,
        cat_genero: this.input.cat_genero,
        nombre: this.input.nombre,
        apellidos: this.input.apellidos,
        direccion: this.input.direccion,
        telefono: this.input.telefono,
        correo: this.input.correo,
        fecha_nacimiento: this.input.fecha_nacimiento,
        nota: this.input.nota,
        costo_colegiatura: this.input.costo_colegiatura,
        costo_inscripcion: this.input.costo_inscripcion,
        foto: this.getFoto(),                
        co_sucursal: this.usuarioSesion.co_sucursal,
        co_empresa: this.usuarioSesion.id_empresa,
        fecha_nacimiento: moment(this.input.fecha_nacimiento).format(
          "YYYY-MM-DD"
        ),
        usuario_inscribe:this.input.usuario_inscribe,
        genero: this.usuarioSesion.id,
      };
    },
    getFoto() {
      let elemento = this.listaGeneroAlumno.find(
        (e) => e.id == this.input.cat_genero
      );
      return elemento.foto;
    },

  }
};
</script>

<style scoped></style>
