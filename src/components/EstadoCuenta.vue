<template>
  <span>
    <button
      type="button"
      class="btn btn-sm btn-link"
      v-on:click="verEstadoCuenta()"
    >
      Enviar estado de cuenta
    </button>

    <Popup id="popup_preview" size="lg" :show_button_close="true">
      <div slot="header">
        Estado de cuenta 
        <strong v-if="this.estadoCuenta"
          >{{ this.estadoCuenta.alumno.nombre_alumno }}
          {{ this.estadoCuenta.alumno.apellidos_alumno }}</strong
        >
      </div>    

      <div slot="content" v-if="this.estadoCuenta" style="color:#000">        
        <div class="row">
          <table class="table">            
            <tr align="left">
              <td>Correos</td>
              <td>{{ this.estadoCuenta.alumno.correo + "" }}</td>
            </tr>
          </table>
        </div>
        <span v-if="this.loadingPage">Cargando..</span>
        <span v-else v-html="this.pagePreview"></span>
      </div>
      <div slot="footer">
        <button
          class="btn btn-primary"
          v-if="this.estadoCuenta"
          :disabled="this.loading || !this.estadoCuenta.alumno.correo "
          @click="enviarEstadoCuenta()"
        >
          {{ this.loading ? "Enviando..." : "Enviar" }}
        </button>
      </div>
    </Popup>
  </span>
</template>

<script>
import Popup from "../controller/Popup";
import { operacionesApi } from "../helpers/OperacionesApi";
import { getUsuarioSesion } from "../helpers/Sesion";
import { filtrarNombreAlumno } from "../helpers/FiltarUtils";
import URL from "../helpers/Urls";
import Vue from "vue";
import ItemCapsulaAlumno from "../components_utils/ItemCapsulaAlumno";

export default {
  components: {
    Popup,
    ItemCapsulaAlumno
  },
  mixins: [operacionesApi],
  name: "estado-cuenta",
  props: ["idAlumno"],
  data() {
    return {
      id: 0,
      resultado: {},
      usuarioSesion: {},
      criterioNombre: "",
      estadoCuenta: null,
      loading: false,
      loadingPage: false,
      pagePreview: null
    };
  },
  mounted() {
    //this.id = this.$route.params.id;
    //console.log("@ide recibido " + this.id);
    //this.cargarAlumno();
    this.onInit();
  },
  methods: {
    onInit() {
      this.usuarioSesion = getUsuarioSesion();
    },

    verEstadoCuenta() {
      this.cargarEstadoCuenta();
      this.getPreview();
      $("#popup_preview").modal("show");
    },

    enviarEstadoCuenta() {
      this.loading = true;
      this.post(
        URL.ESTADO_CUENTA_ENVIAR,
        {
          id_alumno: this.idAlumno
        },
        result => {
          let respuesta = result.data;
          this.loading = false;
          console.log(respuesta);
          if (respuesta != null) {
            if (respuesta.procesado) {
              $("#popup_preview").modal("hide");
              this.$notificacion.info(
                "Estado de cuenta",
                "Se envió el estado de cuenta."
              );
            } else {
              this.$notificacion.error(
                "Estado de cuenta",
                "Sucedió un detalle al enviar el estado de cuenta."
              );
            }
          }
        }
      );
    },

    async getPreview() {
      this.loadingPage = true;
       //this.pagePreview = await this.getAsync()
      this.get(URL.ESTADO_CUENTA_PREVIEW + this.idAlumno, result => {
        if (result.data != null) {
          this.pagePreview = result.data;
          this.loadingPage = false;
        }
      });
    },

    cargarEstadoCuenta() {
      if (this.idAlumno != 0) {
        this.loading = true;
        this.get(`${URL.ESTADO_CUENTA}${this.idAlumno}`, result => {
          this.response = result.data;
          if (this.response != null) {
            console.log(JSON.stringify(this.response));
            this.estadoCuenta = this.response;
            this.loading = false;
          }
        });
      }
    },
    cargarAlumno() {
      this.get(URL.ALUMNOS_BASE + "/id/" + this.idAlumno, result => {
        this.alumno = result.data;
      });
    },
    seleccionarAlumno(row) {
      console.log("seleccion " + JSON.stringify(row));
    },

    buscarPorNombre() {
      console.log("Buscar por nombre " + this.criterioNombre);
      //this.lista = filtrarNombreAlumno(this.criterioNombre, this.listaAlumnos);
    }
  }
};
</script>
