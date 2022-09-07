<template>
  <span>
    <button type="button" class="btn btn-primary btn-lg" v-on:click="nuevo()">Nuevo</button>

    <Popup id="popup_especialidad" :show_button_close="true" size="md">
      <div slot="header">Registrar Especialidad</div>
      <div slot="content">
        <span v-if="mensaje" class="text-danger" role="alert">
          *{{ mensaje }}
        </span>
        <div class="container text-left">

          <formulario-usuario :usuario="usuario" />

        </div>

      </div>
      <div slot="footer">

        <button class="btn btn-primary" @click="guardar()" v-if="operacion == 'INSERT'">
          <div v-if="loader" class="spinner-border spinner-border-sm" role="status" />Guardar
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
import CatEspecialidad from "../../models/CatEspecialidad";
import Popup from "../../controller/Popup";
import Loader from "../../components_utils/Loader";
import { validarDatosEspecialidad } from "../../helpers/EspecialidadValidacion";
import CONSTANTES from "../../helpers/Constantes";
import FormularioEspecialidad from './FormularioEspecialidad.vue';

const MODAL_NAME = '#modal_especialidad';

export default {
  name: "nueva-especialidad",
  mixins: [operacionesApi],
  props: ["metodo_refrescar"],
  components: {
    Popup,
    Loader,
    FormularioEspecialidad
  },
  data() {
    return {
      especialidad: CatEspecialidad,
      especialidadMemento: CatEspecialidad,
      usuarioSesion: null,
      response: "",
      operacion: "INSERT",
      loader: false,
      mensaje: ""
    };
  },
  mounted() {
    console.log("iniciando el componente pupun nueva especialidad ");
    this.usuarioSesion = getUsuarioSesion();
    this.init();
  },
  methods: {
    init() { },
    nuevo() {
      console.log("Nuevo");
      this.operacion = "INSERT";
      this.especialidad = new CatEspecialidad();
      this.mensaje = "";
      $(MODAL_NAME).modal("show");
    },
    async guardar() {
      console.log("Insertar");

      if (!validarDatosEspecialidad(this.usuario)) {
        console.log("No paso la validacion");
        return;
      }

      this.usuario.co_sucursal = this.usuarioSesion.co_sucursal;
      this.usuario.co_empresa = this.usuarioSesion.id_empresa;
      this.usuario.genero = this.usuarioSesion.id;
      this.usuario.cat_tipo_usuario = CONSTANTES.ID_TIPO_USUARIO_MAESTRA;

      this.loader = true;

      const respuesta = await this.postAsync(URL.ESPECIALIDADES_BASE, this.usuario);

      if (respuesta.estatus) {
        this.metodo_refrescar();
        $(MODAL_NAME).modal("hide");
        this.$notificacion.info("Registro de especialidad", "Registro exitoso.");
      } else {
        this.mensaje = respuesta.mensaje;
        this.$notificacion.error("Mensaje", respuesta.mensaje);
      }

      this.loader = false;

    }
  }
};
</script>

<style scoped>
</style>
