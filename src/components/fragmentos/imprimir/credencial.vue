<template>
  <div>
    <h1>Credencial</h1>
    <div class="row mb-3">
      <button class="btn btn-secondary btn-lg" @click="$router.go(-1)">
        <i class="fas fa-arrow-circle-left text-gray"></i>
      </button>
    </div>
       <span v-if="this.loadingPage">Cargando..</span>
        <span v-else v-html="this.pagePreview"></span>
  </div>
</template>

<script>
import Popup from "../../../controller/Popup";
import { operacionesApi } from "../../../helpers/OperacionesApi";
import { getUsuarioSesion } from "../../../helpers/Sesion";
import { filtrarNombreAlumno } from "../../../helpers/FiltarUtils";
import URL from "../../../helpers/Urls";
import Vue from "vue";
import ItemCapsulaAlumno from "../../../components_utils/ItemCapsulaAlumno";

/* eslint-disable */
export default {
  components: {
    Popup,
    ItemCapsulaAlumno,
  },
  mixins: [operacionesApi],
  name: "imprimir-credencial",
  data() {
    return {
      uid: "",
      path_retorno: "",
      resultado: {},
      usuarioSesion: {},
      sucursal: {},
      criterioNombre: "",
      listaAlumnos: [],
      lista: [],
      alumno: { id: 0, nombre: "", foto: "" },
      myCroppa: {},
      imgUrl: "",
      cargaAlumno: false,
      loadingCatalogo: false,
      loadingUpload: false,
      pagePreview:""
    };
  },
  beforeRouteUpdate(to) {
    console.log("uid = " + this.uid);
    console.log(" " + to);
    this.uid = to.params.uid;
    this.path_retorno = to.params.path_retorno;
  },
  async mounted() {    
    this.uid = this.$route.params.uid;
    this.usuarioSesion = getUsuarioSesion();
    console.log("@ide recibido " + this.uid);
    await this.cargarAlumno();
    //await this.cargarInformacionSucursal();
    await this.getHtml();
    this.path_retorno = this.$route.params.path_retorno;
  },
  methods: {    
    async getHtml(){     

      this.loadingPage = true;       
      this.existeHtml = false;
      this.pagePreview =await  this.getAsync(`${URL.IMPRESION_BASE}/credencial/${this.uid}/${this.usuarioSesion.id}`);
      this.loadingPage = false;

    },
    async cargarInformacionSucursal() {
      this.sucursal = await this.getAsync(
        `${URL.SUCURSAL_BASE}/${this.usuarioSesion.co_sucursal}`
      );
    },
    async cargarAlumno() {
      if (!this.uid) {
        this.$notificacion.error(
          "No se encotro el alumno",
          "Al parecer no encontramos al alumno que busca."
        );
        return;
      }
      this.alumno = await this.getAsync(`${URL.ALUMNOS_BASE}/id/${this.uid}`);
      this.loadingUpload = false;
    },
  },
};
</script>
<style scoped>
.output {
  justify-content: center;
  align-content: start;
  padding-top: 1rem;
}

.ac-card {
  display: grid;
  grid-template-columns: 173px 1fr 50px;
  background-color: #fff;
  width: 412.5px;
  height: 250px;
  margin-bottom: 1rem;

  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.ac-icon {
  width: 40px;
  margin-top: 10px;
}

.ac-card-image {
  height: 168px;
  width: 131px;
  margin: 10px 0 0 15px;
  border: 3px solid #006341;
}

.ac-card-info {
  font-size: 1.15rem;
  margin: 0;
}

.ac-card-info p {
  margin-top: 8px;
  line-height: 1.3;
}

.ac-card-footer {
  display: grid;
  align-content: center;
  grid-column: 1/-1;
  align-self: end;
  height: 56.5px;
  background-color: #006341;
}

.ac-logo {
  width: 125px;
  margin-left: 10px;
}

.hide {
  opacity: 0;
  visibility: hidden;
}
</style>
