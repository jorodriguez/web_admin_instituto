
import Datepicker from 'vuejs-datepicker';
import { es } from 'vuejs-datepicker/dist/locale';
import CargosPagos from '../components/CargosPago.vue';
import EstadoCuenta from '../components/EstadoCuenta.vue';
import DatosAlumno from '../components/DatosAlumno';
import CursosAlumno from '../components/CursosAlumno';
import { validacionDatosAlumno, validacionFechaLimitePagoAlumno } from "../helpers/AlumnoValidacion";
import { operacionesApi } from "../helpers/OperacionesApi";
import { getUsuarioSesion } from '../helpers/Sesion';
import URL from "../helpers/Urls";
import Emit from "../helpers/Emit";
import { validacionCorreo } from "../helpers/ValidacionUtils";
import AlumnoModel from "../models/AlumnoModel";
import Utils from "../models/FormatoUtils";
//import BalanceAlumno from './BalanceAlumnoController';
import Popup from './Popup';


export default {
    name: "perfil-alumno",
    mixins: [operacionesApi],
    components: {
        Datepicker,
        CargosPagos,        
        Popup,
        EstadoCuenta,
        DatosAlumno,
        CursosAlumno
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
            listaInscripciones:[],
            es: es,
            usuarioSesion: {},
            alumnoCargado:false,
            mostrarCobranza:false
        };
    },
    beforeRouteUpdate(to) {
        console.log("id = " + this.uid);
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
        
        this.uid = `${this.$route.params.uid}`;
               
        this.init();

        this.$root.$on(Emit.ACTUALIZAR_ALUMNO, async text => {
            console.log("Actualizar perfil de alumno " + text);            
            //setTimeout(async()=>{
              await this.cargarInformacionAlumno();
            //},600);
            
        });

        //---mostrar tab cobranza debe tener el rol COBRANZA
        const ROL_COBRANZA = 2;
        const roles = this.usuarioSesion.roles;
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].id == ROL_COBRANZA) {
            this.mostrarCobranza = true;
          }
        }

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
                if(!this.alumnoCargado){
                    await this.cargarInformacionAlumno();                             
                }
            }
        },
        async cargarInformacionAlumno(){
            console.log("cargar informacion alumno "+this.uid);            
            this.alumno = await this.getAsync(`${URL.ALUMNOS_BASE}/id/${this.uid}`);                      
            //this.alumno.fecha_limite_pago = this.alumno.fecha_limite_pago_mensualidad;
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

        async cargarCursos(){
            console.log("@cargarCursos");
            if(this.listaInscripciones.length == 0){
             this.listaInscripciones = await this.getAsync(
                `${URL.INSCRIPCION_BASE}/alumno/${this.uid}`
              );            
            }
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