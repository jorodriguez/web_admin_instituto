
import Vue from "vue";
import Datepicker from 'vuejs-datepicker';
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';
import { operacionesApi } from "../helpers/OperacionesApi";
import URL from "../helpers/Urls";
import {getUsuarioSesion} from '../helpers/Sesion';
import  PopupPagoPendiente  from "../components/PopupPagoPendiente";

export default {
  name: "gastos",
  mixins: [operacionesApi],  
  components: {
    Datepicker,
    VueGoodTable,
    PopupPagoPendiente
  },
  data() {
    return {      
      gasto: {
        cat_tipo_gasto: -1,
        co_forma_pago: -1,
        fecha:Date,
        gasto: 0,
        observaciones: ""
      },
      listaGastos: [],
      listaTiposGasto: [],
      listaFormasPago: [],
      listaGastosMensuales: [],
      mes_seleccionado: { mes_anio: '', anio_mes: '', suma: -1 },
      operacion: '',
      disabledDates: {
        from: new Date(Date.now() + 8640000)
      },
      usuarioSesion: {},                  
    };
  },
  mounted() {
    console.log("iniciando el componente de gastos");
    this.usuarioSesion = getUsuarioSesion();
    this.init();
  },
  methods: {
    async init(){
      this.listaFormasPago = [];
      this.listaFormasPago = await this.getAsync(URL.FORMAS_PAGO_BASE);      
      this.listaTiposGasto = await this.getAsync(`${URL.TIPOS_GASTO}/${this.usuarioSesion.id_empresa}`);                 
      this.loadFunctionGastosMensuales();
    },
    async loadFunctionGastosMensuales(){
      console.log("@loadFunctionGastosMensuales");
      this.listaGastosMensuales = await this.getAsync(`${URL.HISTORICO_GASTOS}/${this.usuarioSesion.co_sucursal}`);      
      if (this.listaGastosMensuales != null && this.listaGastosMensuales.length > 0) {
        this.mes_seleccionado = this.listaGastosMensuales[0];
        this.loadFunctionGastos(this.mes_seleccionado.anio_mes);
      }     
    },
    async loadFunctionGastos(anio_mes) {
      console.log("@loadFunctionGastos "+anio_mes);
      this.listaGastos = await this.getAsync(`${URL.GASTOS_BASE}/${this.usuarioSesion.co_sucursal}/${anio_mes}`);     
    },
    iniciarAgregarGasto() {
      console.log("iniciar agregar gasto");
      this.gasto = {
        cat_tipo_gasto: -1,
        co_forma_pago: -1,
        fecha: (new Date()),
        gasto: 0,
        observaciones: ""
      };      
      this.operacion = 'INSERT';
      $('#modal_gasto').modal('show');

    },
    async guardarGasto() {
      console.log("guardar gasto");
      if (this.gasto.cat_tipo_gasto == -1 ||
        this.gasto.co_forma_pago == -1 ||
        this.gasto.fecha == null || this.gasto.fecha == '' ||
        this.gasto.gasto == 0 || this.gasto.gasto == ''
      ) {       
        this.$notificacion.error('Datos requeridos', 'Escriba los datos requeridos.');
        return;
      }

      this.gasto.genero = this.usuarioSesion.id;
      this.gasto.co_sucursal = this.usuarioSesion.co_sucursal;
      let response = null;      
      if (this.operacion == 'INSERT') {
          response = await this.postAsync(URL.GASTOS_BASE,this.gasto);                                     
      } else {
        response = await this.putAsync(URL.GASTOS_BASE,this.gasto);                           
      }
      if (response != null) {
        this.$notificacion.info(
                      this.operacion == 'INSERT' ? 'Registro':'Modificacion',
                      this.operacion == 'INSERT' ? 'Se registró un nuevo gasto.':'Se modificó el registro.');
        $("#modal_gasto").modal("hide");
        await this.loadFunctionGastosMensuales();
      }
    },
    verDetalleMesSeleccionado() {
      console.log(" ver mes seleccionado ");
      if (this.mes_seleccionado.anio_mes != '') {
        this.loadFunctionGastos(this.mes_seleccionado.anio_mes);
      }
    },
    guardarTipoGasto() {
      console.log(" guardar tipo de gasto ");
    },
    seleccionarGasto(item, operacion) {
      console.log("seleccionar gasto " + item);
      this.operacion = operacion;
      this.gasto = item;
      if (this.operacion == 'DELETE') {
        $("#modal_eliminar").modal("show");
      } else {
        $("#modal_gasto").modal("show");
      }
    },
    async confirmarEliminar() {
      console.log("confirmar eliminar gasto");
      this.gasto.genero = this.usuarioSesion.id;
      this.gasto.co_sucursal = this.usuarioSesion.co_sucursal;

      const response = await this.removeAsync(`${URL.GASTOS_BASE}/${this.gasto.id}`,this.gasto);         
      if (response != null) {
            this.$notificacion.info('Eliminacion del gasto', 'Se eliminó el gasto.');
            $("#modal_eliminar").modal("hide");
            await this.loadFunctionGastosMensuales();
      }      
    }
  },
};