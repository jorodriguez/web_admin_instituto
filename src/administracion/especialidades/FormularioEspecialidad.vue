<template>
  <span>                 
          <div class="form-group">
            <label for="nombreInput">
              Nombre
              <span class="text-danger">*</span>
            </label>
          <input
              id="nombreInput"
              type="text"
              v-model="especialidad.nombre"
              class="form-control"
              placeholder="Nombre de la especialidad"
              required
              autofocus
            />                       
          </div>
            <div class="form-group">
            <label for="descripcionInput">
              Descripcion
              <span class="text-danger">*</span>
            </label>            
            <textarea
              id="descripcionInput"
              type="text"
              v-model="especialidad.descripcion"
              class="form-control"
              placeholder=""
              required            
            ></textarea>
          </div>
          <div class="form-group">
            <label for="duracionInput">
              Duración (semanas)
              <span class="text-danger">*</span>
            </label>
            <input
              id="duracionInput"
              type="number"
              v-model="especialidad.duracion"
              class="form-control"
              placeholder="ejemplo 12"
            />
          </div>                         
  </span>
</template>

<script  >
import Popup from "../../controller/Popup";
import Loader from "../../components_utils/Loader";

export default {
  name: "formulario-especialidad",  
  props: ["especialidad"],
  components: {    
    Popup,
    Loader
  },
  data() {
    return {         
      operacion: "INSERT",
      loader: false,          
    };
  },
  mounted() {
    console.log("iniciando el componente de form especialidad ");
    //this.usuarioSesion = getUsuarioSesion();    
  },
  methods: {
    
  }
};
</script>

<style scoped>
</style>
