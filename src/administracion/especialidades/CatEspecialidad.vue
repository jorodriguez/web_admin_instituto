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
        <PopupNuevaEspecialidad :metodo_refrescar="init"></PopupNuevaEspecialidad>

      </div>

    </div>
    <Loader :loading="loader" />
    <br />

    <div class="table-responsive">
      <div>
        <table class="table align-items-center">
          <thead class="thead-light">
            <tr>
              <th scope="col" class="sort" data-sort="name">Especialidad</th>
              <th scope="col" class="sort" data-sort="name"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody class="list">

            <tr v-for="row in lista" :key="row.id">
              <td scope="row">
                <div class="media align-items-center">
                  <a href="#">
                    <img v-if="row.foto" class="mr-3 img-fluid rounded border border-gray  pointer"
                       width="150" :src="row.foto" alt="Especialidad"
                       />
                    <div v-else class="card border mr-3" style="width: 150px">
                      <div class="card-body">                        
                          <i class="fa fa-image fa-3x"></i>                                                  
                      </div>
                    </div>                    
                  </a>
                  <div class="media-body text-left align-top " >
                    <p class="name mb-0">{{row.nombre}}</p>
                    <p class="name mb-0 text-sm">{{row.duracion}} {{row.nombre_duracion}}{{row.duracion > 1 ? 's':''}} </p>
                    <i class="name mb-0 text-sm">{{row.descripcion}}</i>                    
                  </div>
                </div>
              </td>
              <td style="width: 6rem;">
                           
              </td>

              <td class="text-right">
                <PopupOperacionesEspecialidad :especialidad_value="row" :metodo_refrescar="init" :dropdown="true" />                   
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
import CONSTANTES from '../../helpers/Constantes'
import PopupNuevaEspecialidad from './PopupNuevaEspecialidad.vue';
import PopupOperacionesEspecialidad from './PopupOperacionesEspecialidad.vue';

export default {
  name: "cat-especialidad",
  mixins: [operacionesApi],
  components: {
    Popup, Loader, PopupNuevaEspecialidad,PopupOperacionesEspecialidad
  },
  data() {
    return {
      usuarioSesion: null,
      response: "",
      lista: [],
      especialidad: null,
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
    async cargar() {
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
