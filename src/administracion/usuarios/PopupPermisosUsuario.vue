<template>
  <span>  
    <Loader :loading="loader" />    
   
    <button :class="`btn btn-link btn-sm ${color_icon}`" @click="iniciarAsignacion()"><i :class="`fa fa-key`"></i> {{label}} </button>
        
    <Popup :id="'popup_permisos_'+id_popup" :show_button_close="false" size="md">
      <div slot="header">Permisos para {{usuario.nombre}} </div>
      <div slot="content">
        <div class="container text-left">
            <div class="card">              
              <ul  class="list-group list-group-horizontal">
                  <li v-for="rol in listaRoles"                            
                            :key="rol.id"  
                             class="list-group-item">                                      
                             <switch-permiso-rol :rol_value="rol" :usuario_id="usuario.id" />                    
                  </li>                                    
              </ul>
            </div>
        </div>
      </div>
      <div slot="footer">        
          <button class="btn btn-secondary" @click="cerrar()">Cerrar</button>
      </div>
    </Popup>
  
  </span>
</template>

<script  >

import URL from "../../helpers/Urls";
import { operacionesApi } from "../../helpers/OperacionesApi";
import { getUsuarioSesion } from "../../helpers/Sesion";
import { UsuarioModel } from "../../models/UsuarioModel";
import Popup from "../../controller/Popup";
import Loader from "../../components_utils/Loader";
import CONSTANTES from "../../helpers/Constantes";
import SwitchPermisoRol from './SwitchPermisoRol.vue';

export default {
  name: "permisos-usuario",
  mixins: [operacionesApi],
  props: ["usuario_value","metodo_refrescar", "id_usuario","label","color_icon"],
  components: {    
    Popup,
    Loader,
    SwitchPermisoRol
  },
  data() {
    return {
      usuario: UsuarioModel,
      usuarioMemento: UsuarioModel,      
      usuarioSesion: null,      
      operacion: "INSERT",      
      loader: false,      
      loader_baja: false,      
      loaderAsignar: false,            
      id_popup: "",
      listaRoles:[],
      rolesUsuario:[],
    };
  },
  mounted() {
    console.log("iniciando el componente permisos de usuario ");
    this.usuarioSesion = getUsuarioSesion();
    this.init();
  },
  methods: {
    init() {
      console.log("Init " + JSON.stringify(this.usuario_value));      
      this.id_popup = this.nombreRandom();
      this.usuario = this.usuario_value;
      
    },

    async iniciarAsignacion() {
    
      this.loaderAsignar = true;
      
      this.listaRoles = await this.getAsync(`${URL.USUARIO_ROL}/${this.usuario_value.id}/${this.usuarioSesion.co_sucursal}`);

      $(`#popup_permisos_${this.id_popup}`).modal("show");

      this.loaderAsignar = false;
    },
    
    guardar() {
      console.log("guardar el id " + this.usuario.nombre);

      this.usuario.co_sucursal = this.usuarioSesion.co_sucursal;
      this.usuario.genero = this.usuarioSesion.id;

      this.loader = true;
    },    
    nombreRandom() {
      return Math.random()
        .toString(36)
        .substring(7);
    },
    async cerrar(){
      $(`#popup_permisos_${this.id_popup}`).modal("hide");
      await this.metodo_refrescar();            
    }
  }
};
</script>

<style scoped>
</style>
