<template>
  <span>
    <button type="button" class="btn btn-primary btn-lg" v-on:click="nuevo()">Nuevo</button>

    <Popup id="popup_usuario" :show_button_close="true" size="md">
      <div slot="header">Registrar Usuario nuevo</div>
      <div slot="content" >
        <span v-if="mensaje" class="text-danger" role="alert">
            *{{mensaje}}
        </span>
        <div class="container text-left">        

           <formulario-usuario :usuario="usuario" />            
                 
        </div>
        <!--<div class="alert a ">        
          <small class="text-sm"><i class="fa fa-info-circle text-primary pt-1"></i> Se enviará un correo al empleado con sus credenciales de acceso.</small>
        </div>-->

      </div>
      <div slot="footer" >
        
        <button class="btn btn-primary" @click="guardar()" v-if="operacion == 'INSERT'">
          <div v-if="loader" class="spinner-border spinner-border-sm" role="status"/>Guardar
        </button>
      </div>
    </Popup>
  </span>
</template>

<script  >
import Datepicker from "vuejs-datepicker";
import URL from "../../helpers/Urls";
import { operacionesApi } from "../../helpers/OperacionesApi";
import { en, es } from "vuejs-datepicker/dist/locale";
import { getUsuarioSesion } from "../../helpers/Sesion";
import VueTimepicker from "vue2-timepicker";
import { UsuarioModel, UsuarioBuilder } from "../../models/UsuarioModel";
import { VueGoodTable } from "vue-good-table";
import TABLE_CONFIG from "../../helpers/DatatableConfig";
import Popup from "../../controller/Popup";
import Loader from "../../components_utils/Loader";
import { validarDatosUsuario } from "../../helpers/UsuarioValidacion";
import * as moment from "moment";
import CONSTANTES from "../../helpers/Constantes";
import FormularioUsuario from './FormularioUsuario.vue';

export default {
  name: "opciones-usuario",
  mixins: [operacionesApi],
  props: ["metodo_refrescar"],
  components: {
    Datepicker,
    VueTimepicker,
    Popup,
    Loader,
    FormularioUsuario
  },
  data() {
    return {
      usuario: UsuarioModel,
      usuarioMemento: UsuarioModel,
      usuarioSesion: null,
      response: "",
      operacion: "INSERT",
      es: es,
      registrarCorreo: false,
      loader: false,
      contador: 0,
      rangoHora: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      mensaje:""
    };
  },
  mounted() {
    console.log("iniciando el componente usuario ");
    this.usuarioSesion = getUsuarioSesion();
    this.init();
  },
  methods: {
    init() {},
    nuevo() {
      console.log("Nuevo");
      this.operacion = "INSERT";
      this.usuario = new UsuarioModel();
      this.usuario.hora_entrada = '';
      this.usuario.hora_salida = '';
      this.mensaje="";
      $("#popup_usuario").modal("show");
    },
    async guardar() {
      console.log("Insertar");

      if (!validarDatosUsuario(this.usuario)) {
        console.log("No paso la validacion");
        return;
      }
      console.log(
        `entrada ${this.usuario.hora_entrada} salida ${this.usuario.hora_entrada}`
      );
      this.usuario.co_sucursal = this.usuarioSesion.co_sucursal;
      this.usuario.co_empresa = this.usuarioSesion.id_empresa;
      this.usuario.genero = this.usuarioSesion.id;
      this.usuario.cat_tipo_usuario = CONSTANTES.ID_TIPO_USUARIO_MAESTRA;

    this.loader= true;
      const respuesta = await this.postAsync(URL.USUARIO_BASE,this.usuario);

     
        if (respuesta.estatus) {
          this.metodo_refrescar();    
          $("#popup_usuario").modal("hide");
          this.$notificacion.info( "Registro de usuario",  "Se registró el usuario." );
        } else {
          this.mensaje = respuesta.mensaje;
          this.$notificacion.error("Mensaje", respuesta.mensaje);                    
        }

        this.loader= false;
      
    },
    validarHoras(eventData) {
      let horaEntrada = moment({
        hour: this.usuario.hora_entrada.HH,
        minute: this.usuario.hora_entrada.mm
      });
      let horaSalida = moment({
        hour: this.usuario.hora_salida.HH,
        minute: this.usuario.hora_salida.mm
      });
      console.log(` ${horaEntrada} salida ${horaSalida}`);
      if (horaSalida <= horaEntrada) {
        Vue.prototype.$notificacion.error(
          "Hora de entrada y salida",
          "La hora de entrada es menos a la hora de salida."
        );
        return false;
      }
    }
  }
};
</script>

<style scoped>
</style>
