  <template>
  <span>
    <span            
      v-on:click="iniciarModificacion()"
      v-if="!isModificacion"
    > 
      <span  v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>      
      {{nombreModel}}      
    </span>  
    <input type="text"
            class="form-control"
            v-model="nombreModel"
            v-if="!isModificacion"/>     
    <button v-if="isModificacion" class="btn btn-sm btn-link" >
        Modificar
    </button>
  </span>
</template>
    
 
<script>
import { operacionesApi } from "../../../helpers/OperacionesApi";
import { getUsuarioSesion } from "../../../helpers/Sesion";
import URL from "../../../helpers/Urls";

export default {
  components: {

  },
  mixins: [operacionesApi],
  name: "modificar-categoria",
  props: ["id","nombre"],
  data() {
    return {      
      usuarioSesion: {},
      nombreModel: "",      
      loading: false,      
      isModificacion: false,      
    };
  },
  mounted() {    
    this.onInit();
  },
  methods: {
    onInit() {      
      this.usuarioSesion = getUsuarioSesion();
      this.nombreModel = this.nombre;
    },
    iniciarModificacion(){
        this.isModificacion = true;
    },
    async modificar(){     
     if (!this.nombreModel) {
           
     }        
        this.loading = true;
        const result  = await this.getAsync(`${URL.ESTADO_CUENTA}${this.idAlumno}`);
        console.log(result);
        this.alumno = result && result.alumno;
        console.log(" ALUMNO"+ JSON.stringify(this.alumno));
        this.loading = false;          
      
      
    },    
  }
};
</script>
