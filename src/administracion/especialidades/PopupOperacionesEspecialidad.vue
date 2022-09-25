<template>
  <span>
    <Loader :loading="loader" />

    <div class="dropdown">
      <a class="btn btn-sm btn-icon-only text-primary" href="#" role="button" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">
        <i class="fas fa-ellipsis-v"></i>
      </a>
      <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
        <a class="dropdown-item" href="#" v-on:click="seleccionar(EDIT)" :disabled="loader_edit"
          v-if="!ocultar_modificacion">
          <i class="fa fa-edit text-primary"></i> Modificar
        </a>

       <a class="dropdown-item" href="#" :title="'Eliminar registro de la maestra '" v-on:click="seleccionar(DELETE)"
          :disabled="loader_eliminar" v-if="!ocultar_eliminacion">
          <i class="fa fa-user-minus text-red"></i> Dar de baja
        </a>
      </div>
    </div>

    <Popup :id="'popup_especialidad_'+id_popup_edit" :show_button_close="false" size="md">
      <div slot="header">Especialidad</div>
      <div slot="content">
        <div class="container text-left">
          <formulario-especialidad :especialidad="especialidad" />
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-secondary" @click="cancelar()"
          v-if="operacion == EDIT || operacion == INSERT">Cerrar</button>        
        <button class="btn btn-primary" @click="modificar()" v-if="operacion == EDIT" :disabled="loader_edit">
          <div v-if="loader_edit" class="spinner-border spinner-border-sm" role="status" />Modificar
        </button>
      </div>
    </Popup>

    <Popup :id="'popup_baja_'+id_popup_baja" show_button_close="true" size="md">
      <div slot="header">Baja de especialidad</div>
      <div slot="content">
        <div class="container text-left">

          <div class="card card-border border border-danger p-2">
            <div class="media">
              <img v-if="especialidad.foto" class="avatar avatar-md rounded-circle align-self-start mr-3" alt="usuario"
                :src="especialidad.foto">
              <img v-else alt="usuario" class="avatar avatar-md rounded-circle align-self-start mr-3"
                src="../../assets/user.png">
              <div class="media-body">
                <h5 class="mt-0">{{especialidad.nombre}}</h5>
                <h4 class="mt-0">{{especialidad.duracion}} {{especialidad.nombre_duracion}} </h4>                
              </div>
            </div>
          </div>

          <div class="form-group pt-2">
            <label>Escriba algúna observación</label>
            <textarea class="form-control" placeholder="Observación opcional" v-model="datosBaja.motivo_baja"
              rows="3"></textarea>
          </div>
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-danger" :disabled="loader_eliminar" @click="eliminar()">
          <div v-if="loader_eliminar" class="spinner-border spinner-border-sm" role="status" />Confirmar eliminación
        </button>
      </div>
    </Popup>


      </span>
</template>

<script  >
import Datepicker from "vuejs-datepicker";
import URL from "../../helpers/Urls";
import { operacionesApi } from "../../helpers/OperacionesApi";
import { getUsuarioSesion } from "../../helpers/Sesion";
import VueTimepicker from "vue2-timepicker";
import CatEspecialidad from "../../models/CatEspecialidad";
import TABLE_CONFIG from "../../helpers/DatatableConfig";
import Popup from "../../controller/Popup";
import Loader from "../../components_utils/Loader";
import { validarDatosEspecialidad } from "../../helpers/EspecialidadValidacion";
import FormularioEspecialidad from './FormularioEspecialidad.vue';

const INSERT = "INSERT", EDIT = "EDIT", DELETE = "DELETE", ENVIAR_CLAVE = "ENVIAR_CLAVE", ACCESO_SISTEMA = "ACCESO_SISTEMA";

