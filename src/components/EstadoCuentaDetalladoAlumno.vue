<template>
  <span>
    <button
      type="button"
      class="btn btn-sm btn-link"
      v-on:click="verEstadoCuenta()"
    >
    <i class="fa fa-print"></i>  Historial
    </button>

    <Popup id="popup_preview_estado_cuenta_detallado" size="lg" :show_button_close="true">
      <div slot="header">
        Estado de cuenta detallado      
      </div>    

      <div slot="content" style="color:#000">        
        <!--<div class="row">
          <table  class="table table-sm">            
            <tr align="left">
              <td width="10%" >Correos</td>
              <td>              
                  {{ this.estadoCuenta.alumno.correo ? this.estadoCuenta.alumno.correo : ''}}
                  <span class="text-danger" v-if="!this.estadoCuenta.alumno.correo"> No tiene correo </span>
              </td>
            </tr>
            <tr align="left">
              <td>Correos Anexos</td>
              <td>              
                   <input
                      type="text"
                      v-model="correo_anexo"
                      :disabled="!this.estadoCuenta.alumno.correo"
                      :class="`form-control form-control-sm ${!this.estadoCuenta.alumno.correo ? 'disabled':''} `"
                      placeholder="Correo "
                    />                  
              </td>
            </tr>
          </table>
        </div>-->
        <span v-if="this.loadingPage">Cargando..</span>
        <span v-else v-html="this.pagePreview"></span>
      </div>
      <div slot="footer">      
        <button
          class="btn btn-primary"          
          :disabled="this.loading || !this.pagePreview"
          @click="imprimir()"
        >
          <i class="fa fa-print"></i> Imprimir
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
  name: "estado-cuenta-detallado",
  props: ["uidAlumno"],
  data() {
    return {
      id: 0,
      resultado: {},
      usuarioSesion: {},
      criterioNombre: "",
      estadoCuenta: null,
      loading: false,
      loadingPage: false,
      pagePreview: null,
      correo_anexo:""
    };
  },
  mounted() {
  
    this.onInit();
  },
  methods: {
    onInit() {
      this.usuarioSesion = getUsuarioSesion();
    },

   async verEstadoCuenta() {      
      await this.getPreview();
      $("#popup_preview_estado_cuenta_detallado").modal("show");
    },

    async enviarEstadoCuenta() {
      this.loading = true;

      const html = await  this.getAsync(`${URL.REPORTES_BASE}/estado-cuenta-detallado/${this.uidAlumno}`);

      this.loading = false;
   },

    async getPreview() {
      this.loadingPage = true;
       //this.pagePreview = await this.getAsync()
      this.pagePreview  = await this.getAsync(`${URL.REPORTES_BASE}/estado-cuenta-detallado/${this.uidAlumno}`);        
      this.loadingPage = false;
    },

    imprimir(){
      const WinPrint = window.open('', '', 'width=800,height=900');

      WinPrint.document.write(`
             <center>
              ${this.pagePreview}
              </center>
          `);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();

    },

   /* cargarEstadoCuenta() {
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
    },*/
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
