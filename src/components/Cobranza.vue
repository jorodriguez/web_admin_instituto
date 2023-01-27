<template>
  <div class="cat_alumno">
    <PopupPagoPendiente />
    <h1>Cobranza </h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>
    <br/>

    <div class="card">
      <ul class="nav nav-pills nav-justified" id="pills-tab" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="pills-home-tab" data-toggle="pill" href="#pills-home" role="tab"
            aria-controls="pills-home" aria-selected="true"><i class="fa fa-list"></i> Colegiaturas</a>
        </li>

        <li class="nav-item">
          <a class="nav-link" id="pills-inscripciones-tab" data-toggle="pill" href="#pills-inscripciones" role="tab"
            aria-controls="pills-inscripciones" aria-selected="false" @click="cargarAlumnosDeudores()"><i
              class="fa fa-graduation-cap"></i> Alumnos con Adeudo
          </a>
        </li>


      </ul>
      <div class="tab-content" id="pills-tabContent">
        <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
          <div class="card">
            <div class="card-body">
              <!--- LISTA DE COBRANZA DE COLEGIATURAS  -->
              <div v-if="loader" class="mx-auto">
                <Loader :loading="loader" :mini="true" />
              </div>
              <vue-good-table :columns="columnas" :rows="lista" :line-numbers="true" @on-row-click="onRowClick"
                @on-search="onSearch" :search-options="TABLE_CONFIG.SEARCH_OPTIONS"
                :pagination-options="TABLE_CONFIG.PAGINATION_OPTIONS" @on-selected-rows-change="selectionChanged"
                :selectOptions="TABLE_CONFIG.NO_SELECT_OPTIONS" @on-select-all="selectAll" class="table-striped"
                :groupOptions="{
                  enabled: false,
                }">
                <template slot="table-header-row" slot-scope="props">
                  <span class="font-weight-bold text-info h5">{{ props.row.label }}</span>
                </template>

                <template slot="table-row" slot-scope="props">
                  <span v-if="props.column.field == 'alumno'">
                    <div class="media">
                      <img @click="verPerfil(props.row)" :src="props.row.foto_alumno" alt
                        class="pointer mr-3 rounded-circle" width="50" height="50" />
                      <div @click="verPerfil(props.row)" class="pointer media-body">
                        <h4>{{ props.row.alumno }} {{ props.row.apellidos }}</h4>
                        <h5 class="font-weight-normal">{{ props.row.matricula }}</h5>
                      </div>
                    </div>
                  </span>
                  <span v-else-if="props.column.field == 'especialidad'">
                    <h4>Semana {{ props.row.numero_semana_curso }}</h4>
                    <h5 class="font-weight-normal">{{ props.row.especialidad }}</h5>
                  </span>
                  <span v-else-if="props.column.field == 'dia'">
                    <h4>{{ props.row.dia }}</h4>
                    <h5 class="font-weight-normal">{{ props.row.fecha_clase }}</h5>

                  </span>
                  <span v-else-if="props.column.field == 'cargo'">
                    <h4 class="">${{ formatPrice(props.row.cargo) }}</h4>
                  </span>

                  <span v-else-if="props.column.field == 'acciones'">
                    <button type="button" @click="verPerfil(props.row)" class="btn btn-outline-primary">Cobrar</button>
                  </span>
                  <span v-else>{{ props.formattedRow[props.column.field] }}</span>
                </template>
              </vue-good-table>
              <!-- FIN LISTA DE COBRANZA DE COLEGIATURAS -->

            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="pills-inscripciones" role="tabpanel" aria-labelledby="pills-inscripciones-tab">
          <div class="card">
            <div class="card-body">
              <div class="row pr-3 t d-flex justify-content-end">
                  {{ listaCobranza.length }} Alumnos
              </div>
              <!-- lista de alumnos deudores-->
              <div v-if="loaderDeudores" class="mx-auto">
                <Loader :loading="loaderDeudores" :mini="true" />
              </div>
              <vue-good-table :columns="columnasCobranza" :rows="listaCobranza" :line-numbers="true"
                @on-row-click="onRowClick" @on-search="onSearch" :search-options="TABLE_CONFIG.SEARCH_OPTIONS"
                :pagination-options="TABLE_CONFIG.PAGINATION_OPTIONS" @on-selected-rows-change="selectionChanged"
                :selectOptions="TABLE_CONFIG.NO_SELECT_OPTIONS" @on-select-all="selectAll" class="table-striped"
                :groupOptions="{
                  enabled: false,
                }">
                <template slot="table-header-row" slot-scope="props">
                  <span class="font-weight-bold text-info h5">{{ props.row.label }}</span>
                </template>

                <template slot="table-row" slot-scope="props">
                  <span v-if="props.column.field == 'alumno'">
                    <div class="media">
                      <img @click="verPerfilCobranza(props.row)" :src="props.row.foto_alumno" alt
                        class="pointer mr-3 rounded-circle" width="50" height="50" />
                      <div @click="verPerfilCobranza(props.row)" class="pointer media-body">
                        <h4>{{ props.row.alumno }} {{ props.row.apellidos }}</h4>
                        <h5 class="font-weight-normal">{{ props.row.especialidad }}</h5>
                      </div>
                    </div>
                  </span>

                  <span v-else-if="props.column.field == 'telefono'">
                    <h4> <i class="fa fa-phone text-info"></i> {{ props.row.telefono }} </h4>
                  </span>

                  <span v-else-if="props.column.field == 'total_adeudo'">
                    <h3 :class="`${props.row.total_adeudo > 0 ? 'text-danger' : ''}`">
                      ${{ formatPrice(props.row.total_adeudo) }}</h3>
                    <small> Último pago {{ formatMoment(props.row.ultimo_pago) }} </small>
                  </span>

                  <span v-else-if="props.column.field == 'acciones'">
                    <button type="button" @click="cargarCargosAlumno(props.row)"
                      class="btn btn-sm btn-outline-secondary">Edo.
                      Cuenta</button>
                    <!--<estado-cuenta :idAlumno="props.row.id_alumno" />-->
                  </span>

                  <span v-else>{{ props.formattedRow[props.column.field] }}</span>
                </template>
              </vue-good-table>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- popup estado cuenta -->
    <Popup id="popup_cargos" size="lg" :show_button_close="true">
      <div slot="header">Cobranza de {{ alumnoSeleccionado.alumno }}</div>
      <div slot="content">
        <div v-if="loaderCargos" class="mx-auto">
                <Loader :loading="loaderCargos" :mini="true" />
              </div>
        <div class="text-right">
          <a v-print="'print-pagos'" class="btn btn-outline-primary btn-sm text-primary">
            <i class="fa fa-print"></i> Imprimir 
          </a>
        </div>
        <span id="print-pagos">
          <div class="row">
            <div class="col-sm-12 col-md-6 col-lg-6">
              <table class="table table-sm text-left h4">
                <tr>
                  <td><strong>Alumno</strong></td>
                  <td>{{ alumnoSeleccionado.alumno }}</td>
                </tr>
                <tr>
                  <td><strong>Tel.:</strong></td>
                  <td> <i class="fa fa-phone text-gray"></i> {{ alumnoSeleccionado.telefono }}</td>
                </tr>
              </table>
            </div>
            <div class="col-sm-12 col-md-6 col-lg-6 text-right">
              <h1 class="text-danger"><span class="text-gray">Adeudo </span>${{
                formatPrice(alumnoSeleccionado.total_adeudo)
              }}</h1>
            </div>
          </div>

          <table id="cargos" class="table table-striped table-sm table-hover">
            <thead>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Abonado</th>
              <th>Adeudo</th>
              <th></th>
            </thead>
            <tbody>
              <tr v-for="row in listaCargosAlumnos" :key="row.id">
                <td class="text-left">
                  <span v-if="!row.pagado" class="font-weight-bold">{{ row.cantidad > 1 ? row.cantidad : "" }}
                    {{ row.nombre_cargo }}{{ row.cantidad > 1 ? "s" : "" }}
                    <span v-if="row.cat_esquema_pago == 1">
                      {{ row.numero_semana_curso != null ? `Semana ${row.numero_semana_curso}` : "" }}
                    </span>
                    <!--<span v-if="row.cat_esquema_pago == 2">
                    {{ row.texto_ayuda != null ? row.texto_ayuda : "" }}                  
                  </span> -->

                  </span>

                  <span v-else-if="row.pagado" class="font-weight-bold tachado">{{
                    row.cantidad > 1 ? row.cantidad : ""
                  }}
                    {{ row.nombre_cargo }}
                    <span v-if="row.cat_esquema_pago == 1">
                      {{`${row.numero_semana_curso ? 'Semana ' + row.numero_semana_curso : ''}`}}
                    </span>
                    <!--<span v-if="row.cat_esquema_pago == 2">
                    {{ row.texto_ayuda != null ? row.texto_ayuda : "" }}                  
                  </span>-->
                  </span>

                  <span class="small ">
                    <div class="text-wrap">
                      {{ row.especialidad != null ? row.especialidad : "" }}
                    </div>
                  </span>
                  <!--<span class="small text-muted">
                  <div class="text-wrap" style="width: 10rem;">
                    {{ row.nota }}
                  </div>
                </span>-->

                </td>
                <td>
                  <strong>
                    <span :class="`font-weight-normal ${row.pagado ? 'text-gray' : ''}`">${{ row.cargo }}</span>
                  </strong>
                </td>
                <td>
                  <strong>
                    <span :class="`font-weight-normal ${row.pagado ? 'text-gray' : ''} `">${{ row.total_pagado }}</span>
                  </strong>
                </td>
                <td>
                  <i v-if="row.pagado" class="fa fa-check text-green"></i>
                  <strong v-else>
                    <span class="font-weight-bold text-danger">${{ row.total }}</span>
                  </strong>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </span>

      </div>
      <div slot="footer">
        <div class="text-right">
          <a v-print="'print-pagos'" class="btn btn-primary text-white">
            <i class="fa fa-print"></i> Imprimir 
          </a>
        </div>
      </div>
    </Popup>

  </div>
