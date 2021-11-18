
import Datepicker from 'vuejs-datepicker';
import { es } from 'vuejs-datepicker/dist/locale';
import CargosPagos from '../components/CargosPago.vue';
import EstadoCuenta from '../components/EstadoCuenta.vue';
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
        EstadoCuenta
    },
    data() {
        return {
            id: 0,
            alumno: AlumnoModel,
            familiar: {
                id: 0,
                id_relacion: -1,
                co_alumno: -1,
                co_parentesco: -1,
                parentesco: "",
                cat_genero: -1,                
                nombre: "",
                telefono: "",
                fecha_nacimiento: null,
                correo: "",
                id_empresa:-1,
                genero: 0
            },            
            listaFamiliares: [],
            metadatos: Utils,
            listaGrupos: [],
            listaGeneroAlumno:[],
            listaParentesco: [],
            listaServicios: [],
            listaValoresEsperados: [],
            listaPosiblesPadres: [],
            familiarRelacionado: null,
            mensaje_facturacion: "",
            display: true,
            co_parentesco_seleccionado: { id: -1, cat_genero: -1 },
            requiere_datos_facturacion: false,
            datos_facturacion: {
                rfc: "",
                razon_social: "",
                curp: "",
                calle: "",
                numero_exterior: "",
                colonia: "",
                ciudad: "",
                municipio: "",
                estado: "",
                codigo_postal: "",
                telefono_contacto: "",
                correo_contacto: ""
            },            
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
        this.id = to.params.id;
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

        this.id = this.$route.params.id;
       
        this.init();

        this.mensajeToast = mensaje => {
            $("#toast_msg").text(mensaje);
            $("#toast_id").toast("show");
        };
    },
    methods: {
        async init() {
            if (this.id == undefined) {
                this.display = false;
                console.log("No se recibe ningun id de alumno ");
            } else {
                //async version
                await this.cargarInformacionAlumno();
                await this.cargarInformacionFamiliares();
                await this.cargarCatalogos();
            }
        },
        async cargarInformacionAlumno(){
            console.log("cargar informacion alumno "+URL.ALUMNOS_BASE);
            this.alumno = await this.getAsync(URL.ALUMNOS_BASE+"/id/"+this.id);
            if ( this.alumno && this.alumno.formato_inscripcion == null)
            this.alumno.formato_inscripcion = {};

           if (this.alumno && this.alumno.co_datos_facturacion != null) {
            this.datos_facturacion = this.alumno.datos_facturacion;
           }
        },
        async cargarInformacionFamiliares(){            
            this.listaFamiliares = await this.getAsync(`${URL.FAMILIAR_BASE}/${this.id}`);          
        },
        async cargarCatalogos(){
            this.listaGrupos = await this.getAsync(`${URL.GRUPOS_BASE}/${this.usuarioSesion.id_empresa}`);
            this.listaGeneroAlumno = await this.getAsync(`${URL.GENERO_ALUMNO}`);           
        },
        async cargarCatalogoParentesco(){
            this.listaParentesco  = await this.getAsync(`${URL.PARENTESCO_BASE}/${this.id}`);
        },
        async cargarCatalogoServicios(){
            this.listaServicios = await this.getAsync(`${URL.SERVICIOS_BASE}/${this.usuarioSesion.id_empresa}`);
        },
        async cargarValoresEsperados(idFormato){
            this.listaValoresEsperados = await this.getAsync(`${URL.VALORES_ESPERADOS}/${idFormato}`);
        },
        async cargarPosiblesFamiliares(idParentesco, apellidosAlumno, idSucursal){
            this.listaPosiblesPadres = await this.getAsync(`${URL.FAMILIAR_BASE}/${idParentesco}/${apellidosAlumno}/${idSucursal}`);           
        },
        
        //FIXME : pasar al servicio
        modificar() {
            console.log("Modificar el id " + this.alumno.id);
           
            if (!validacionDatosAlumno(this.alumno)) {
                console.log("No paso la validacion ");
                return;
            }

            this.alumno.genero = this.usuarioSesion.id;            
            
            this.alumno.formato_inscripcion.valores_esperados = this.listaValoresEsperados;

            this.put(
                URL.ALUMNOS_BASE + "/" + this.alumno.id,
                this.alumno,

                (result) => {
                    this.response = result.data;

                    if (this.response != null) {
                        console.log("" + this.response);
                        //this.mensaje = "Se actualizaron los datos del alumno.";                        
                        this.$notificacion.info('Actualización de registro', 'Se actualizaron los datos del alumno.');
                    }
                }
            );
        },

        modificarFechaLimitePago() {
            //validacion anexa
            if (!validacionFechaLimitePagoAlumno(this.alumno)) {
                console.log("No paso la validacion de fecha limite de pago");
                return;
            }

            this.put(
                URL.ALUMNOS_BASE + "/fecha_limite_pago/" + this.alumno.id,
                this.alumno,

                (result) => {
                    this.response = result.data;

                    if (this.response != null) {
                        console.log("" + this.response);
                        //this.mensaje = "Se actualizaron los datos del alumno.";
                        $("#popup_captura_fecha_pago").modal("hide");
                        this.$notificacion.info('Actualización la fecha límite de pago', '');
                    }
                }
            );
        },

        iniciarAgregarFamiliar() {
            this.operacion = "INSERT";
            this.familiar = {
                id: 0,
                id_relacion: -1,
                co_alumno: -1,
                co_parentesco: -1,
                cat_genero: -1,
                parentesco: "",
                cat_genero: -1,
                nombre: "",
                telefono: "",
                fecha_nacimiento: null,
                correo: "",
                genero: 0
            };
            this.mensaje = '';
            this.familiarRelacionado = null;
            this.co_parentesco_seleccionado = { id: -1, cat_genero: -1 };
           
           this.cargarCatalogoParentesco();
        },
        seleccionarParentesco() {
            
            this.cargarPosiblesFamiliares(this.co_parentesco_seleccionado.id,
                this.alumno.apellidos,
                this.usuarioSesion.co_sucursal);

        },
        seleccionarFamiliarParaRelacion() {
            this.familiar.id = this.familiarRelacionado ? this.familiarRelacionado.id : -1;
            this.familiar.nombre = this.familiarRelacionado ? this.familiarRelacionado.nombre : '';
            this.familiar.telefono = this.familiarRelacionado ? this.familiarRelacionado.telefono : '';
            this.familiar.fecha_nacimiento = this.familiarRelacionado ? this.familiarRelacionado.fecha_nacimiento : null;
            this.familiar.correo = this.familiarRelacionado ? this.familiarRelacionado.correo : '';
        },
        async seleccionarFamiliar(item, operacion) {
            this.familiar = item;
            this.operacion = operacion;            
            this.cargarCatalogoParentesco();
           
        },
        seleccionarFamiliarResetClave(item) {
            this.familiar = item;
            $("#modal_confirmar_resetear_clave").modal("show");
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
        agregarFamiliar() {
            console.log("Agregar familiar ");
            console.log(" JONS " + JSON.stringify(this.co_parentesco_seleccionado));
            if (
                this.co_parentesco_seleccionado.id == -1 ||
                this.familiar.nombre == "" ||
                this.familiar.telefono == "" ||
                this.familiar.correo == ""
            ) {
                //this.mensaje = "Escribe los valores requeridos";
                //this.mensajeToast("Escribe los valores requeridos");
                this.$notificacion.error('Validación', 'Escribe los valores requeridos.');
                return;
            }

            if(!validacionCorreo(this.familiar.correo)){
                this.$notificacion.error('Formato de Correo', 'Escribe un correo válido');
                return;
            }


            this.familiar.genero = this.usuarioSesion.id;
            this.familiar.co_parentesco = this.co_parentesco_seleccionado.id;
            this.familiar.cat_genero = this.co_parentesco_seleccionado.cat_genero_default;
            this.familiar.id_sucursal = this.usuarioSesion.co_sucursal;
            this.familiar.id_empresa = this.usuarioSesion.id_empresa;

            console.log("== " + JSON.stringify(this.familiar));

            this.post(
                URL.FAMILIAR_BASE + "/" + this.alumno.id,
                this.familiar,

                (result) => {
                    let respuesta = result.data;
                    console.log(JSON.stringify(respuesta));

                    if (respuesta != null) {
                        this.mensaje = respuesta.mensaje;
                        if (respuesta.estatus) {
                            $("#modal_familiar").modal("hide");                           
                            this.cargarInformacionFamiliares();
                        }
                    }
                }
            );
        },
        modificarFamiliar() {
            console.log("modificar familiar");

            if (
                this.familiar.nombre == "" ||
                this.familiar.telefono == "" ||
                this.familiar.correo == ""
            ) {
                // this.mensajeToast("Escribe los valores requeridos");
                this.$notificacion.info('Validación', 'Escribe los valores requeridos.');

                return;
            }
            this.familiar.genero = this.usuarioSesion.id;
            this.familiar.id_empresa = this.usuarioSesion.id_empresa;

            if(!validacionCorreo(this.familiar.correo)){
                this.$notificacion.error('Formato de Correo', 'Escribe un correo válido');
                return;
            }

            this.put(
                URL.FAMILIAR_BASE + "/" + this.familiar.id,
                this.familiar,

                (result) => {
                    if (result.data != null) {
                        console.log("" + this.response);
                        if (result.data.estatus) {
                            //this.mensaje = this.response.mensaje;
                            this.$notificacion.info('Información', this.response.mensaje);
                            this.cargarInformacionFamiliares();
                            $("#modal_familiar").modal("hide");
                        }
                    }
                }
            );
        },
        eliminarFamiliar() {
            this.familiar.genero = this.usuarioSesion.id;

            console.log("Eliminar familiar " + JSON.stringify(this.familiar));

            this.put(
                URL.FAMILIAR_BASE + "/eliminar/" + this.familiar.id_relacion,
                this.familiar,

                (result) => {
                    this.response = result.data;

                    if (this.response != null) {
                        console.log("" + this.response);
                        if (this.response == 0 || this.response == null) {
                            this.mensaje = "Sucedió un error inesperado";
                        } else {
                            // this.mensaje = "Se actualizaron los datos de familiar.";
                            this.$notificacion.info('Modificación del registro', 'Se actualizaron los datos de familiar.');
                            this.cargarInformacionFamiliares();
                            $("#modal_eliminar_familiar").modal("hide");
                        }
                    }
                }
            );

        },
        guardarDatosFacturacion() {
            if (
                this.datos_facturacion.rfc == ""
                || this.datos_facturacion.razon_social == ""
                || this.datos_facturacion.curp == ""
                || this.datos_facturacion.calle == ""
                || this.datos_facturacion.numero_exterior == ""
                || this.datos_facturacion.colonia == ""
                || this.datos_facturacion.ciudad == ""
                || this.datos_facturacion.municipio == ""
                || this.datos_facturacion.estado == ""
                || this.datos_facturacion.codigo_postal == ""
                || this.datos_facturacion.telefono_contacto == ""
                || this.datos_facturacion.correo_contacto == ""
            ) {
                //this.mensaje = "Escribe los valores requeridos.";
                this.$notificacion.warn('Escribe los valores', 'Escribe los valores requeridos.');


                return;
            }

            this.datos_facturacion.factura = this.alumno.factura;
            this.datos_facturacion.genero = this.usuarioSesion.id;
            this.datos_facturacion.id_alumno = this.id;

            this.post(
                URL.DATOS_FACTURADOS,
                this.datos_facturacion,

                (result) => {
                    this.response = result.data;

                    if (this.response != null) {
                        console.log("" + this.response);
                        if (this.response == 0 || this.response == null) {
                            //this.mensaje = "Sucedió un error inesperado";
                            this.$notificacion.error('Error', 'Sucedió un error inesperado.');

                        } else {
                            // this.mensaje = "Se actualizaron los datos de facturación.";      
                            this.$notificacion.info('Actualización', 'Se actualizaron los datos de facturación');
                        }
                    }
                }
            );
        },
        iniciarHabilitarDesabilitarDatosFacturacion() {

            if (this.alumno.factura && this.alumno.co_datos_facturacion != null) {
                //lanzar confirmacion
                this.mensaje_facturacion = "Con esta acción se especifica que no se requiere expedir facturas para el alumno ";
                $("#modal_confirmar_facturacion").modal("show");
            }

            if (!this.alumno.factura && this.alumno.co_datos_facturacion != null) {
                this.mensaje_facturacion = "Con esta acción se especifica que se requiere expedir facturas para el alumno ";
                $("#modal_confirmar_facturacion").modal("show");
            }
        },
        cancelarHabilitarDesabilitarDatosFacturacion() {
            this.alumno.factura = !this.alumno.factura;

        },
        habilitarDesabilitarDatosFacturacion() {

            this.put(
                URL.DATOS_FACTURADOS,
                { id_alumno: this.id, factura: this.alumno.factura, genero: this.usuarioSesion.id },

                (result) => {
                    this.response = result.data;

                    if (this.response != null) {
                        console.log("" + this.response);
                        if (this.response == 0 || this.response == null) {
                            //this.mensaje = "Sucedió un error inesperado";
                            this.$notificacion.info('Error', 'Sucedió un error inesperado');
                        } else {
                            //this.mensaje = "Se actualizaron los datos de facturación.";     
                            this.$notificacion.info('Actualización', 'Se actualizaron los datos de facturación.');
                        }
                    }
                }
            );
        },
        cargarTabInscripcion() {
            console.log("Inscripcion Tab load");

            if (this.listaServicios.length == 0) {
                console.log("Carga de lista");              
                this.cargarCatalogoServicios();
            }
        },
        cargarTabInstitucion() {
            console.log("Institucion Tab load");
            if (this.listaValoresEsperados.length == 0) {

                console.log("Preparando alumno como insticucion " + JSON.stringify(this.alumno));

                // this.loadValoresEsperadosFunction(this.alumno.formato_inscripcion.id);
                this.cargarValoresEsperados(this.alumno.formato_inscripcion.id);

            }
        },
        cargarTabFamiliares() {
            console.log("Familiares Tab load");
            if (this.listaFamiliares.length == 0) {
                console.log("Carga de lista de familiares");
                this.cargarInformacionFamiliares();
            }
        },
        iniciarCapturaFechaPago() {
            this.fecha_memento = this.alumno.fecha_limite_pago_mensualidad;
            $("#popup_captura_fecha_pago").modal("show");
        },
        cancelarModificarFechaPago() {
            this.alumno.fecha_limite_pago_mensualidad = this.fecha_memento;
            $("#popup_captura_fecha_pago").modal("hide");
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