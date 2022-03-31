  <template>
  <div class="row ">
  <div class="col-9">
    <span                  
      v-if="!isModificacion"      
    > 
      <span  v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>      
      <span :class="eliminaro ? 'eliminado':''">{{nombreModel}}</span>       
    </span>  
    <input type="text"
            class="form-control"            
            v-model="nombreModel"            
            :disabled="loading"
            v-else>
        <span v-if="textoValidacion" class="text-sm text-danger">{{textoValidacion}}</span>        
        <span v-if="(nombreModel != nombre) && !loading" @click="cancelarModificacion()" class="text-xs text-danger pointer" title="Click para cancelar la edición">        
            Cancelar modificación
        </span>
    </div>
    <div class="col-3 d-flex justify-content-center">
      <button v-if="!isModificacion" @click="iniciarModificacion()" class="btn btn-sm btn-link" >
        <i class="fa fa-edit"> </i>
      </button>      
      <button v-if="nombreModel != nombre" @click="modificar()" class="btn btn-sm btn-link text-primary" title="Click para guardar los cambios" >
          <i  v-if="!loading" class="fas fa-check"> </i>
          <div v-else class="spinner-border spinner-border-sm" role="status"/>  
      </button>
      <button type="button" v-if="!loading" @click="iniciarEliminacion()" class="btn btn-link btn-sm text-danger">
                  <i class="fas fa-trash" title="Eliminar" ></i>
      </button>                                
      </div>
  </div>
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
      nombreMostrar: "",      
      loading: false,      
      textoValidacion:"",
      isModificacion: false,      
      modificacionRealizada: false,      
      eliminado:false
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
    cancelarModificacion(){
        this.isModificacion = false;        
        this.modificacionIniciada=false;
        this.nombreModel = this.nombre;
    },    
    async modificar(){     
     if (!this.nombreModel) {
          this.textoValidacion = "Escribe el nombre";
          return;
     }        
        this.loading = true;
        const result  = await this.putAsync(`${URL.CATALOGO_CATEGORIA}/${this.id}`,{co_empresa:this.usuarioSesion.co_empresa, nombre:this.nombreModel,genero:this.usuarioSesion.id});
        if(result){
          this.nombre = result.nombre;          
          this.cancelarModificacion();
        }
        console.log(result);        
        this.loading = false;               
    },    
    async iniciarEliminacion(){      
      if(confirm(`¿Deseas eliminar ${this.nombre}?`)){
        this.loading = true;
        const result  = await this.patchAsync(`${URL.CATALOGO_CATEGORIA}/${this.id}`,{co_empresa:this.usuarioSesion.co_empresa, nombre:this.nombreModel,genero:this.usuarioSesion.id});
        if(result){          
          this.eliminado = true;
          this.cancelarModificacion();
        }
        console.log(result);        
        this.loading = false;                               
      }
    }
  }
};
</script>
<style scoped>
.eliminado {
    text-decoration:line-through;
    color: gray;
}
</style>