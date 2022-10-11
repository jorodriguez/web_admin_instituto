<template>
  <span>  
    
                      <div v-if="rol" class="custom-control custom-switch" >                      
                        <input type="checkbox" v-model="rol.seleccionado" @change="cambiarEstado($event)" class="custom-control-input" :id="`'customSwitch_'${rol.si_rol}_${usuario_id}`">
                        <label class="custom-control-label" :for="`'customSwitch_'${rol.si_rol}_${usuario_id}`">
                            <span  v-if="loader" class="spinner-border text-info spinner-border-sm" role="status"/> {{rol.nombre}}
                        </label>                        
                      </div>    
                      <small v-if="rol" class="text-gray">{{rol.descripcion}}</small>        
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

export default {
  name: "switch-permiso-rol",
  mixins: [operacionesApi],
  props: ["rol_value","usuario_id", "metodo_refrescar"],
  components: {    
    Popup,
    Loader
  },
  data() {
    return {
      rol:{},      
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
      console.log("Init " + JSON.stringify(this.rol_value));      
      this.rol = Object.assign({}, this.rol_value);
      
    },

    async cambiarEstado(event) {
      
      console.log("cambiarEstado");
      this.loader = true;

      const data = {
          seleccionado:this.rol.seleccionado,
          siRol : this.rol.si_rol,
          siUsuario : this.usuario_id,
          coSucursal: this.usuarioSesion.co_sucursal,
          coEmpresa: this.usuarioSesion.id_empresa
      }
      
      console.log(data);

      let respuesta = await this.putAsync(`${URL.USUARIO_ROL}/${this.usuarioSesion.id}`,data);    

      if(respuesta){
          
          this.rol.seleccionado = !respuesta.eliminado;

          console.log("repsuesta "+JSON.stringify(respuesta));
      }

      this.loader = false;
    },
      
 
  }
};
</script>

<style scoped>
</style>
