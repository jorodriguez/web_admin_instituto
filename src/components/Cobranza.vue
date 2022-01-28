<template>
  <div class="cat_alumno">
    <h1>Cobranza </h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>
    <div class="row">
      <!--<div class="col-auto mr-auto">       
        <router-link to="/Inscripcion" class="btn btn-primary btn-lg">
          
        </router-link>              
        
      </div>
      <div class="col-auto">
       
      </div>-->
    </div>

    <br />
    
    <!-- </form>-->

    

    <div class="card">
      <div class="card-body">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Buscar por nombre.."
            v-model="criterioNombre"
            v-on:keyup.enter="buscarPorNombre()"
            aria-label="Buscar por nombre.."            
          />
           <div class="input-group-append">
            <button
              class="btn btn-outline-secondary "
              type="button"
              v-on:click="buscarPorNombre()"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>
        <!-- filtro-->
        <div class="row h1">    
          <div class="col">Lunes</div>
          <div class="col">Martes</div>
          <div class="col">Miercoles</div>
          <div class="col">Jueves</div>
          <div class="col">Viernes</div>
        </div>
        
        <div v-if="loader" class="mx-auto">
            <Loader :loading="loader" :mini="true" />
        </div>

        <div class="row">                 
          <div
            class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 mt-2"
            v-for="row in lista"
            :key="row.id"            
          >
            <div class="card border-light">
              <div class="d-flex justify-content-end ">
                <div class="btn-group" role="group">
                  <button
                    id="btnGroupDrop1"
                    type="button"
                    class="btn btn-link btn-block btn-sm dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  ></button>
                  <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">                  
                    <button
                      class="dropdown-item"
                      @click="select(row, 'DELETE')"
                      href="#"
                    >
                      <i class="fas fa-user-minus"></i> Iniciar Baja
                    </button>
                  </div>
                </div>
              </div>

              <img
                class="card-img-top pointer rounded-circle mx-auto"
                style="width:100px"                
                :src="row.foto"
                alt="Foto"
                @click="verPerfil(row)"
                title="Cambiar la foto"
              />

              <div class="card-body p-1 pointer" @click="verPerfil(row)" >
                <h4 class="card-text">
                  {{ row.alumno }}                  
                </h4>
                <h5 class="card-text pt-0 small">
                  {{ row.apellidos }}
                </h5>
                <h6
                  :style="row.color_especialidad ? 'background-color:' + row.color_especialidad : ''"
                  class="badge badge-info text-wrap"
                >
                  {{ row.especialidad }}
                </h6>                                                    
                <small class="font-weight-normal">{{row.dia}} turno {{ row.horario }}</small>
              </div>
            </div>
          </div>

                    <!-- Mensajes para la busqueda y carga-->
          <div v-if="criterioNombre != '' && lista.length == 0" class="mx-auto">
            <p class="text-muted ">Ningún resultado</p>
          </div>
          <div
            v-if="criterioNombre == '' && lista.length == 0 && !loader"
            class="mx-auto"
          >
            <p class="text-muted ">Oprime ENTER para listar todo</p>
          </div>
          <div v-if="loader" class="mx-auto">
            <Loader :loading="loader" :mini="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Datepicker from 'vuejs-datepicker';
import URL from "../helpers/Urls";
import { operacionesApi } from "../helpers/OperacionesApi";
import { en, es } from 'vuejs-datepicker/dist/locale'
import { getUsuarioSesion } from '../helpers/Sesion';
import Loader from '../components_utils/Loader';
import moment from 'moment'


export default {
  name: "Cobranza",
  components: {
    Datepicker,Loader
  },
  mixins: [operacionesApi],
  data() {
    return {            
      response: "",
      usuarioSesion: {},
      sesion: {},      
      criterioNombre: "",
      lista: [],      
      listaRespaldo: [],           
      mensaje: "",
      es: es,           
      observacionesBaja:"",
      loader:false
    };
  },
  mounted() {
    console.log("##### iniciando lista de cobranza ####");

    this.usuarioSesion = getUsuarioSesion();
            
    this.cargarListaCobranza();  
  },
  methods: {   
    async cargarListaCobranza(){
      this.loader = true;
      this.lista = await this.getAsync(URL.COBRANZA + "/colegiaturas/" + this.usuarioSesion.co_sucursal);
      this.listaRespaldo = Object.assign(this.lista,{});
      this.loader = false;
    },    
    select(rowSelect, operacion) {
      console.log("fila seleccionada " + rowSelect.adeuda);
      this.operacion = operacion;
      this.input = rowSelect;
      this.mensaje = "";      
    },
    verPerfil(rowSelect) {
      console.log("fila seleccionada " + rowSelect.uid);
      this.$router.push({ name: "PerfilAlumno", params: { uid: rowSelect.uid } });
    },
    buscarPorNombre() {
      console.log("Buscar por nombre " + this.criterioNombre);
      if (this.criterioNombre == '') {
        this.lista = this.listaRespaldo;
      } else {

        this.lista = this.listaRespaldo
          .filter(
            e =>
              e.alumno.toUpperCase().includes(this.criterioNombre.toUpperCase())
              || (e.apellidos ? e.apellidos.toUpperCase().includes(this.criterioNombre.toUpperCase()) : false)
          );

      }
    },
    cambiarSucursal(row) {
      this.$router.push({ name: "CambioSucursal", params: { id_alumno: row.id } });
    },
    subirFotoPerfil(id) {

      this.$router.push({ name: "SubirFotoAlumno", params: { id: id } });
    }
  }
};
</script>

<style scoped></style>
