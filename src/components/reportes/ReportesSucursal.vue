<template>
  <span>
    <PopupPagoPendiente />
    <h1>Reporteo</h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>

    <div class="card">
      <div class="card-body">
        <div v-if="mensaje" class="alert alert-warning">{{ mensaje }}</div>
        <div v-if="loading" class="h4">
          <div class="spinner-border" style="width: 3rem; height: 3rem" role="status">
            <span class="sr-only">Cargando...</span>
          </div>
        </div>

        <div class="form-inline">
          <div class="form-group ml-2 mb-2">
            <label for="reporte-id" class="sr-only">Reporte</label>
            <select
              v-model="reporteSeleccionado"
              @change="onChangeReporte()"
              class="form-control"
              placeholder="Reporte"
              required
            >
              <option
                v-for="(reporte, index) in listaReportes"
                v-bind:value="reporte"
                :key="index"
              >
                {{ reporte.nombre }}
              </option>
            </select>
          </div>
          <div class="form-group ml-2 mb-2" v-if="reporteSeleccionado.rango_fecha">
            <label for="f-inicio" class="sr-only">Fecha inicio</label>
            <datepicker
              name="fecha"
              v-model="fechaInicio"
              input-class="form-control"
              :bootstrap-styling="true"
              :language="es"
              @selected="cambiarFecha"
              format="yyyy-MM-dd"
            ></datepicker>
          </div>
          <div class="form-group ml-2 mb-2" v-if="reporteSeleccionado.rango_fecha">
            <label for="f-fin" class="sr-only">Fecha fin</label>
            <datepicker
              name="fecha"
              v-model="fechaFin"
              input-class="form-control"
              :bootstrap-styling="true"
              :language="es"
              @selected="cambiarFecha"
              format="yyyy-MM-dd"
            ></datepicker>
          </div>
          <button
            :disabled="loading"
            @click="ejecutarReporte()"
            class="btn btn-outline-primary ml-2 mb-2"
          >
            <i class="fas fa-print"></i> Cargar
          </button>
        </div>
        
        <vue-good-table
          :columns="columnas"
          :rows="lista"
          :line-numbers="true"
          @on-row-click="onRowClick"
          @on-search="onSearch"
          :search-options="TABLE_CONFIG.SEARCH_OPTIONS"          
          :selectOptions="TABLE_CONFIG.NO_SELECT_OPTIONS"
          @on-select-all="selectAll"
          class="table-striped"
          :groupOptions="{
  	          enabled: false,               
          }"
        >
          <template slot="table-header-row" slot-scope="props">
            <span class="font-weight-bold text-info h5">{{ props.row.label }}</span>
          </template>

          <template slot="table-row" slot-scope="props">                                  
            <span >{{props.formattedRow[props.column.field]}}</span>
          </template>
        </vue-good-table>   
        
      </div>
    </div>
  </span>
</template>

<script>
import Vue from "vue";
import { operacionesApi } from "../../helpers/OperacionesApi";
import URL from "../../helpers/Urls";
import { VueGoodTable } from "vue-good-table";
import Datepicker from "vuejs-datepicker";
import { en, es } from "vuejs-datepicker/dist/locale";
import TABLE_CONFIG from "../../helpers/DatatableConfig";
import { getUsuarioSesion } from "../../helpers/Sesion";
import { formatPrice } from "../../helpers/Utils";
import moment from "moment";
import PopupPagoPendiente from "../PopupPagoPendiente.vue";

export default {
  name: "reportes-sucursal",
  components: {
    Datepicker,
    VueGoodTable,
    PopupPagoPendiente,
  },
  mixins: [operacionesApi],
  data() {
    return {
      usuarioSesion: {},
      // sesion: {},
      fechaInicio: Date,
      fechaFin: Date,
      lista: [],
      listaReportes: [],
      idReporte: -1,
      listaGastos: [],
      corte: undefined,
      corteGasto: undefined,
      reporteSeleccionado: { id:-1,nombre:"",columnas:[] },
      columnas: [],
      TABLE_CONFIG: TABLE_CONFIG,
      es: es,
      mensaje: "",
      formatPrice: formatPrice,
      loading: Boolean,
      nombre_reporte: "corte.xls",
      nombre_libro: "libro1",
      columnasFiltradas: {},
      columnsExport: {
        folio: "folio",
        alumno: "alumno",
        apellidos: "apellidos",
        numero_semana_curso: "sem",
        horario: "horario",
        fecha: "fecha",
        nombre_cargo: "concepto",
        pago: "pago",
        total_adeuda: "total_adeuda",
      },
    };
  },
  mounted() {
    console.log("====iniciando el componente reporte de corte diario ===");

    this.usuarioSesion = getUsuarioSesion();
    this.fechaInicio = new Date();
    this.fechaFin = new Date();
    //this.TABLE_CONFIG.PAGINATION_OPTIONS.perPage = 50;
    this.columnasFiltradas = this.columnsExport;
    this.init();
  },
  methods: {
    init() {
      this.nombre_reporte = `Corte del día ${this.fecha}`;
      this.nombre_libro = `Corte `;
      this.loadFunction();
    },
    async loadFunction() {
      this.loading = true;
      this.listaReportes = await this.getAsync(URL.REPORTES_BASE + "/lista-reportes");
      this.loading = false;
    },
    async ejecutarReporte() {
      this.loading = true;
      this.lista = await this.putAsync(URL.REPORTES_BASE + "/ejecucion-reporte",{
        id_reporte:this.reporteSeleccionado.id,
        fecha_inicio:this.fechaInicio,
        fecha_fin:this.fechaFin,
        id_sucursal:this.usuarioSesion.co_sucursal
      });
      this.loading = false;
    },
    async imprimir() {
      const html = await this.putAsync(
        URL.REPORTES_BASE +
          "/corte/dia/sucursal/imprimir/" +
          this.usuarioSesion.co_sucursal,
        {
          fechaInicio: this.fechaInicio,
          fechaFin: this.fechaFin,
          id_usuario: this.usuarioSesion.id,
        }
      );

      const WinPrint = window.open("", "", "width=800,height=900");

      WinPrint.document.write(`
             <center>
              ${html}
              </center>
          `);

      WinPrint.document.close();
      WinPrint.focus();
      WinPrint.print();
      WinPrint.close();
    },
    cambiarFecha() {
      this.$nextTick(() => {
        console.log(this.fechaInicio);
        this.loadFunction();
      });
    },
    customFormatter(date) {
      return moment(date).format("yyyy-MM-dd");
    },
    onRowClick(params) {
      console.log(JSON.stringify(params));
    },
    onSearch(params) {
      console.log(JSON.stringify(params));
    },
    selectAll(selected, selectedRows) {},
    selectionChanged(params) {
      this.rowSelection = params.selectedRows;
      console.log("Seleccion");
    },
    async onChangeReporte(event) {
      console.log("@onChangeReporte " +event);
      this.columnas = JSON.parse(this.reporteSeleccionado.columnas);
    },
  },
};
</script>
