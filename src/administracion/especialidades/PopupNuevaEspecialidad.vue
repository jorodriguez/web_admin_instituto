<template>
  <span>
    <button type="button" class="btn btn-primary btn-lg" v-on:click="nuevo()">Nuevo</button>

    <Popup :id="MODAL_NAME" :show_button_close="true" size="md">
      <div slot="header">Registrar Especialidad</div>
      <div slot="content">
        <span v-if="mensaje" class="text-danger" role="alert">
          *{{ mensaje }}
        </span>
        <div class="container text-left">

          <FormularioEspecialidad :especialidad="especialidad" />

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

const MODAL_NAME = 'modal_especialidad';
const MODAL_NAME_REF = `#${MODAL_NAME}`;

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
      CAT_DURACION_SEMANAL : 1,
      MODAL_NAME,
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
      $(MODAL_NAME_REF).modal("show");
    },
    async guardar() {
      console.log("Insertar");

      if (!validarDatosEspecialidad(this.especialidad)) {
        console.log("No paso la validacion");
        return;
      }

      this.especialidad.co_sucursal = this.usuarioSesion.co_sucursal;
      this.especialidad.co_empresa = this.usuarioSesion.id_empresa;
      this.especialidad.genero = this.usuarioSesion.id;      
      this.especialidad.cat_duracion = this.CAT_DURACION_SEMANAL;
      this.especialidad.alumnos_permitidos = 20;
      this.especialidad.foto = "";
      this.especialidad.alumnos_permitidos=20;

      /*this.duracion = null;
      this.nombre = "";
      this.descripcion = "";    
      this.alumnos_permitidos = null;
      this.foto = "";
      this.activo = true;
      this.color="";*/
    
      this.loader = true;

      const respuesta = await this.postAsync(URL.ESPECIALIDADES_BASE, this.especialidad);

      console.log(JSON.stringify(respuesta));

      if (respuesta.estatus) {
        await this.metodo_refrescar();
        $(MODAL_NAME_REF).modal("hide");
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
