  <template>
  <span>
    <button
      type="button"
      class="btn btn-sm btn-link"
      v-on:click="iniciarBaja()"
    >
      Iniciar Baja{{idAlumno}}
    </button>

    <div
      id="modal_eliminar_alumno"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      data-keyboard="false"
      data-backdrop="static"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">
              Confirmar baja del alumno
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h4 v-if="alumno">
              <strong>{{ alumno.nombre }} {{ alumno.apellidos }}</strong>
            </h4>
            <div class="form-group text-left">
              <label for="fecha_baja">Fecha de baja</label>
              <datepicker
                name="fecha_baja"
                v-model="fechaBaja"
                input-class="form-control"
                :format="'yyyy-MM-dd'"
                :bootstrap-styling="true"
                :language="es"
              ></datepicker>
            </div>
            <div class="form-group">
              <textarea
                v-model="observacionesBaja"
                class="form-control"
                placeholder="Observaciones"
                rows="3"
              >
              </textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger"
              v-on:click="eliminar()"
              data-dismiss="modal"
            >
              Dar de Baja
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </span>
</template>
    
 
<script>
import Popup from "../../../controller/Popup";
import { operacionesApi } from "../../../helpers/OperacionesApi";
import { getUsuarioSesion } from "../../../helpers/Sesion";
import URL from "../../../helpers/Urls";
import Vue from "vue";
import Datepicker from 'vuejs-datepicker';
import { en, es } from 'vuejs-datepicker/dist/locale'

export default {
  components: {
    Popup,
    Datepicker
  },
  mixins: [operacionesApi],
  name: "popup-baja",
  props: ["idAlumno","callback"],
  data() {
    return {
      alumno:null,     
      usuarioSesion: {},
      criterioNombre: "",      
      loading: false,
      fechaBaja:new Date(),
      observacionesBaja:"",
       es: es,   
    };
  },
  mounted() {    
    this.onInit();
  },
  methods: {
    onInit() {
      this.usuarioSesion = getUsuarioSesion();
    },
    async iniciarBaja(){     
     if (this.idAlumno != 0) {        
        this.loading = true;
        const result  = await this.getAsync(`${URL.ESTADO_CUENTA}${this.idAlumno}`);
        this.alumno = result && result.alumno;
        console.log(" ALUMNO"+ JSON.stringify(this.alumno));
        this.loading = false;        
    }     
        
    if (this.alumno != null && this.alumno != undefined && this.alumno.total_adeudo > 0) {        
        this.$notificacion.warn('Baja de alumno', 'No es posible dar de baja el alumno por motivos de deuda activa.');
        return;
      } else {
        $("#modal_eliminar_alumno").modal("show");
      }
      
    },
    eliminar() {
      console.log("Modificar el id " + this.input.id);
      const params = {
        fechaBaja: this.fechaBaja,
        observaciones: this.observacionesBaja,
        genero: this.usuarioSesion.id
      };

      this.put(URL.ALUMNOS_BASE + "/baja/" + this.input.id, params, result => {
        console.log(" " + result.data);
        if (result.data != null) {       
          this.$notificacion.error(
            "Registro de Baja de alumno",
            "Se registro la baja del alumno " + this.input.nombre + "."
          );
          this.loadFunction();
        }
      });
    },
  }
};
</script>