export default {
  name: "opciones-especialidad",
  mixins: [operacionesApi],
  props: ["especialidad_value", "metodo_refrescar", "id_especialidad", "buscar", "ocultar_eliminacion", "ocultar_modificacion", "dropdown"],
  components: {
    Datepicker,
    VueTimepicker,
    Popup,
    Loader,
    FormularioEspecialidad
  },
  data() {
    return {
      especialidad: CatEspecialidad,
      especialidadMemento: CatEspecialidad,
      datosBaja: { motivo_baja: "", fecha_baja: null },
      usuarioSesion: null,
      response: "",
      operacion: INSERT,            
      TABLE_CONFIG: TABLE_CONFIG,
      loader_eliminar: false,
      loader_edit: false,
      loader_bloquear: false,
      loader: false,            
      id_popup_baja: "",
      id_popup_edit: "",
      ocultar_contrasena: false,
      INSERT, EDIT, DELETE, ENVIAR_CLAVE, ACCESO_SISTEMA
    };
  },
  mounted() {
    console.log("iniciando el componente usuario ");
    this.usuarioSesion = getUsuarioSesion();
    this.init();
  },
  methods: {
    init() {
      console.log("Init " + JSON.stringify(this.especialidad_value));
      this.id_popup_baja = this.nombreRandom();
      this.id_popup_edit = this.nombreRandom();

      if (!this.especialidad_value) {
        this.especialidad = new CatEspecialidad();
      } else {
        this.especialidad = this.especialidad_value;
      }
    },

    buscarId() {
      this.loader = true;
      this.get(URL.ESPECIALIDADES_BASE + "/" + this.id_especialidad, result => {
        console.log("Consulta " + JSON.stringify(result.body));
        this.loader = false;
        if (result.body != null) {
          this.especialidad = result.body;
        }
      });
    },
    async modificar() {
      
      if (!validarDatosEspecialidad(this.especialidad)) {
        console.log("No paso la validacion");
        return;
      }

      this.especialidad.co_sucursal = this.usuarioSesion.co_sucursal;
      this.especialidad.genero = this.usuarioSesion.id;

      this.loader_edit = true;
      
      const result = await this.putAsync(`${URL.ESPECIALIDADES_BASE}/${this.especialidad.id}`, this.especialidad);

      console.log(JSON.stringify(result));

        if (result) {                              
            this.$notificacion.info(
              "Modificación ",
              "Se actualizarón los datos."
            );
            //this.init();
            this.loader_edit = false;
            $("#popup_especialidad_" + this.id_popup_edit).modal("hide");
            await this.metodo_refrescar();
          } else {
            this.$notificacion.error("Mensaje", respuesta.mensaje);
          }       
      
    },
    async eliminar() {
      console.log("Modificar el id " + this.especialidad.id);

      this.datosBaja.genero = this.usuarioSesion.id;
      this.loader_eliminar = true;
      const result = await this.patchAsync(URL.ESPECIALIDADES_BASE + "/" + this.especialidad.id,this.datosBaja);
      if(result){
            this.$notificacion.error(
              "Registro de Baja",
              "Se registro la baja " + this.especialidad.nombre + "."
            );
            this.loader_eliminar = false;
            await this.metodo_refrescar();
      }else{
        this.$notificacion.error("Mensaje", "Ups, al parecer sucedió un detalle al intentar guardar. comunicate con el equipo de soporte.");
      }
    },
    seleccionar(operacion) {
      console.log("fila seleccionada " + this.especialidad + " operaicon " + operacion);

      this.operacion = operacion;

      this.especialidadMemento = Object.assign({}, this.especialidad);

      switch (this.operacion) {
        case EDIT: this.caseEdit(); break;
        case DELETE: this.caseDelete(); break;                
        default: console.log("No existe case");
      }
    },

    caseEdit() {
      console.log("caseEdit");
      if (this.buscar == true) {
        this.buscarId();
      }

      $("#popup_especialidad_" + this.id_popup_edit).modal("show");
    },
    caseDelete() {
      console.log("caseDelete");
      this.datosBaja = { motivo_baja: "", fecha_baja: new Date() };

      $("#popup_baja_" + this.id_popup_baja).modal("show");
    },    
    cancelar() {
      if (this.operacion == EDIT || this.operacion == INSERT) {
        this.especialidad = this.especialidadMemento;        
        $("#popup_especialidad_" + this.id_popup_edit).modal("hide");
      }
      if (this.operacion == DELETE) {
        $("#popup_especialidad_" + this.id_popup_baja).modal("hide");
      }      
    },
    verDetalle(rowSelect) {
      
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
