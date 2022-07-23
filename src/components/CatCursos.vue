<template>
  <div class="cat_curso">
    <PopupPagoPendiente />
    <h1>Talleres ({{ lista ? lista.length : 0 }})</h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>
    <div class="row">
      <div class="col-auto mr-auto">
        <router-link to="/principal" class="btn btn-secondary btn-lg">
          <i class="fas fa-arrow-circle-left text-gray"></i>
        </router-link>
        <button type="button" class="btn btn-primary btn-lg" v-on:click="nuevo()">
         <i class="fa fa-plus"></i> Nuevo Taller
        </button>
      </div>
    </div>

    <br />

    <Popup id="popup_curso" size="lg" :show_button_close="true">
      <div slot="header">
        {{ `${operacion == "INSERT" ? "Registrar" : "Modificar"}` }} Taller en
        <strong> {{ usuarioSesion.nombre_sucursal }}</strong>
      </div>
      <div slot="content" class="row text-left ">
        <div class="col-7 col-sm-7 col-md-7 col-lg-7 col-xl-7">
          <div class="form-group">
            <label>
              Especialidad
              <span class="text-danger">*</span>
            </label>
            <select v-if="operacion == 'INSERT'" v-model="input.cat_especialidad" class="form-control"
              placeholder="Especialidad" @change="setNumeroSemanasEspecialidad()" required>
              <option v-for="grupo in listaEspecialidades" v-bind:value="grupo" v-bind:key="grupo.id">
                {{ grupo.nombre }}
              </option>
            </select>
            <input v-else disabled type="text" v-model="input.especialidad" class="form-control" required />
          </div>

          <div class="form-row pb-3">
           <div class="custom-control custom-radio mx-auto">
                  <input class="custom-control-input" type="radio" name="exampleRadios" id="exampleRadios1"
                    :value="esquemas.SEMANAL.id" @change="onChangeEsquemaPago()" v-model="seleccion_esquema"
                    :disabled="loaderListaPagos" checked>
                  <label class="custom-control-label h4" for="exampleRadios1">
                    <!--({{ contadorSemanasPago }})--> Semanal
                  </label>
              </div>
               <div class="custom-control custom-radio mx-auto">
                  <input class="custom-control-input" type="radio" @change="onChangeEsquemaPago()"
                    v-model="seleccion_esquema" name="exampleRadios" id="exampleRadios2" :value="esquemas.MENSUAL.id"
                    :disabled="loaderListaPagos">
                  <label class="custom-control-label h4" for="exampleRadios2">
                    <!--({{ contadorMesesPago }})--> Mensual
                  </label>
                </div>
          </div>
          
          <div class="form-row">
            <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <label>
                  Fecha Inicio
                  <span class="text-danger">*</span>                  
                </label>                
                <datepicker name="fecha_inicio_previsto" v-model="input.fecha_inicio_previsto"
                  input-class="form-control bg-white" :format="'yyyy-MM-dd'" :bootstrap-styling="true" :language="es"
                  @selected="cambiarFecha" required></datepicker>                                  
                  <small class="text-gray">{{ getNombreDia() }} </small>
            </div>            
            <!--<div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6 ">
                <small class="text-gray">{{ getNombreDia() }} </small>
            </div>-->
             <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <label>
                Número de <strong class="text-blue">{{ seleccion_esquema == esquemas.SEMANAL.id ? 'Semanas':'' }}
                          {{ seleccion_esquema == esquemas.MENSUAL.id ? 'Meses':'' }}</strong>
                <span class="text-danger">*</span>
              </label>              
              <input :disabled="operacion == 'UPDATE'" type="number" v-model="input.numero_semanas" class="form-control"
                @change="cargarPreviewEsquemaPagos()" v-on:keyup.enter="cargarPreviewEsquemaPagos()"
                placeholder="No. semanas del curso" min="1" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <label>
                Hora Inicio
                <span class="text-danger">*</span>
              </label>
              <vue-timepicker  v-model="input.hora_inicio" :minute-interval="30" :hour-range="[[7, 20]]"
                :hide-disabled-hours="true" hour-label="hora" minute-label="minuto" format="HH:mm" placeholder="00:00">
              </vue-timepicker>
            </div>
            <div class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <label>
                Hora Fin
                <span class="text-danger">*</span>
              </label>
              <vue-timepicker v-model="input.hora_fin" :min="input.hora_inicio" :minute-interval="30"
                :hour-range="[[7, 20]]" :hide-disabled-hours="true" hour-label="hora" minute-label="minuto"
                format="HH:mm" placeholder="00:00"></vue-timepicker>
            </div>
          </div>

         

          

          <div class="form-row">
            <div class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <label>
                Colegiatura base
                <span class="text-danger">*</span>
              </label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <div class="input-group-text text-gray text-sm">{{nombre_seleccion_esquema}}$</div>
                </div>
                <input type="number" v-model="input.costo_colegiatura_base" class="form-control"
                  placeholder="Costo Colegiatura" min="0" required />
              </div>
            </div>
            <div class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <label>
                Inscripción base
                <span class="text-danger">*</span>
              </label>
              <div class="input-group">
                <div class="input-group-prepend">
                  <div class="input-group-text text-gray">$</div>
                </div>
                <input type="number" v-model="input.costo_inscripcion_base" class="form-control"
                  placeholder="Costo Inscripción" min="0" required />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label> Nota </label>
            <input type="text" v-model="input.nota" class="form-control" />
          </div>
        </div>

        <div class="col-5 col-sm-5 col-md-5 col-lg-5 col-xl-5  ">                        
          <fieldset >
            <div class="row">
              <div :class="`col p-3  border border-light pt-3 `" :style="`height:540px;overflow-y:scroll;`">
                <table :class="`table table-sm table-hover ${loaderListaPagos && 'bg-secondary'}`">
                  <thead>
                    <tr>
                      <th class="pl-0 pr-0">
                          {{ seleccion_esquema == esquemas.SEMANAL.id ? 'Sem.':'' }}
                          {{ seleccion_esquema == esquemas.MENSUAL.id ? 'MES':'' }}
                      </th>
                      <th class="pl-0 pr-0">Pago</th>
                      <th class="pl-0 pr-0">Colegiatura</th>
                      <th class="pl-0 pr-0"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <!--v-if="item.generar_cargo || mostrarTodaListaPagos"-->
                    <tr v-for="item in listaPagos" :key="item.dia" >
                      <td class="p-0"> <span :class="`${!item.generar_cargo && 'text-muted'}`">
                            {{ item.numero }}</span></td>
                      <td class="p-0">
                        <span :class="`${!item.generar_cargo && 'text-muted'}`">                          
                          <span>
                            {{ item.nombre_dia }} {{ item.numero_dia }} de {{ item.abreviatura_mes }}
                          </span>
                          <span v-if="item.es_fecha_pasada" style="font-size:9px" class="text-danger ">fecha
                            pasada</span>
                        </span>                        
                      </td>
                      <td class="p-0 text-center">
                        ${{input.costo_colegiatura_base}}                        
                        <!--<div class="custom-control custom-switch small">
                          <input type="checkbox" class="custom-control-input" v-model="item.generar_cargo"
                            @change="actualizarContadoresPagos()" :id="`select_${item.numero_semana_curso}`">
                          <label class="custom-control-label " :for="`select_${item.numero_semana_curso}`">
                            <span v-if="item.generar_cargo" class="text-success">paga {{ (seleccion_esquema ==  esquemas.MENSUAL.id) ? item.abreviatura_mes : ''
                            }}</span>
                            <span v-else class="text-muted">no paga</span>
                          </label>
                        </div>
                        -->
                      </td>
                      <td>
                        <i class="fa fa-trash text-danger "></i> 
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>  
          </fieldset>
        </div>

      </div>
      <div slot="footer">
        <button v-if="operacion === 'INSERT'" class="btn btn-primary" :disabled="loader" @click="guardar()">
          <span v-if="loader" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Guardar
        </button>
        <button v-if="operacion === 'UPDATE'" class="btn btn-primary" :disabled="loader" @click="guardar()">
          <span v-if="loader" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          Modificar
        </button>
      </div>
    </Popup>

    <div class="card">
      <div class="card-body">
        <div class="input-group mb-3">
          <input type="text" class="form-control" placeholder="Buscar por nombre.." v-model="criterioNombre"
            v-on:keyup.enter="buscarPorNombre()" aria-label="Buscar por nombre.." />
          <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="button" v-on:click="buscarPorNombre()">
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <div v-if="loader" class="mx-auto">
          <Loader :loading="loader" :mini="true" />
        </div>

        <span v-for="item in lista" :key="item.id">

          <RowCurso :curso="item" :clickHeader="() => { seleccionar(item, 'DETALLE') }" />

          <div class="row mt-0 border-bottom">
            <div class="col-md-8  offset-md-4  text-right">
              <button class="btn btn-outline-primary btn-sm" @click="seleccionar(item, 'DETALLE')">
               <i class="fa fa-eye"></i> Ver detalle
              </button>              
              <button v-if="item.fecha_inicio_previsto_pasada" class="btn btn btn-outline-primary btn-sm"
                @click="seleccionar(item, 'UPDATE')">
                <i class="fa fa-edit"></i>Modificar
              </button>
              <button v-if="item.fecha_inicio_previsto_pasada" class="btn btn-outline-danger btn-sm"
                @click="seleccionar(item, 'DELETE')">
                <i class="fa fa-trash"></i> Eliminar
              </button>
              <button :class="`btn btn-link ${item.inscripciones_cerradas ?  '':'text-red'}`" @click="seleccionar(item, 'CERRAR_INSCRIPCIONES')">
               <i :class="`${item.inscripciones_cerradas ? 'fa fa-unlock':'fa fa-lock'}`" />  {{item.inscripciones_cerradas  ? 'Abrir':'Cerrar'}} inscripciones
              </button>

            </div>
          </div>
        </span>
      </div>
    </div>

    <!--Eliminar-->
    <Popup id="popup_eliminar" :show_button_close="true">
      <div slot="header">Eliminar Taller</div>
      <div slot="content">
        <div class="row text-left">
          <table class="table table-sm">
            <tr>
              <td  rowspan="4" class="col-4">
                <img
                  v-if="input.foto_curso"
                  class="mr-3 img-fluid rounded"
                  width="150"
                  :src="input.foto_curso"
                  alt="Especialidad"
                />
                <div v-else class="card border-light" style="width: 140px">
                  <div class="card-body">
                    <i>sin imagen</i>
                  </div>
                </div>
              </td>
              <td>
                <span class="font-weight-bold">{{ input.especialidad }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="font-weight-bold">
                  {{
                      input.fecha_inicio_format
                        ? input.fecha_inicio_format
                        : ` previsto ${input.fecha_inicio_previsto_format}`
                  }}
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="font-weight-bold">{{ input.dia }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="font-weight-bold">{{ input.horario }}</span>
              </td>
            </tr>
            <tr>
              <td>Motivo de baja <span class="text-danger">*</span></td>
              <td>
                <textarea v-model="motivo" class="form-control" rows="2">
                </textarea>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-danger" @click="eliminar()">Eliminar</button>
      </div>
    </Popup>


 <!--cerrar / abrir inscripciones-->
    <Popup id="popup_cerrar_inscripciones" :show_button_close="true">
      <div slot="header">{{input.inscripciones_cerradas  ? 'Abrir':'Cerrar'}} Inscripciones</div>
      <div slot="content">
        <div class="row text-left">
          <table class="table table-sm">
            <tr >
              <td rowspan="4" class="col-4">                
                <img
                  v-if="input.foto_curso"
                  class="mr-3 img-fluid rounded"
                  width="150"
                  :src="input.foto_curso"
                  alt="Especialidad"
                />
                <div v-else class="card border-light" style="width: 140px">
                  <div class="card-body">
                    <i>sin imagen</i>
                  </div>
                </div>                
              </td>
              <td>
                <span class="font-weight-bold">{{ input.especialidad }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="font-weight-bold">
                  {{
                    input.fecha_inicio_format
                      ? input.fecha_inicio_format
                      : `inicia ${input.fecha_inicio_previsto_format}`
                  }}
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="font-weight-bold">{{ input.dia }}</span>
              </td>
            </tr>
            <tr>
              <td>
                <span class="font-weight-bold">{{ input.horario }}</span>
              </td>
            </tr>
            <tr>              
              <td colspan="2">
                Escribe una nota <span class="text-danger">*</span>
                <textarea v-model="motivo" class="form-control" rows="2">
                </textarea>
              </td>
            </tr>
            <tr>
              <td colspan="2" class="text-red">
                  <i class="fa fa-exclamation-triangle"></i> Al {{input.inscripciones_cerradas  ? ' Abrir las inscripciones todo se habilitará para realizar inscripciones':'Cerrar las inscripciones no podrán realizar inscripciones'}} 
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div slot="footer">
        <button :class="`${input.inscripciones_cerradas ? 'btn btn-primary':'btn btn-danger'}`" @click="abrirCerrarInscripciones()">
        <i :class="input.inscripciones_cerradas ? 'fa fa-unlock':'fa fa-lock'"></i>
        {{input.inscripciones_cerradas  ? 'Abrir':'Cerrar'}} inscripciones</button>
      </div>
    </Popup>

  </div>
</template>

<script>
import { operacionesApi } from "../helpers/OperacionesApi";
import { getUsuarioSesion } from "../helpers/Sesion";
import Datepicker from "vuejs-datepicker";
import URL from "../helpers/Urls";
import Emit from "../helpers/Emit";
import { validacionDatosAlumno } from "../helpers/AlumnoValidacion";
import { en, es } from "vuejs-datepicker/dist/locale";
import Loader from "../components_utils/Loader";
import moment from "moment";
import Popup from "../controller/Popup";
import InscripcionAlumno from "./InscripcionAlumno.vue";
import RowCurso from "./fragmentos/curso/RowCurso";
import VueTimepicker from "vue2-timepicker";
import PopupPagoPendiente from "./PopupPagoPendiente.vue";
import { returnStatement } from "babel-types";

export default {
  name: "cat-cursos",
  components: {
    Datepicker,
    Loader,
    Popup,
    InscripcionAlumno,
    RowCurso,
    VueTimepicker,
    PopupPagoPendiente
  },
  mixins: [operacionesApi],
  data() {
    return {
      criterioNombre: "",
      operacion: "",
      usuarioSesion: {},
      input: {
        id: 0,
        cat_especialidad: -1,
        dias: [],
        //dias_array: [],
        cat_dia: -1,
        //cat_horario: -1,
        hora_inicio: null,
        hora_fin: null,
        co_empresa: -1,
        co_sucursal: -1,
        costo_colegiatura_base: 0,
        costo_inscripcion_base: 0,
        nota: "",
        fecha_inicio_previsto: new Date(),
        fecha_fin_previsto: new Date(),
        hora_inicio: null,
        hora_fin: null,
        numero_semanas: 0,
        genero: 0,
      },
      rangoHora: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      lista: [],
      listaEspecialidades: [],
      listaDias: [],
      listaHorarios: [],
      esquemaPagos: null,
      listaPagos: [],
      motivo: "",
      es: es,
      loader: false,
      loaderListaPagos: false,
      isModificacion: false,
      seleccion_esquema: 0,
      nombre_seleccion_esquema: "",
      esquemas: { SEMANAL: { id: 1, nombre: "Semanas" }, MENSUAL: { id: 2, nombre: "Meses" } },
      mostrarTodaListaPagos: false,
      contadorSemanasPago: 0,
      contadorMesesPago: 0
    };
  },
  mounted() {
    console.log("##### CATALOGO DE TALLERES  ####");
    this.usuarioSesion = getUsuarioSesion();
    console.log(`catalogo de talleres`);
    this.init();
  },
  methods: {
    async init() {
      await this.cargarCursos();
      this.operacion = "INSERT";
    },
    async cargarCursos() {
      this.lista = await this.getAsync(
        `${URL.CURSO}/sucursal/${this.usuarioSesion.co_sucursal}`
      );
    },
    async seleccionar(row, ope) {
      console.log("====" + JSON.stringify(row));
      this.input = Object.assign({}, row);
      this.operacion = ope;
      this.motivo="";
      if (this.operacion === "DELETE") {
        $("#popup_eliminar").modal("show");
      }

      if (this.operacion === "UPDATE") {
        await this.cargarCatalogos();
        console.log(this.input);

        this.input.fecha_inicio_previsto = new Date(
          this.input.fecha_inicio_previsto + ' 00:00:00'
        );
        $("#popup_curso").modal("show");
      }

      if (this.operacion === "CONFIRM") {
        this.$router.push({ name: "ConfirmarInscripcion", params: { uidCurso: row.uid, cat_especialidad: row.cat_especialidad } });
      }

      if (this.operacion == "DETALLE") {
        console.log("DETALLE CURSO");
        this.$router.push({ name: "DetalleCurso", params: { uidCurso: row.uid } });
      }

      if (this.operacion == "CERRAR_INSCRIPCIONES") {
          console.log("CERRAR_INSCRIPCIONES");
          $("#popup_cerrar_inscripciones").modal("show");
      }

    },
    async nuevo() {
      this.operacion = "INSERT";
      this.seleccion_esquema = this.esquemas.SEMANAL.id;
      this.esquemaPagos = {};
      this.listaPagos = [];
      this.contadorSemanasPago = 0;
      this.contadorMesesPago = 0;
      this.revisarVisibilidadListaPagos();
      this.setNombreEsquemaSeleccionado();

      await this.cargarCatalogos();

      this.input.cat_especialidad = null;
      //this.input.cat_horario = -1;
      this.input.hora_inicio = "";
      this.input.hora_fin = "";
      this.input.cat_dia = -1;//moment(input.fecha_inicio_previsto).isoWeekday();
      this.input.numero_semanas = 0;
      this.input.costo_colegiatura_base = 0;
      this.input.costo_inscripcion_base = 0;
      this.input.nota = "";
      this.input.fecha_inicio_previsto = new Date();

      $("#popup_curso").modal("show");
    },
    async cargarCatalogos() {
      this.listaDias = await this.getAsync(
        `${URL.DIAS_BASE}/${this.usuarioSesion.id_empresa}`
      );

      /*this.listaDias = lDias.map((e) => {
        return { checked: false, ...e };
      });*/

      this.listaHorarios = await this.getAsync(
        `${URL.HORARIOS_BASE}/${this.usuarioSesion.id_empresa}`
      );

      this.listaEspecialidades = await this.getAsync(
        `${URL.ESPECIALIDADES_BASE}/${this.usuarioSesion.id_empresa}/${this.usuarioSesion.co_sucursal}`
      );
    },
    async guardar() {
      console.log("@guardar");
      /*
            const diasArray = this.listaDias.reduce(function (filtered, item) {
              if (item.checked) {
                filtered.push(item.id);
              }
              return filtered;
            }, []);*/


      /*    this.input.genero = this.usuarioSesion.id;
          this.input.co_empresa = this.usuarioSesion.id_empresa;
          this.input.co_sucursal = this.usuarioSesion.co_sucursal;
    */
      if (!this.validarDatos()) {
        return;
      }

      //const catDia = getDiaFechaInicioSeleccionadaList();

      const curso = {
        cat_especialidad: this.input.cat_especialidad.id,
        cat_esquema_pago: this.seleccion_esquema,
        cat_dia: this.input.cat_dia,
        hora_inicio: this.input.hora_inicio,
        hora_fin: this.input.hora_fin,
        costo_colegiatura_base: this.input.costo_colegiatura_base,
        costo_inscripcion_base: this.input.costo_inscripcion_base,
        nota: this.input.nota,
        fecha_inicio_previsto: this.input.fecha_inicio_previsto,
        numero_semanas: this.input.numero_semanas,
        array_semanas_curso: this.listaPagos,
        genero: this.usuarioSesion.id,
        co_empresa: this.usuarioSesion.id_empresa,
        co_sucursal: this.usuarioSesion.co_sucursal,
        genero: this.usuarioSesion.id
      };

      this.loader = true;
      let isModificacion = this.operacion == "UPDATE";
      console.log(`inciando ${this.operacion} de curso ${JSON.stringify(curso)}`);

      const respuesta = isModificacion
        ? await this.putAsync(`${URL.CURSO}/${this.input.id}`, curso)
        : await this.postAsync(`${URL.CURSO}`, curso);

      if (respuesta) {
        this.$notificacion.info(
          `Curso ${isModificacion ? "modificado" : "registrado"}`,
          `Se ${isModificacion ? "modificado" : "registró"} el curso`
        );
        this.cargarCursos();
        $("#popup_curso").modal("hide");
      } else {
        this.$notificacion.error(
          "Ups!",
          "Algo sucedió al intentar guardar el curso, ponte en contacto con soporte técnico."
        );
      }
      this.loader = false;
    },
    async eliminar() {
      if (!this.motivo || this.motivo == "") {
        this.$notificacion.error(
          "Motivo de baja",
          "Escribe el motivo por el cual daras de baja el curso."
        );
        return;
      }

      const result = await this.putAsync(
        `${URL.CURSO}/eliminar/${this.input.id}`,
        { motivo: this.motivo, genero: this.usuarioSesion.id }
      );

      this.cargarCursos();

      $("#popup_eliminar").modal("hide");
    },

    async abrirCerrarInscripciones() {
      if (!this.motivo || this.motivo == "") {
        this.$notificacion.error(
          "Escribe una nota",
          "Por favor escribe una nota para proceder a cerrar las inscripciones."
        );
        return;
      }

      let isCerrar = !this.input.inscripciones_cerradas;

      const result = await this.putAsync(
        `${URL.CURSO}/${isCerrar ? 'cerrar':'abrir'}/${this.input.id}`,
        { motivo: this.motivo, genero: this.usuarioSesion.id }
      );

      this.cargarCursos();

      $("#popup_cerrar_inscripciones").modal("hide");
    },
    getDiaFechaInicioSeleccionadaList(){
        let dia = null;
        if(this.input.fecha_inicio_previsto && this.listaDias){
          const  nDia = moment(this.input.fecha_inicio_previsto).isoWeekday()-1;
          dia = this.listaDias[nDia];         
        }
        return dia;
    },
    getNombreDia() {
      let nombreDia = '';
      if (this.input && this.input.fecha_inicio_previsto) {
        const diaOfList = this.getDiaFechaInicioSeleccionadaList();
        this.input.cat_dia = diaOfList && diaOfList.id;
        nombreDia = diaOfList && diaOfList.nombre;
      }
      return nombreDia;

    },
    async setNumeroSemanasEspecialidad() {
      if (this.input.cat_especialidad) {
        this.input.numero_semanas = this.input.cat_especialidad.duracion;
        await this.cargarPreviewEsquemaPagos();
      }
    },
    validarHoras(eventData) {
      let horaEntrada = moment({
        hour: this.input.hora_entrada.HH,
        minute: this.input.hora_entrada.mm
      });
      let horaSalida = moment({
        hour: this.input.hora_salida.HH,
        minute: this.input.hora_salida.mm
      });
      console.log(` ${horaEntrada} salida ${horaSalida}`);
      if (horaSalida <= horaEntrada) {
        Vue.prototype.$notificacion.error(
          "Hora de entrada y salida",
          "La hora de entrada es menos a la hora de salida."
        );
        return false;
      }
    },
    validarDatos() {
      let val = true;

      if (this.input.cat_especialidad == null) {
        this.$notificacion.error("Especialidad", "Selecciona la especialidad");
        val = false;
      }

      if (this.input.numero_semanas == 0 || this.input.numero_semanas == '') {
        this.$notificacion.error("Semanas", "Escriba el número de semanas");
        val = false;
      }

      /*if (this.input.dias_array.length == 0) {
        this.$notificacion.error("Dias", "Selecciona los dias a impartir");
        val = false;
      }*/

      if (this.input.hora_inicio == "" || this.input.hora_fin == "") {
        this.$notificacion.error("Hora de inicio", "Selecciona la hora de inicio y fin");
        val = false;
      }

      if (
        this.input.fecha_inicio_previsto == null ||
        this.input.fecha_inicio_previsto == ""
      ) {
        this.$notificacion.error(
          "Fecha de inicio",
          "Selecciona la fecha de inicio"
        );
        val = false;
      }

      if (this.input.costo_colegiatura_base == '') {
        this.$notificacion.error(
          "Colegiatura",
          "Escribe el costo de la colegiatura"
        );
        val = false;
      }

      if (this.input.costo_inscripcion_base == '') {
        this.$notificacion.error(
          "Inscripción",
          "Escribe el costo de la inscripción"
        );
        val = false;
      }

      if (this.input.numero_semanas > 0) {

        let existenPagosSeleccionados = false;
        this.listaPagos.forEach(element => {
          if (element.generar_cargo) {
            existenPagosSeleccionados = true;
          }
        });

        if (this.listaPagos.length == 0 || !existenPagosSeleccionados) {
          this.$notificacion.error(
            "Seleccione un pago",
            "No existen pagos seleccionados de la lista, por favor seleccione al menos 1"
          );
          val = false;
        }
      }

      return val;
    },
    async cargarPreviewEsquemaPagos() {

      console.log("Fecha inicio" + this.input.fecha_inicio_previsto);
      console.log("Fecha numero semanas" + this.input.numero_semanas);

      if (!this.input.fecha_inicio_previsto || !this.input.numero_semanas || !this.seleccion_esquema) {
        return;
      }

      this.loaderListaPagos = true;
      let fecha = moment(this.input.fecha_inicio_previsto).format('YYYY-MM-DD');

    console.log(`${URL.PERIODOS_CURSO}/semanas/calculadas/${fecha}/${this.input.numero_semanas}/${this.seleccion_esquema}/${this.usuarioSesion.id_empresa}`);
      this.esquemaPagos = await this.getAsync(
        `${URL.PERIODOS_CURSO}/semanas/calculadas/${fecha}/${this.input.numero_semanas}/${this.seleccion_esquema}/${this.usuarioSesion.id_empresa}`
      );

      this.listaPagos = this.esquemaPagos.semanas;
      this.procesarListaPagos();
      this.loaderListaPagos = false;

    },
    async onChangeEsquemaPago(event) {
      await this.cargarPreviewEsquemaPagos();
      this.procesarListaPagos();
      this.revisarVisibilidadListaPagos();
      this.setNombreEsquemaSeleccionado();
    },
    revisarVisibilidadListaPagos() {
      this.mostrarTodaListaPagos = false;
      this.mostrarTodaListaPagos = (this.seleccion_esquema == this.esquemas.SEMANAL.id);
    },
    procesarListaPagos() {

      console.log("procesarListaPagos");

      if (!this.listaPagos || !this.input.cat_especialidad) {
        return;
      }

      if (this.seleccion_esquema == this.esquemas.SEMANAL.id) {
        this.listaPagos.forEach(element => {          
          element.generar_cargo = !element.es_fecha_pasada;
        });
      }
      if (this.seleccion_esquema == this.esquemas.MENSUAL.id) {
        this.listaPagos.forEach(element => {          
          element.generar_cargo = (element.generar_cargo && !element.es_fecha_pasada) ? true : false;
        });
      }
      this.actualizarContadoresPagos();
    },
    actualizarContadoresPagos() {
      this.contadorSemanasPago = 0;
      this.contadorMesesPago = 0;

      this.listaPagos.forEach((item) => {
        if (item.generar_cargo && this.seleccion_esquema == this.esquemas.SEMANAL.id) {
          this.contadorSemanasPago += 1;
        }
        if (item.generar_cargo && this.seleccion_esquema == this.esquemas.MENSUAL.id) {
          this.contadorMesesPago += 1;
        }
      });


    },
    cambiarFecha() {
      this.$nextTick(async () => {
        await this.cargarPreviewEsquemaPagos();

      });
    },
    setNombreEsquemaSeleccionado() {
        if(this.seleccion_esquema == this.esquemas.SEMANAL.id){
          this.nombre_seleccion_esquema =  this.esquemas.SEMANAL.nombre;
        }
        if(this.seleccion_esquema == this.esquemas.MENSUAL.id){
          this.nombre_seleccion_esquema= this.esquemas.MENSUAL.nombre;
        }
    }
  },
};

</script>

<style scoped>
</style>