</template>

<script>

import Datepicker from 'vuejs-datepicker';
import URL from "../helpers/Urls";
import { operacionesApi } from "../helpers/OperacionesApi";
import { en, es } from 'vuejs-datepicker/dist/locale'
import { getUsuarioSesion } from '../helpers/Sesion';
import Loader from '../components_utils/Loader';
import Popup from '../controller/Popup';
import moment from 'moment';
import { formatPrice } from '../helpers/Utils';
import TABLE_CONFIG from "../helpers/DatatableConfig";
import { VueGoodTable } from 'vue-good-table';
import PopupPagoPendiente from "./PopupPagoPendiente.vue";
import EstadoCuenta from '../components/EstadoCuenta.vue';
import EstadoCuentaDetalladoAlumno from '../components/EstadoCuentaDetalladoAlumno.vue';

moment.locale('es');

export default {
  name: "Cobranza",
  components: {
    Datepicker, Loader, VueGoodTable, PopupPagoPendiente, EstadoCuenta, EstadoCuentaDetalladoAlumno, Popup
  },
  mixins: [operacionesApi],
  data() {
    return {
      response: "",
      usuarioSesion: {},
      sesion: {},
      criterioNombre: "",
      lista: [],
      listaCobranza: [],
      listaRespaldo: [],
      listaCargosAlumnos: [],
      mensaje: "",
      es: es,
      alumnoSeleccionado: {},
      observacionesBaja: "",
      loader: false,
      loaderDeudores:false,
      TABLE_CONFIG: TABLE_CONFIG,
      loaderCargos: false,
      formatPrice,
      columnas: [
        {
          label: 'Id',
          field: 'id',
          hidden: true
        },
        {
          label: 'Fecha Cargo',
          field: 'fecha_cargo',
          filterable: false,
          thClass: 'text-center',
          tdClass: 'text-center',
          hidden: true
        },
        {
          label: 'Cargo',
          field: 'Cargo',
          filterable: true,
          thClass: 'text-center',
          tdClass: 'text-left',
          hidden: true

        },
        {
          label: 'uid_alumno',
          field: 'uid_alumno',
          filterable: true,
          thClass: 'text-center',
          tdClass: 'text-left',
          hidden: true
        },
        {
          label: 'foto_alumno',
          field: 'uid_alumno',
          filterable: true,
          thClass: 'text-center',
          tdClass: 'text-left',
          hidden: true
        },
        {
          label: 'Alumno',
          field: 'alumno',
          filterable: true,
          thClass: 'text-center',
          tdClass: 'text-left',
          hidden: false
        },

        {
          label: 'Especialidad',
          field: 'especialidad',
          filterable: true,
          thClass: 'text-center',
          tdClass: 'text-left',
          hidden: false
        },
        {
          label: 'Clase',
          field: 'dia',
          filterable: true,
          thClass: 'text-center',
          tdClass: 'text-left',
          hidden: false
        },
        {
          label: 'Cargo',
          field: 'cargo',
          filterable: true,
          thClass: 'text-center',
          tdClass: 'text-center',
          hidden: false
        },

        {
          label: '',
          field: 'acciones',
          filterable: true,
          thClass: 'text-center',
          tdClass: 'text-left',
          hidden: false
        },
      ],
      columnasCobranza: [
        {
          label: 'Id',
          field: 'id',
          hidden: true
        },
        {
          label: 'uid_alumno',
          field: 'uid_alumno',
          filterable: false,
          thClass: 'text-center',
          tdClass: 'text-left',
          hidden: true
        },
        {
          label: 'foto_alumno',
          field: 'uid_alumno',
          filterable: true,
          thClass: 'text-center',
          tdClass: 'text-left',
          hidden: true
        },
        {
          label: 'Alumno',
          field: 'alumno',
          filterable: true,
          thClass: 'text-center',
          tdClass: 'text-left',
          hidden: false
        },

        {
          label: 'Teléfono',
          field: 'telefono',
          filterable: true,
          thClass: 'text-center',
          tdClass: 'text-left',
          hidden: false
        },
        {
          label: 'Adeudo total',
          field: 'total_adeudo',
          filterable: true,
          thClass: 'text-center',
          tdClass: 'text-center',
          hidden: false
        },

        {
          label: '',
          field: 'acciones',
          filterable: true,
          thClass: 'text-center',
          tdClass: 'text-center',
          hidden: false
        },

      ],
    };
  },
  mounted() {
    console.log("##### iniciando lista de cobranza ####");

    this.usuarioSesion = getUsuarioSesion();

    this.TABLE_CONFIG.PAGINATION_OPTIONS.perPage = 50;
    this.listaCobranza = [];
    this.cargarListaCobranza();
  },
  methods: {
    async cargarListaCobranza() {
      this.loader = true;
      this.lista = await this.getAsync(URL.COBRANZA + "/colegiaturas/" + this.usuarioSesion.co_sucursal);
      this.listaRespaldo = Object.assign(this.lista, {});
      this.loader = false;
    },
    async cargarCargosAlumno(rowSelect) {
      console.log("uiid " + rowSelect.uid);
      $("#popup_cargos").modal("show");
      this.alumnoSeleccionado = rowSelect;

      this.loaderCargos = true;
      //this.listaCargosAlumnos = await this.getAsync(`${URL.CARGOS_BASE}/alumno/${rowSelect.uid}`);
      this.listaCargosAlumnos = await this.getAsync(`${URL.CARGOS_BASE}/alumno/${rowSelect.uid}/ALL`);
      this.loaderCargos = false;     


    },
    async cargarAlumnosDeudores() {
      console.log("cargarAlumnosDeudores");
      // if(this.listaCobranza == []){                
      await this.cargarListaAlumnosDeudores();
      //}
    },
    async cargarListaAlumnosDeudores() {
      console.log("cargarListaAlumnosDeudores");
      this.loaderDeudores = true;
      this.listaCobranza = await this.getAsync(URL.REPORTES_BASE + "/cobranza/alumnos/" + this.usuarioSesion.co_sucursal);
      this.loaderDeudores = false;
    },
    select(rowSelect, operacion) {
      console.log("fila seleccionada " + rowSelect.adeuda);
      this.operacion = operacion;
      this.input = rowSelect;
      this.mensaje = "";
    },
    verPerfil(rowSelect) {
      this.$router.push({ name: "PerfilAlumno", params: { uid: rowSelect.uid_alumno } });
    },
    verPerfilCobranza(rowSelect) {
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
    cambiarSucursal(row) {
      this.$router.push({ name: "CambioSucursal", params: { id_alumno: row.id } });
    },
    subirFotoPerfil(id) {

      this.$router.push({ name: "SubirFotoAlumno", params: { id: id } });
    },
    formatMoment(fecha) {
      if (fecha != null) {
        return moment(new Date(fecha), "YYYYMMDD").fromNow();
      } else {
        "No hay registro"
      }
    },

  }
};
</script>

<style scoped>

</style>
