  <template>
  <span>
    <button
      type="button"
      :class="cssButton ? cssButton :'btn btn-sm btn-link text-danger'"
      v-on:click="iniciarRegistro()"
     >
       <span class="fa fa-plus"/> Movimiento
       <span  v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    </button>
   
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
  name: "popup-registro-movimiento",
  props: ["cssButton","callback"],
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
    async iniciarRegistro(){     
      if (this.idAlumno != 0) {        
          this.loading = true;
          const result  = await this.getAsync(`${URL.ESTADO_CUENTA}${this.idAlumno}`);
          console.log(result);
          this.alumno = result && result.alumno;
          console.log(" ALUMNO"+ JSON.stringify(this.alumno));
          this.loading = false;        
      }  
      
    },   
  }
};
</script>
