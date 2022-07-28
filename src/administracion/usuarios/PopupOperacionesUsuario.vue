<template>
  <span>  
    <Loader :loading="loader" />

                <div v-if="dropdown" class="dropdown">
                        <a class="btn btn-sm btn-icon-only text-primary" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i class="fas fa-ellipsis-v"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                            <a class="dropdown-item" href="#" 
                                v-on:click="seleccionar(EDIT)"
                                :disabled="loader_edit"
                                v-if="!ocultar_modificacion"
                                 >
                                <i class="fa fa-edit text-primary"></i> Modificar
                            </a>                            
                            <a class="dropdown-item" href="#"><i class="fa fa-ban text-red"></i> Bloquear acceso </a>
                            <a class="dropdown-item" href="#"
                                title="Enviar nueva contraseña "
                                v-on:click="seleccionar(ENVIAR_CLAVE)"
                                :disabled="loader_contrasena"
                                v-if="!ocultar_contrasena"
                            >
                                    <i class="fa fa-share text-blue"></i>Reiniciar su clave de acceso 
                            </a>
                            <a class="dropdown-item" href="#"
                                :title="'Eliminar registro de la maestra '"
                                v-on:click="seleccionar(DELETE)"
                                :disabled="loader_eliminar"
                                v-if="!ocultar_eliminacion">
                                <i class="fa fa-times text-red"></i> Dar de baja
                            </a>
                            <!--<a class="dropdown-item" href="#"><i class="fa fa-share text-blue"></i>Enviarme un mensaje </a>-->
                        </div>
    </div>

  <span v-else>
    <button
      type="button"
      class="btn  btn-sm"
      title="Modificar registro"
      v-on:click="seleccionar(EDIT)"
      :disabled="loader_edit"
      v-if="!ocultar_modificacion"
    >
      <Loader :loading="loader_edit" :mini="true" />      
      <i class="fas fa-edit text-primary"></i>
    </button>
    <button
      type="button"
      class="btn btn-sm"
      :title="'Eliminar registro de la maestra '"
      v-on:click="seleccionar(DELETE)"
      :disabled="loader_eliminar"
      v-if="!ocultar_eliminacion"
    >
      <Loader :loading="loader_eliminar" :mini="true" />
      <i class="fas fa-trash-alt text-red"></i>
    </button>
     
     <button
      type="button"
      class="btn  btn-sm"
      title="Enviar nueva contraseña "
      v-on:click="seleccionar(ENVIAR_CLAVE)"
      :disabled="loader_contrasena"
      v-if="!ocultar_contrasena"
    >
      <Loader :loading="loader_contrasena" :mini="true" />
      <i class="fas fa-envelope text-indigo"></i>
    </button>
  </span>

    <Popup :id="'popup_usuario_'+id_popup_edit" :show_button_close="false" size="md">
      <div slot="header">Usuario</div>
      <div slot="content">
        <div class="container text-left">
             <formulario-usuario :usuario="usuario" />       
        </div>
      </div>
      <div slot="footer">
        <button
          class="btn btn-secondary"
          @click="cancelar()"
          v-if="operacion == EDIT || operacion == INSERT"
        >Cerrar</button>
        <button class="btn btn-primary" @click="guardar()" v-if="operacion == INSERT">Guardar</button>
        <button
          class="btn btn-primary"
          @click="modificar()"
          v-if="operacion == EDIT"
          :disabled="loader_edit"
        >
          <Loader :loading="loader_edit" :mini="true" />Modificar
        </button>
      </div>
    </Popup>

    <Popup :id="'popup_baja_'+id_popup_baja" show_button_close="true" size="md">
      <div slot="header">Acceso al Sistema</div>
      <div slot="content">
        <div class="container text-left">
          <div class="alert alert-warning">
            <span class="alert-icon"><i class="fas fa-user-minus"></i></span><strong>{{usuario.nombre}}</strong>
             <p class="text-sm">Se desactivara todo acceso al sistema</p>
          </div>
          <label>
            Fecha de Baja
            <span class="text-danger">*</span>
          </label>
          <datepicker
            name="fechaBaja"
            v-model="datosBaja.fecha_baja"
            input-class="form-control"
            :disabled-dates="{from:new Date()}"
            :bootstrap-styling="true"
            :language="es"
            required
          ></datepicker>
          <div class="form-group">
            <label>Escriba algúna observación</label>
            <textarea class="form-control" v-model="datosBaja.motivo_baja" rows="3"></textarea>
          </div>
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-danger" :disabled="loader_eliminar" @click="eliminar()">
          <Loader :loading="loader_eliminar" :mini="true" />Confirmar Baja
        </button>
      </div>
    </Popup>


