<template>
  <span>        
          <!--  <ValidationObserver ref="observer" v-slot="{ invalid }">-->        
          <div class="form-group">
            <label for="nombreInput">
              Nombre completo
              <span class="text-danger">*</span>
            </label>
            <!--<ValidationProvider rules="required" v-slot="{errors}">-->
            <input
              id="nombreInput"
              type="text"
              v-model="usuario.nombre"
              class="form-control"
              placeholder="Nombre completo"
              required
              autofocus
            />             
            <!--  <span>{{ errors[0] }}</span>
            </ValidationProvider>-->
          </div>
            <div class="form-group">
            <label for="aliasInput">
              Nombre corto
              <span class="text-danger">*</span>
            </label>
            <!--<ValidationProvider rules="required" v-slot="{errors}">-->
            <input
              id="aliasInput"
              type="text"
              v-model="usuario.alias"
              class="form-control"
              placeholder="Por ejemplo Lic. Ana"
              required
              autofocus
            />            
            <!--  <span>{{ errors[0] }}</span>
            </ValidationProvider>-->
          </div>
          <div class="form-group">
            <label for="correoInput">
              Correo
              <span class="text-sm text-primary"><span class="text-danger">*</span>(se usará para entrar al sistema y le llegaŕa un correo)</span>
            </label>
            <input
              id="correoInput"
              type="email"
              v-model="usuario.correo"
              class="form-control"
              placeholder="micorreo@ejemplo.com"
            />
          </div>

           <!--<div class="form-group">
            <label for="sueldoMensualInput">
              Sueldo Mensual
              <span class="text-danger">*</span>
            </label>
            <input
              id="sueldoMensualInput"
              type="number"
              v-model="usuario.sueldo_mensual"
              class="form-control"
              placeholder="Sueldo mensual"
              required
            />             
          </div>-->

          <div class="row">
            <div class="col-6">
              <label>
                Hora Entrada
                <span class="text-danger">*</span>
              </label>
              <vue-timepicker
                v-model="usuario.hora_entrada"
                :minute-interval="15"
                :hour-range="[[7, 20]]"
                :hide-disabled-hours="true"
                hour-label="hora"
                minute-label="minuto"
                format="HH:mm"
                placeholder="00:00"
              ></vue-timepicker>
            </div>
            <div class="col-6">
              <label>
                Hora Salida
                <span class="text-danger">*</span>
              </label>
              <vue-timepicker
                v-model="usuario.hora_salida"
                :min="usuario.hora_entrada"
                :minute-interval="15"
                :hour-range="[[7, 20]]"
                :hide-disabled-hours="true"                
                hour-label="hora"
                minute-label="minuto"
                format="HH:mm"
                placeholder="00:00"
              ></vue-timepicker>              
            </div>
          </div>          
             
  </span>
</template>

<script  >
import Datepicker from "vuejs-datepicker";
import URL from "../../helpers/Urls";
import { operacionesApi } from "../../helpers/OperacionesApi";
import { en, es } from "vuejs-datepicker/dist/locale";
import { getUsuarioSesion } from "../../helpers/Sesion";
import VueTimepicker from "vue2-timepicker";
import { UsuarioModel, UsuarioBuilder } from "../../models/UsuarioModel";
import { VueGoodTable } from "vue-good-table";
import TABLE_CONFIG from "../../helpers/DatatableConfig";
import Popup from "../../controller/Popup";
import Loader from "../../components_utils/Loader";
import { validarDatosUsuario } from "../../helpers/UsuarioValidacion";
import * as moment from "moment";
import CONSTANTES from "../../helpers/Constantes";

export default {
  name: "formulario-usuario",
  mixins: [operacionesApi],
  props: ["usuario"],
  components: {
    Datepicker,
    VueTimepicker,
    Popup,
    Loader
  },
  data() {
    return {
         
      operacion: "INSERT",
      es: es,
      registrarCorreo: false,
      loader: false,
      contador: 0,
      rangoHora: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    
    };
  },
  mounted() {
    console.log("iniciando el componente usuario ");
    this.usuarioSesion = getUsuarioSesion();    
  },
  methods: {
    
  }
};
</script>

<style scoped>
</style>
