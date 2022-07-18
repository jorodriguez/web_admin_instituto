<template>
  <span>  
    <Loader :loading="loader" />    
     <span v-if="usuario.acceso_sistema" class="pl-2 text-wrap">
                 <span v-for="rol in usuario.roles"                            
                            :key="rol.si_usuario_sucursal_rol" 
                            > 
                    <span class="badge badge-info pointer">
                             {{rol.rol}} 
                             <i class="text-orange fa fa-times"></i>
                          </span>                                                    
                  </span>        
    </span>     
    <button class="btn btn-link btn-sm " @click="iniciarAsignacion()" > <i class="fa fa-key"></i> Asignar Permisos </button>
    
    
    <Popup :id="'popup_permisos_'+id_popup" show_button_close="true" size="md">
      <div slot="header">Permisos para {{usuario.nombre}} </div>
      <div slot="content">
        <div class="container text-left">
            <div class="card">              
              <ul  class="list-group list-group-horizontal">
                  <li v-for="rol in listaRoles"                            
                            :key="rol.id"  
                             class="list-group-item">                                      
                      <div class="custom-control custom-switch">                      
                        <input type="checkbox" v-model="rol.seleccionado"  class="custom-control-input" :id="`'customSwitch_'${rol.id}`">
                        <label class="custom-control-label" :for="`'customSwitch_'${rol.id}`">
                            {{rol.nombre}}                            
                        </label>                        
                      </div>    
                      <small class="text-gray">{{rol.descripcion}}</small>                
                  </li>                                    
              </ul>
            </div>
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-primary" :disabled="loader" @click="guardar()">
          <Loader :loading="loader" :mini="true" />Guardar
        </button>
      </div>
    </Popup>

    <Popup :id="'popup_permisos_baja_'+id_popup_baja" show_button_close="true" size="md">
      <div slot="header">Confimar  </div>
      <div slot="content">
        <div class="container text-left">

        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-danger" :disabled="loader_baja" @click="eliminar()">
          <Loader :loading="loader_baja" :mini="true" />Confirmar
        </button>
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

export default {
  name: "permisos-usuario",
  mixins: [operacionesApi],
  props: ["usuario_value","metodo_refrescar", "id_usuario"],
  components: {    
    Popup,
    Loader
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
      id_popup_baja: "",
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
      this.id_popup_baja = this.nombreRandom();
      this.id_popup = this.nombreRandom();
      this.usuario = this.usuario_value;
      
    },

    async iniciarAsignacion() {
    
      this.loaderAsignar = true;
      
      this.listaRoles = await this.getAsync(URL.ROL);

      this.procesarListaRoles();

      $(`#popup_permisos_${this.id_popup}`).modal("show");

      this.loaderAsignar = false;
    },
    procesarListaRoles(){
      console.log("procesarListaRoles "+this.listaRoles.length);

      for(let i = 0; i < this.listaRoles.length; i++){
                   
          this.listaRoles[i].seleccionado = false;
          
          console.log("rol "+this.listaRoles[i].nombre);

          for(let x = 0; x < this.usuario.roles.length; x++){

              const rolUsuario = this.usuario.roles[x];

              if(rolUsuario.si_rol == this.listaRoles[i].id){
                console.log("rol ECNONTRADO");
                this.listaRoles[i].seleccionado = true;
              }
          }
      }      
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
    }
  }
};
</script>

<style scoped>
</style>