<!-- reiniciar clave-->
   <Popup :id="'popup_enviar_clave_'+id_popup_edit" show_button_close="true" size="md">
      <div slot="header">Enviar clave de acceso</div>
      <div slot="content">
        <div class="container text-left">                             
          
          <p><i class="fa fa-user text-primary"></i> {{usuario_value.nombre}}</p>
          <span v-if="!usuario_value.correo" class="text-danger">* No existe el correo</span>
          
          <div class="input-group flex-nowrap">
            <div class="input-group-prepend">
              <span class="input-group-text" id="addon-wrapping">@</span>
            </div>
            <input type="text" disabled v-model="usuario_value.correo"  class="form-control" placeholder="Correo" aria-label="correo" aria-describedby="addon-wrapping">
          </div>
          <small class="text-warning"><i class="fa fa-circle-info text-warning"></i>* Se reiniciará su clave de acceso al sistema</small>
        </div>
        
      </div>
      <div slot="footer">
        <button class="btn btn-primary" :disabled="loader_eliminar" @click="reenviarClaveAcceso()">
          <Loader :loading="loader_eliminar" :mini="true" /><i class="fa fa-envelope"></i> Confirmar envío
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

const INSERT="INSERT", EDIT="EDIT", DELETE="DELETE",ENVIAR_CLAVE="ENVIAR_CLAVE",ACCESO_SISTEMA="ACCESO_SISTEMA";

