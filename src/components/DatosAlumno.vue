<template>
  <div class="datos_alumno">    
    <div class="container text-left" :disabled="loader">        
      <span class="text-warning" v-if="!input.correo"> <i class="fas fa-info-circle"></i> * Completa la información de
        correo para que le lleguen los comprobantes de pagos a esa dirección.</span>
      <div class="form-row">
        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>Alumno<span class="text-danger">*</span></label>
          <input type="text" v-model="input.nombre" class="form-control" placeholder="Nombre" required autofocus />
        </div>

        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>Apellidos<span class="text-danger">*</span></label>
          <input type="text" v-model="input.apellidos" class="form-control" placeholder="Apellidos" required />
        </div>
      </div>

      <div class="form-group">
        <label>Dirección <span class="text-danger">*</span></label>
        <input type="text" v-model="input.direccion" class="form-control" placeholder="Dirección " />
      </div>


      <div class="form-row">
        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>Correo <span class="text-danger">*</span></label>
          <div class="input-group mb-3">
            <input type="text" 
                   v-model="input.correo" 
                   :class="`form-control ${!input.correo ? 'is-invalid' : ''}  `"
                   placeholder="Correo "
                   aria-label="correo" 
                   disabled 
                  @click="iniciarCorreo"
                   aria-describedby="button-addon2"/>
                <div class="input-group-append">
                  <button :disabled="!this.input.correo" 
                      title="clic aqui para editar el correo"
                      class="btn btn-outline-primary" 
                      type="button" 
                      @click="iniciarCorreo"
                      id="button-addon2">
                    <i class="fa fa-envelope"></i>
                  </button>
                </div>
          </div>
          <div v-if="!input.correo" class="invalid-feedback">
            Por favor escribe el correo
          </div>
        </div>
        <div class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>Télefono<span class="text-danger">*</span></label>
          <input type="text" v-model="input.telefono" class="form-control" placeholder="(52)" required />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>
            Fecha de nacimiento
            <span class="text-danger">*</span>
          </label>
          <datepicker name="fecha_nacmiento" v-model="input.fecha_nacimiento" input-class="form-control"
            :format="'yyyy-MM-dd'" :bootstrap-styling="true" :language="es" required></datepicker>
        </div>
        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>Sexo<span class="text-danger">*</span></label>
          <select v-model="input.cat_genero" class="form-control" placeholder="Grupo" required>
            <option id="selectGeneroAlumno" v-for="genero in listaGeneroAlumno" v-bind:value="genero.id"
              v-bind:key="genero.id">{{ genero.nombre }}</option>
          </select>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label> Escolaridad </label>
          <select v-model="input.cat_escolaridad" class="form-control" placeholder="Escolaridad">
            <option id="selectEscolaridad" v-for="escolaridad in listaEscolaridad" v-bind:value="escolaridad.id"
              v-bind:key="escolaridad.id">
              {{ escolaridad.nombre }}
            </option>
          </select>
        </div>
        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>Ocupación</label>
          <input type="text" v-model="input.ocupacion" class="form-control" placeholder="" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label> Tutor(a) </label>
          <input type="text" v-model="input.tutor" class="form-control" placeholder="Nombre del padre o tutor" />
        </div>
        <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <label>Teléfono del tutor(a)</label>
          <input type="text" v-model="input.telefono_tutor" class="form-control" placeholder="Teléfono" />
        </div>
      </div>


      <div class="form-group ">
        <label for="inputFechaLimitePago">Nota </label>
        <textarea rows="2" v-model="input.nota" class="form-control" placeholder="Notas " />
      </div>

      <button class="btn btn-block btn-primary" :disabled="loader" v-on:click="guardar()">
        <Loader :loading="loader" :mini="true" />
        Guardar
      </button>
      <br />
    </div>


      <!-- popup correo editar y reenviar -->
    <Popup id="popup_correo" :show_button_close="true">
      <div slot="header">
        <h4>Correo de alumno</h4>
      </div>
      <div slot="content" >
        <div class="card ">
              <img
                class="card-img-top pointer rounded-circle mx-auto"
                style="width:100px"                
                :src="input.foto"
                lt="Foto"                                
              />

              <div class="card-body p-1 mx-auto">
                <h3 class="card-text">
                  {{ input.nombre }} {{ input.apellidos }}
                </h3>                
              </div>
               <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                        <label>Correo <span class="text-red">*</span></label>
                        <input type="text" 
                                v-model="correo" 
                                :class="`form-control ${!correo ? 'is-invalid' : ''}  `"
                                placeholder="Correo "
                                aria-label="correo"                                                                   
                                />                        
                    </li>    
                    <li class="list-group-item">                                   
                          <button @click="enviarCorreo" :disabled="loaderEnvioCorreo" class="btn btn-primary btn-block" >
                                <span v-if="loaderEnvioCorreo" class="spinner-border" role="status"></span>                                   
                                <i class="fa fa-envelope"></i> Enviar                                
                          </button>        
                    </li>
                </ul>
            </div>
      </div>
      <div slot="footer">
        
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
  name: "datos-alumno",
  components: {
    Datepicker,
    Loader,
    Popup
  },
  props: ["uuidAlumno","inscripciones"],
  mixins: [operacionesApi],
  data() {
    return {
      uid: "",
      usuarioSesion: {},
      input: AlumnoModel,
      listaGeneroAlumno: [],
      listaEscolaridad: [],
      generoAlumno: { id: -1, nombre: "", foto: "" },
      es: es,
      loader: false,
      isModificacion: false,
      cargado: false,
      loaderEnvioCorreo: false,
      correo:""
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
      if (this.uid && !this.cargado) {

        console.log("==== CARGANDO DATOS DE ALUMNO  " + JSON.stringify(this.uid));

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
      console.log("inciando id alumno " + this.input.id);

      const respuesta = await this.putAsync(`${URL.ALUMNOS_BASE}/${this.input.id}`, values);

      console.log(respuesta);
      if (respuesta) {
        this.$notificacion.info(
          `Inscripción realizada`, `Se modificó el alumno`
        );

        this.$root.$emit(Emit.ACTUALIZAR_ALUMNO, Emit.ACTUALIZAR_ALUMNO + " from DatosAlumno.vue");

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
    async iniciarCorreo() {
        console.log("@iniciarCorreo");
        this.correo = this.input.correo;
        $("#popup_correo").modal("show");

    },
    async enviarCorreo() {
      console.log("@enviarCorreo");
      
      if (!this.correo) {
        console.log("no hay correo");
        return;
      }     

      this.loaderEnvioCorreo = true;
      
      const respuesta = await this.postAsync(
                                            `${URL.INSCRIPCION_BASE}/reenviar_correo_bienvenida`, 
                                            {
                                              uuid_alumno: this.input.uid,
                                              correo:this.correo,
                                              genero:this.usuarioSesion.id
                                            });
       
      if (respuesta) {
        
        this.$root.$emit(Emit.ACTUALIZAR_ALUMNO, Emit.ACTUALIZAR_ALUMNO + " from DatosAlumno.vue");

        this.input = await this.getAsync(`${URL.ALUMNOS_BASE}/id/${this.uid}`);
        
        $("#popup_correo").modal("hide");

        this.$notificacion.info(
          `Correo enviado`, 
          `Se envio el correo de bienvenida`
        );        
      } else {
        this.$notificacion.error(
          "Ups!",
          "Algo sucedió al intentar enviar el correo, ponte en contacto con soporte técnico."
        );        
      }
      this.loaderEnvioCorreo = false;
    },
    getValues() {
      return {
        cat_genero: this.input.cat_genero,
        nombre: this.input.nombre,
        apellidos: this.input.apellidos,
        direccion: this.input.direccion,
        telefono: this.input.telefono,
        correo: this.input.correo,
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

<style scoped>
</style>
