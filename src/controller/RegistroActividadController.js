
import SesionHelper from "../helpers/SesionHelper";
import ActividadModel from "../models/ActividadModel";
import URL from "../helpers/Urls";
import { operacionesApi } from "../helpers/OperacionesApi";
import {getUsuarioSesion} from '../helpers/Sesion';

export default {
  name: "Actividad",
  mixins:[operacionesApi],
  data() {
    return {
      usuarioSesion: {},
      //sesion: {},
      response: "",
      actividad: ActividadModel,
      actividadSelecionada: {},
      listaActividades: [],
      listaTipoActividad: [],
      listaAlumnos: [],
      listaGrupos:[],
      loadFunction: null,
      loadFunctionAlumnos: null,
      
      uriTemp: URL.CATALOGO_ACTIVIDAD, // "http://localhost:5000/actividad/catalogo_actividad",      
      uriTempAlumnos: URL.ALUMNOS_BASE, //"http://localhost:5000/alumnos",      
      uriTempAsistencia: URL.ASISTENCIA_BASE, // "http://localhost:5000/asistencia",
       
    };
  },
  //FIXME: SESION
  mounted() {
    console.log("iniciando el componente ");

    this.usuarioSesion = getUsuarioSesion();
    
    this.loadFunction = function() {

      this.get(
        this.uriTemp,
        
        (result) => {
          this.response = result.data;
          console.log("Consulta de actividades" + this.response);
          if (this.response != null) {
            if (this.response.length > 0) {
              this.listaActividades = this.response[0].catalogo_actividades;
              console.log("  ===  " + JSON.stringify(this.listaActividades));                
            }
          }
        }
      );
    };
  
    this.loadFunction();
       
  },
  methods: {
    continuar() {
      console.log("continuar ");
      
    }
  }
};