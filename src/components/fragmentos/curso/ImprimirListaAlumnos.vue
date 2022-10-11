  <template>
  <span>
    <button
      type="button"
      class="btn btn-sm btn-link text-primary"      
      @click="imprimir()"
    >
      <span  v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <i v-else class="fas fa-print "></i>       
      <p class="text-sm pb-0 m-0"> {{label}}  </p>
    </button>

    <Popup  id="popup_imprimir_lista" :show_button_close="true">
      <div slot="header">
          <span>Lista de alumnos</span>           
      </div>
      <div slot="content">
        
      </div>
      <div slot="footer">
        <button class="btn btn-info"  @click="imprimir(true)">imprimir</button>        
      </div>
    </Popup>

  </span>
</template>
    
 
<script>
import Popup from "../../../controller/Popup";
import { operacionesApi } from "../../../helpers/OperacionesApi";
import { getUsuarioSesion } from "../../../helpers/Sesion";
import URL from "../../../helpers/Urls";
import Vue from "vue";

export default {
  components: {
    Popup,
    Datepicker
  },
  mixins: [operacionesApi],
  name: "imprimir-alumnos",
  props: ["uuidCurso","label","callback"],
  data() {
    return {      
      usuarioSesion: {},      
      loading: false,            
    };
  },
  mounted() {    
    this.onInit();
  },
  methods: {
    onInit() {
      this.usuarioSesion = getUsuarioSesion();
    },    
    async imprimir() {

      console.log("@imprimir lista alumnos "+this.uuidCurso);

      console.log(`${URL.REPORTES_BASE}/alumnos/html/${this.uuidCurso}/${this.usuarioSesion.id}`);

      this.loading = true;
     
      const html  = await this.getAsync(`${URL.REPORTES_BASE}/alumnos/html/${this.uuidCurso}/usuario/${this.usuarioSesion.id}`);

      this.loading = false;

      const WinPrint = window.open('', '', 'width=800,height=900');

      WinPrint.document.write(`
             <center>
              ${html}
              </center>
          `);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
      },
  }
};
</script>
