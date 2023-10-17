<template >

    <!--<div class="bg-gradient-primary pb-6 pt-4 pt-md-2" > </div>-->
      <!-- Header -->
    
    <div  class="header pb-2 pt-5 pt-lg-4 d-flex align-items-center" 
          style="min-height: 80px; ">
    
      <!-- Mask -->      
      <span class="mask opacity-8" :style="`background-color:${color_tema} !important;`"></span>
      <!-- Header container -->
      <div class="container-fluid ">      
        <div class="row ">
          <div class="col d-flex justify-content-center  align-items-center ">                       
          <!--<p class="text-white mt-0 mb-5">Cuenta</p>-->
            <!--<h1 class="display-6 text-white">Hello Jesse</h1>
            <p class="text-white mt-0 mb-5">This is your profile page. You can see the progress you've made with your work and manage your projects or assigned tasks</p>
            <a href="#!" class="btn btn-info">Edit profile</a>
            -->
          </div>
        </div>        
      </div>
     </div>

</template>

<script>
import Vue from 'vue';
import CONSTANTES from "../helpers/Constantes";
import {getUsuarioSesion} from '../helpers/Sesion';

export default {
  name: "sidebar-principal",
  data() {
    return {
      usuarioSesion: {},
      mostrarmenu: false,
      color_tema:'',
      revisarSesionPromise: null,
      revisarSesion: null,
      mostrarSideBar:Vue.prototype.$mostrarSidebar
    };
  },
  mounted() {
    console.log("iniciando el template de menu");
    this.usuarioSesion = getUsuarioSesion();  
    this.mostrarmenu = (getUsuarioSesion() != null);        
    this.color_tema = this.usuarioSesion.color_tema;
    //this.mostrarmenu= (this.usuarioSesion != null);        
    
  },
  methods: {
   
  }
};
</script>
<style scoped>
</style>