export default {
  name: "opciones-usuario",
  mixins: [operacionesApi],
  props: ["usuario_value", "metodo_refrescar", "id_usuario", "buscar","ocultar_eliminacion","ocultar_modificacion","dropdown"],
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
      datosBaja: { motivo_baja: "", fecha_baja: null },
      usuarioSesion: null,
      response: "",
      operacion: INSERT,
      es: es,
      registrarCorreo: false,
      TABLE_CONFIG: TABLE_CONFIG,
      loader_eliminar: false,
      loader_edit: false,
      loader: false,
      loader_contrasena: false,
      contador: 0,
      rangoHora: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      id_popup_baja: "",
      id_popup_edit: "",
      ocultar_contrasena:false,
      INSERT,EDIT,DELETE,ENVIAR_CLAVE,ACCESO_SISTEMA
    };
  },
  mounted() {
    console.log("iniciando el componente usuario ");
    this.usuarioSesion = getUsuarioSesion();
    this.init();
  },
  methods: {
    init() {
      console.log("Init " + JSON.stringify(this.usuario_value));
      this.id_popup_baja = this.nombreRandom();
      this.id_popup_edit = this.nombreRandom();

      if (this.usuario_value == null || this.usuario_value == undefined) {
        this.usuario = new UsuarioModel();
      } else {
        this.usuario = this.usuario_value;// Object.assign({}, this.usuario_value);
      }
    },

    buscarId() {
      this.loader = true;
      this.get(URL.USUARIO_BUSCAR_ID + "/" + this.id_usuario, result => {
        console.log("Consulta " + JSON.stringify(result.body));
        this.loader = false;
        if (result.body != null) {
          this.usuario = result.body;
        }
      });
    },
    modificar() {
      console.log("Modificar el id " + this.usuario.nombre);

      if (!validarDatosUsuario(this.usuario)) {
        console.log("No paso la validacion");
        return;
      }

      this.usuario.co_sucursal = this.usuarioSesion.co_sucursal;
      this.usuario.genero = this.usuarioSesion.id;

      this.loader_edit = true;

      //this.put(URL.USUARIO_BASE + "/" + this.usuario.id,
      this.put(URL.USUARIO_BASE, this.usuario, result => {
        if (result != null) {
          console.log("" + JSON.stringify(result.body));
          let respuesta = result.body;
          if (respuesta.estatus) {
            this.$notificacion.info(
              "Modificación de usuario",
              "Se actualizarón los datos del usuario."
            );
            //this.init();
            this.loader_edit = false;
            $("#popup_usuario_" + this.id_popup_edit).modal("hide");
            this.metodo_refrescar();
          } else {
            this.$notificacion.error("Mensaje", respuesta.mensaje);
          }
        }
      });
    },
    eliminar() {
      console.log("Modificar el id " + this.usuario.id);

      if (
        this.datosBaja.fecha_baja == null ||
        this.datosBaja.fecha_baja == undefined
      ) {
        this.$notificacion.error(
          "Fecha de baja",
          "Seleccione una fecha de baja"
        );
        return;
      }

      this.datosBaja.genero = this.usuarioSesion.id;
      this.loader_eliminar = true;
      this.put(
        URL.USUARIO_BASE + "/" + this.usuario.id,
        this.datosBaja,
        result => {
          let respuesta = result.body;
          if (respuesta.estatus) {
            this.$notificacion.error(
              "Registro de Baja de usuario",
              "Se registro la baja de usuario " + this.usuario.nombre + "."
            );
            this.loader_eliminar = false;
            $("#popup_baja_" + this.id_popup_baja).modal("hide");
            //this.init();
            this.metodo_refrescar();
          } else {
            this.$notificacion.error("Mensaje", respuesta.mensaje);
          }
        }
      );
    },
    seleccionar(operacion) {
      console.log("fila seleccionada " + this.usuario+" operaicon "+operacion);
      
      this.operacion = operacion;

      this.usuarioMemento = Object.assign({}, this.usuario);

      switch(this.operacion){
          case EDIT: this.caseEdit(); break;
          case DELETE: this.caseDelete(); break;
          case ENVIAR_CLAVE: this.caseEnviarClave(); break;
          case ACCESO_SISTEMA: this.caseAccesoSistema(); break;
          default: console.log("No existe case");
      }
    },

    caseEdit(){
        console.log("caseEdit");
        if (this.buscar == true) {
                  this.buscarId();
         }

      $("#popup_usuario_" + this.id_popup_edit).modal("show");
    },
    caseDelete(){              
        console.log("caseDelete");
        this.datosBaja = { motivo_baja: "", fecha_baja: new Date() };
        
        $("#popup_baja_" + this.id_popup_baja).modal("show");
    },
    caseEnviarClave(){          
        console.log("caseEnviarClave");
        $("#popup_enviar_clave_" + this.id_popup_edit).modal("show");
    },
    caseAccesoSistema(){     
          console.log("caseAccesoSistema");        
         $("#popup_acceso").modal("show");
    },
    cancelar() {
      if (this.operacion == EDIT || this.operacion == INSERT) {
        this.usuario = this.usuarioMemento;
        $("#popup_usuario_" + this.id_popup_edit).modal("hide");
      }
      if (this.operacion == DELETE) {
        $("#popup_baja_" + this.id_popup_baja).modal("hide");
      }
      if (this.operacion === ACCESO_SISTEMA) {
        $("#popup_acceso").modal("hide");
      }
    },
    verDetalle(rowSelect) {
      console.log("fila seleccionada " + rowSelect.nombre);
      //$("#popup_eliminar_usuario").modal("show");
      //this.$router.push({ name: "PerfilAlumno", params: { id: rowSelect.id } });
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
    },
    nombreRandom() {
      return Math.random()
        .toString(36)
        .substring(7);
    }
  }
};
</script>

<style scoped>
</style>
