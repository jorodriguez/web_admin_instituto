
import Datepicker from 'vuejs-datepicker';
import { es } from 'vuejs-datepicker/dist/locale';
import CargosPagos from '../components/CargosPago.vue';
import EstadoCuenta from '../components/EstadoCuenta.vue';
import InscripcionAlumno from '../components/InscripcionAlumno';
import { validacionDatosAlumno, validacionFechaLimitePagoAlumno } from "../helpers/AlumnoValidacion";
import { operacionesApi } from "../helpers/OperacionesApi";
import { getUsuarioSesion } from '../helpers/Sesion';
import URL from "../helpers/Urls";
import { validacionCorreo } from "../helpers/ValidacionUtils";
import AlumnoModel from "../models/AlumnoModel";
import Utils from "../models/FormatoUtils";
import BalanceAlumno from './BalanceAlumnoController';
import Popup from './Popup';


export default {
    name: "perfil-alumno",
    mixins: [operacionesApi],
    components: {
        Datepicker,
        CargosPagos,
        BalanceAlumno,
        Popup,
        EstadoCuenta,
        InscripcionAlumno
    },
    data() {
        return {
            uid: "",
            alumno: AlumnoModel,                        
            metadatos: Utils,
            listaGrupos: [],
            listaGeneroAlumno:[],
            display: true,          
            response: "",
            mensaje: "",                                   
            mensajeToast: null,
            initFamiliar: null,
            operacion: "",
            disableDaysFechaLimitePago: { days: [6, 0], to: new Date() },
            fecha_memento: null,
            es: es,
            usuarioSesion: {}
        };
    },
    beforeRouteUpdate(to) {
        console.log("id = " + this.id);
        console.log(" " + to);
        this.uid = to.params.uid;
        this.init();
        // this.loadFamiliaresFuncion();
        //this.loadValoresEsperadosFunction();        
    },
    /*watch: {
        id: function (newId, oldId) {
            console.log("Observer para id ");

            this.loadAlumnoFuncion();
        }
    },*/
    mounted() {
        console.log("iniciando el componente Perfil alumno");

        this.usuarioSesion = getUsuarioSesion();

        this.uid = this.$route.params.uid;
       
        this.init();

        this.mensajeToast = mensaje => {
            $("#toast_msg").text(mensaje);
            $("#toast_id").toast("show");
        };
    },
    methods: {
        async init() {
            if (this.uid == undefined) {
                this.display = false;
                console.log("No se recibe ningun id de alumno ");
            } else {
                //async version
                await this.cargarInformacionAlumno();                
                await this.cargarCatalogos();
            }
        },
        async cargarInformacionAlumno(){
            console.log("cargar informacion alumno "+URL.INSCRIPCION_BASE);
            aqui voy traer al alumno
            this.alumno = await this.getAsync(URL.INSCRIPCION_BASE+"/id/"+this.uid);                      
            //this.alumno.fecha_limite_pago = this.alumno.fecha_limite_pago_mensualidad;
        },        
        async cargarCatalogos(){
            this.listaGrupos = await this.getAsync(`${URL.GRUPOS_BASE}/${this.usuarioSesion.id_empresa}`);
            this.listaGeneroAlumno = await this.getAsync(`${URL.GENERO_ALUMNO}`);           
        },                
        //FIXME : pasar al servicio
        modificar() {
            console.log("Modificar el id " + this.alumno.id);
           
            if (!validacionDatosAlumno(this.alumno)) {
                console.log("No paso la validacion ");
                return;
            }

            this.alumno.genero = this.usuarioSesion.id;                                   

            this.put(
                URL.ALUMNOS_BASE + "/" + this.alumno.id,
                this.alumno,
                (result) => {
                    this.response = result.data;

                    if (this.response != null) {
                        console.log("" + this.response);                  
                        this.$notificacion.info('Actualización de registro', 'Se actualizaron los datos del alumno.');
                    }
                }
            );
        },

                
        confirmarResetClave() {
            this.get(
                URL.RESET_PASSWORD + "/" + this.familiar.id,
                result => {
                    this.response = result.data;
                    if (this.response != null) {
                        console.log("" + this.response);                        
                        this.$notificacion.info('Envio de notificación', 'Se envio una notificación con la nueva contraseña al usuario.');
                        $("#modal_confirmar_resetear_clave").modal("hide");
                    }
                }
            );
        },
       

        getFoto(){        
            let elemento = this.listaGeneroAlumno.find(e=>e.id == this.alumno.cat_genero);
            return elemento.foto;    
        },
        subirFotoPerfil(id){

            this.$router.push({ name: "SubirFotoAlumno", params: { id: id } });
        }
    }
};  