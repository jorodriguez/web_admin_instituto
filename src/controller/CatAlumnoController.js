import AlumnoModel from "../models/AlumnoModel";
import Datepicker from 'vuejs-datepicker';
import URL from "../helpers/Urls";
import { validacionDatosAlumno } from "../helpers/AlumnoValidacion";
import { operacionesApi } from "../helpers/OperacionesApi";
import { en, es } from 'vuejs-datepicker/dist/locale'
import { getUsuarioSesion } from '../helpers/Sesion';
import Loader from '../components_utils/Loader';
import moment from 'moment'


export default {
  name: "Alumno",
  components: {
    Datepicker,Loader
  },
  mixins: [operacionesApi],
  data() {
    return {
      input: AlumnoModel,
      generoAlumno: { id: -1, nombre: "", foto: "" },
      response: "",
      usuarioSesion: {},
      sesion: {},
      operacion: "INSERT",
      criterioNombre: "",
      lista: [],
      listaGeneroAlumno: [],
      listaRespaldo: [],     
      loadFunction: null,
      mensaje: "",
      es: es,     
      fechaBaja:new Date(),
      observacionesBaja:"",
      loader:false
    };
  },
  mounted() {
    console.log("##### iniciando catalogo alumno ####");

    this.usuarioSesion = getUsuarioSesion();

    console.log("Cargando lista alumno");
        
    this.cargarInscripciones();  
  },
  methods: {   
    async cargarInscripciones(){
      this.loader = true;
      this.lista = await this.getAsync(URL.INSCRIPCION_BASE + "/" + this.usuarioSesion.co_sucursal);
      this.listaRespaldo = Object.assign(this.lista,{});
      this.loader = false;
    },
    getFoto() {
      let elemento = this.listaGeneroAlumno.find(e => e.id == this.input.cat_genero);
      return elemento.foto;
    },
    select(rowSelect, operacion) {
      console.log("fila seleccionada " + rowSelect.adeuda);
      this.operacion = operacion;
      this.input = rowSelect;
      this.mensaje = "";
      if (operacion == 'DELETE' && this.input.adeuda) {
        //this.mensaje = "No se puede eliminar por que tiene deudas.";
        this.$notificacion.warn('Baja de alumno', 'No es posible dar de baja el alumno por motivos de deuda activa.');
        return;
      } else {
        $("#modal_eliminar_alumno").modal("show");

      }
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
    eliminar() {
      console.log("Modificar el id " + this.input.id);
      const params = {
        fechaBaja: this.fechaBaja,
        observaciones: this.observacionesBaja,
        genero: this.usuarioSesion.id
      };

      this.put(URL.ALUMNOS_BASE + "/baja/" + this.input.id, params, result => {
        console.log(" " + result.data);
        if (result.data != null) {       
          this.$notificacion.error(
            "Registro de Baja de alumno",
            "Se registro la baja del alumno " + this.input.nombre + "."
          );
          this.loadFunction();
        }
      });
    },
    cambiarSucursal(row) {
      this.$router.push({ name: "CambioSucursal", params: { id_alumno: row.id } });
    },
    subirFotoPerfil(id) {

      this.$router.push({ name: "SubirFotoAlumno", params: { id: id } });
    }
  }
};