<template >
  <nav   
    class="navbar navbar-vertical fixed-left navbar-expand-md navbar-light bg-white"         
    v-if="mostrarSideBar"
    id="sidenav-main"
  >
    <div class="container-fluid">
      <!-- Toggler -->
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#sidenav-collapse-main"
        aria-controls="sidenav-main"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >      
        <span class="navbar-toggler-icon"></span>
      </button>
      <!-- Brand -->
      <span v-if="usuarioSesion && usuarioSesion.logotipo_empresa">
        <router-link to="/Principal" class="navbar-brand pt-0"  >         
           <img :src="usuarioSesion.logotipo_empresa" class="rounded-lg"  width="90" height="90" />                            
        </router-link>       
      </span>
      <!-- User -->
      <ul class="nav align-items-center d-md-none">
        <!-- slae cuando es resposive
          <li class="nav-item dropdown">
          <a
            class="nav-link nav-link-icon"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >          
            <i class="fa fa-bell"></i>
          </a>
          <div
            class="dropdown-menu dropdown-menu-arrow dropdown-menu-right"
            aria-labelledby="navbar-default_dropdown_1"
          >
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">Something else here</a>
          </div>
        </li>
        -->
        <li class="nav-item dropdown">
          <a
            class="nav-link"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <div class="media align-items-center">
              <span class="avatar avatar-sm rounded-circle">
               <i class="fa fa-2x fa-smile-wink"></i>
                <!--<img alt="Image placeholder" src="./assets/img/theme/team-1-800x800.jpg-->
              </span>
            </div>
          </a>
          <div class="dropdown-menu dropdown-menu-arrow dropdown-menu-right">
            <div class="dropdown-header noti-title">
               <h6 class="text-overflow m-0">Hola!</h6>
            </div>

            <div class="dropdown-divider"></div>
            <a class="dropdown-item" @click="signout()">
               <i class="fa fa-sign-out-alt"></i>
               <span class="text-red">Salir</span>
            </a>  
          </div>
        </li>

        


      </ul>
      <!-- Collapse -->
      <div class="collapse navbar-collapse" id="sidenav-collapse-main">
        <!-- Collapse header -->
        <div class="navbar-collapse-header d-md-none">        
          <div class="row" v-if="usuarioSesion && usuarioSesion.logotipo_empresa">
              <div class="col-6 collapse-brand" >
              <img  :src="`${getLogo()}`" class="rounded-lg"  width="90" height="100" />                      
            </div>
            <div class="col-6 collapse-close">
              <button
                type="button"
                class="navbar-toggler"
                data-toggle="collapse"
                data-target="#sidenav-collapse-main"
                aria-controls="sidenav-main"
                aria-expanded="false"
                aria-label="Toggle sidenav"
              >
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>
        <!-- Form -->
        <!--
        <form class="mt-4 mb-3 d-md-none">
          <div class="input-group input-group-rounded input-group-merge">
            <input
              type="search"
              class="form-control form-control-rounded form-control-prepended"
              placeholder="Search"
              aria-label="Search"
            />
            <div class="input-group-prepend">
              <div class="input-group-text">
                <span class="fa fa-search"></span>
              </div>
            </div>
          </div>
        </form>-->
        <!-- Navigation -->
        <!--  
          boton que cierra el popup cuando es mini
          <button data-v-0a89599e="" type="button" data-toggle="collapse" data-target="#sidenav-collapse-main" aria-controls="sidenav-main" aria-expanded="true" aria-label="Toggle sidenav" class="navbar-toggler"><span data-v-0a89599e=""></span> <span data-v-0a89599e=""></span></button>

          -->
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/Principal" class="nav-link" >
              <i class="fa fa-home text-purple"></i> Asistencias
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/Asistencia" class="nav-link"  >
              <i class="fa fa-child text-blue"></i> Entrada de Alumnos
            </router-link>
          </li>                    
          <li class="nav-item">
            <router-link to="/CatAlumno" class="nav-link"  >
              <i class="fa fa-list-ul text-purple"></i> Alumnos
            </router-link>           
          </li>          
          <li class="nav-item">
            <router-link to="/Gastos" class="nav-link"  >
              <i class="fa fa-cash-register text-blue"></i> Gastos
            </router-link>
          </li>
           <li class="nav-item nav-with-child">            
            <router-link to="/administracion" class="nav-link">
              <i class="fa fa-cog text-blue"></i> Administración
            </router-link>
          </li>          
        </ul>
        <!-- Divider -->
        <hr class="my-3" />
        <!-- Heading -->
        <h6 class="navbar-heading text-muted"></h6>

        <ul class="navbar-nav mb-md-3">
          <li class="nav-item">
            <router-link
              to="/AsistenciasUsuarios"
              class="btn btn-block btn btn-outline-default"
              
            >Asistencia/Miss</router-link>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item active active-pro">
            <a class="nav-link" href="#">
              <i class="ni ni-send text-dark"></i>
              {{usuarioSesion && usuarioSesion.nombre_empresa ? usuarioSesion.nombre_empresa : ''}}              
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import CONSTANTES from "../helpers/Constantes";
import {getUsuarioSesion} from '../helpers/Sesion';

export default {
  name: "menu-principal",
  components: {},
  data() {
    return {      
      usuarioSesion: null,      
      mostrarSideBar:true,
      logotipoEmpresa:""
    };
  },
  mounted() {
    console.log("iniciando el template de menu");
    this.usuarioSesion = getUsuarioSesion();
    this.mostrarSideBar = !getUsuarioSesion().permiso_gerente;
    //this.$mostrarSidebar = !getUsuarioSesion().permiso_gerente;
    
  },
  methods: {
     signout() {
      console.log("Signout ");
      this.usuarioSesion = null;      
      clearSesion();
      this.$root.$emit("LOGOUT", "LOGOUT");
      this.$router.push("/");
    },
    getLogo(){
      console.log("getLogo");
        //this.logotipoEmpresa = this.usuarioSesion.logotipo_empresa ? this.usuarioSesion.logotipo_empresa: '../assets/logodef.png';
        return (this.usuarioSesion && this.usuarioSesion.logotipo_empresa) ? this.usuarioSesion.logotipo_empresa: '../assets/logodef.png';
    }
  }
};
</script>

<style scoped>
</style>

