<template>
  <div class="catalogo_especialidad">
    <h1>Especialidades ({{contador}})</h1>
    <small>{{usuarioSesion.nombre_sucursal}}</small> 
    <div class="row">
      <div class="col-1">
        <router-link to="/Administracion" class="btn btn-secondary btn-lg">
          <i class="fas fa-arrow-circle-left text-gray"></i>
        </router-link>        
      </div>
      <div class="col-1">        
        <!--<PopupNuevoUsuario :metodo_refrescar="init"></PopupNuevoUsuario>-->
      </div>
    
    </div>   
    <Loader :loading="loader" />
    <br/>
    
    <div class="table-responsive">
    <div>
    <table class="table align-items-center">
        <thead class="thead-light">
            <tr>
                <th scope="col" class="sort" data-sort="name">Foto</th>                
                <th scope="col" class="sort" data-sort="name">Nombre</th>                
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody class="list">
            
            <tr v-for="row in lista"
                   :key="row.id"    >
                <th scope="row">
                    <div class="media align-items-center">
                        <a href="#" class="avatar rounded-circle mr-3">                        
                              <img v-if="row.foto" class="avatar avatar-md rounded-circle"  alt="usuario" :src="row.foto">
                              <span v-else > <i class="fa fa-user fa-2x " ></i> </span>
                              <!--<img v-else alt="usuario" class="avatar avatar-md rounded-circle" src="../../assets/user.png">-->
                        </a>
                        <div class="media-body text-left">
                            <span class="name mb-0 text-sm">{{row.nombre}}</span>                        
                        </div>
                    </div>
                </th>                
                <td style="width: 6rem;" >                               
                     <!--<PopupPermisosUsuario :usuario_value="row" 
                                            :metodo_refrescar="init" 
                                            :color_icon="row.roles == 0 ? 'text-danger':''"
                                            :label="`${row.roles == 0 ? 'Sin': row.roles} Permiso${usuario.roles== 1 ? '':'s'}`"/>                    
                                            -->
                </td>             
                                
                <td class="text-right">
                    <PopupNuevaEspecialidad :usuario_value="row" :metodo_refrescar="init" :dropdown="true" />                   
                </td>
            </tr>
        </tbody>
    </table>
</div>
    </div>


    
  </div>
</template>

<script  >
import URL from "../../helpers/Urls";
import { operacionesApi } from "../../helpers/OperacionesApi";
import { getUsuarioSesion } from '../../helpers/Sesion';
import CatEspecialidad from "../../models/CatEspecialidad";
import Popup from "../../controller/Popup";
import Loader from "../../components_utils/Loader";
import CONSTANTES  from '../../helpers/Constantes'
import PopupNuevaEspecialidad from './PopupNuevaEspecialidad.vue';

export default {
  name: "cat-usuario",
  mixins: [operacionesApi],
  components: {
    Popup, Loader,PopupNuevaEspecialidad
  },
  data() {
    return {            
      usuarioSesion: null,
      response: "",      
      lista: [],      
      especialidad:null,
      loader: false,
      contador: 0,            
    };
  },
  mounted() {
    console.log("iniciando el componente usuario ");

    this.usuarioSesion = getUsuarioSesion();
    this.init();
    this.especialidad = new CatEspecialidad(); 
  },
  methods: {
    init() {
      console.log("Init");      
      this.cargar();
    },    
    async cargar(){
      this.loader = true;     
      this.lista = await this.getAsync(`${URL.ESPECIALIDADES_BASE}/${this.usuarioSesion.id_empresa}/${this.usuarioSesion.co_sucursal}`);      
      this.contador = this.lista.length || 0;
      this.loader = false;     
    }
  }
};
</script>

<style scoped>
</style>
