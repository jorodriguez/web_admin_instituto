<template>
  <div class="container">
    <h2>Estado de cuenta</h2>
    <div class="jumbotron jumbotron-fluid">
      <div class="row d-flex justify-content-center">
        <h3 v-if="!!alumno">{{ alumno.nombre }} {{ alumno.apellidos }}</h3>
        <h3 v-if="!alumno" class="text-red">No se encuentra el alumno</h3>
      </div>

      <div class="container">
        <div class="row">
          <div class="order-2 col-sm-12 col-md-10 col-lg-10 col-xl-10">
            <div
              :class="`row mb-2 ${
                alumno.total_adeudo > 0
                  ? 'border border-danger'
                  : 'border border-success'
              }`"
            >
              <div
                :class="`col-6 text-center align-self-center`"
              >
                <h2>
                  {{ alumno.total_adeudo > 0 ? 'ADEUDO' : ' AL CORRIENTE' }}
                </h2>
              </div>
              <div
                :class="`col-6 ${
                  alumno.total_adeudo > 0
                    ? 'bg-gradient-danger text-white'
                    : 'bg-green text-white'
                }`"
              >
                <div
                  :class="`card ${
                    alumno.total_adeudo > 0
                      ? 'bg-gradient-danger text-white'
                      : 'bg-green text-white'
                  }`"
                >
                  <h1 v-if="alumno.total_adeudo > 0" class="text-white">
                    ${{ alumno.total_adeudo }}
                  </h1>
                  <i v-else class="fas fa-check fa-3x"></i>
                </div>
              </div>
            </div>

            <div
                class="row  "                
              >
                <div class="col-sm-12 col-md-1 col-lg-1 col-xl-1 text-left d-none d-xl-block bg-light">
                  <strong>#</strong>
                </div>
                <div class="col-sm-12 col-md-2 col-lg-2 col-xl-2 text-left d-none d-xl-block bg-light">
                  <strong>Fecha</strong>
                </div>
                <div class="col-sm-12 col-md-5 col-lg-5 col-xl-5 text-left d-none d-xl-block bg-light text-center">
                  <strong>Cargo</strong>
                </div>
                <div class="col-sm-12 col-md-1 col-lg-1 col-xl-1 d-none d-xl-block bg-light">
                  <strong>Monto</strong>
                </div>
                <div class="col-sm-12 col-md-1 col-lg-1 col-xl-1 d-none d-xl-block bg-light">
                  <strong>Pagado</strong>
                </div>
                <div class="col-sm-12 col-md-2 col-lg-2 col-xl-2 d-none d-xl-block bg-light">
                  <strong>Adeuda</strong>
                </div>
          </div>

            <span v-for="(item, index) in cargosAdeuda" :key="index">
              <div
                class="row border border-bottom"
                :style="`${
                  index % 2 == 0 ? 'background: rgba(255, 0, 66, 0.3)' : ''
                }`"
              >
                <div class="col-sm-12 col-md-1 col-lg-1 col-xl-1 ">
                  <span class="d-none d-sm-block">{{ ++index }}</span>
                </div>
                <div class="col-sm-12 col-md-2 col-lg-2 col-xl-2">
                  <strong class="d-block d-sm-none">Fecha</strong> {{ item.fecha_format }}
                </div>
                <div class="col-sm-12 col-md-5 col-lg-5 col-xl-5 ">
                  <strong class="d-block d-sm-none ">Cargo</strong>
                  {{ item.nombre_cargo }} {{ item.texto_ayuda }} -
                  {{ item.especialidad }}
                </div>
                <div class="col-sm-12 col-md-1 col-lg-1 col-xl-1">
                  <strong class="d-block d-sm-none">Monto</strong> ${{ formatPrice(item.cargo) }}
                </div>
                <div class="col-sm-12 col-md-1 col-lg-1 col-xl-1">
                  <strong class="d-block d-sm-none">Pagado</strong> ${{ formatPrice(item.total_pagado) }}
                </div>
                <div class="col-sm-12 col-md-2 col-lg-2 col-xl-2">
                  <strong class="d-block d-sm-none">Adeuda</strong> <strong>${{ formatPrice(item.total) }}</strong>
                </div>
              </div>
            </span>

            <!--<table class="table table-responsive table-striped table-sm table-hover">
                <tbody v-for="(item, index) in cargosAdeuda" :key="index">
                  <tr class="bg-grandient-red">
                    <td>
                      <span>{{ ++index }}</span>
                    </td>
                    <td>
                      {{ item.fecha_format }}
                    </td>
                    <td class="text-left">
                      {{ item.nombre_cargo }} {{ item.texto_ayuda }} -
                      {{ item.especialidad }}
                    </td>
                    <td class="text-center">
                      {{ item.cargo }}
                    </td>
                    <td class="text-center">
                      {{ item.total_pagado }}
                    </td>
                    <td class="text-center">
                      {{ item.total }}
                    </td>
                  </tr>
                </tbody>
              </table>
              -->
          </div>
          <div class="order-1 col-sm-12 col-md-2 col-lg-2 col-xl-2">
            <div class="card">
              <span v-if="!alumno.foto">no hay foto</span>
              <img v-else :src="alumno.foto" class="card-img-top" alt="..." />
              <div class="card-body p-1 bg-gray">
                <p class="card-text text-sm text-white">{{ alumno.matricula }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!alumno" class="row"></div>
      <!--<div v-else class="row">
        <div class="col-4 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div class="card" style="width: 15rem;">
            <span v-if="!alumno.foto">no hay foto</span>
            <img v-else :src="alumno.foto" class="card-img-top" alt="..." />
            <div class="card-body">
              <h3 class="card-title">
                {{ alumno.nombre }} {{ alumno.apellidos }}
              </h3>
              <p class="card-text"></p>              
            </div>
          </div>
        </div>
        <div class="col-8 col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div class="row">
            <div
              :class="`col-4 ${
                alumno.total_adeudo > 0
                  ? 'bg-danger text-white'
                  : 'bg-green text-white'
              } `"
            >
              <h1 v-if="alumno.total_adeudo > 0" class="text-white">
                ${{ alumno.total_adeudo }}
              </h1>
              <i v-else class="fas fa-check fa-3x"></i>
            </div>
            <div
              class="col-8 text-left d-flex justify-start align-content-start"
            >
              <h1>
                {{ alumno.total_adeudo > 0 ? 'ADEUDO' : ' Al corriente' }}
              </h1>
            </div>
          </div>
          <br />
          <table class="table table-striped table-sm table-hover">
            <tbody v-for="(item, index) in cargosAdeuda" :key="index">
              <tr class="bg-grandient-red">
                <td>
                  <span>{{ ++index }}</span>
                </td>
                <td>
                  {{ item.fecha_format }}
                </td>
                <td class="text-left">
                  {{ item.nombre_cargo }} {{ item.texto_ayuda }} -
                  {{ item.especialidad }}
                </td>
                <td class="text-center">
                  {{ item.cargo }}
                </td>
                <td class="text-center">
                  {{ item.total_pagado }}
                </td>
                <td class="text-center">
                  {{ item.total }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>-->
    </div>
  </div>
</template>

<script>
import Popup from '../../../controller/Popup'
import { operacionesApi } from '../../../helpers/OperacionesApi'
import { getUsuarioSesion } from '../../../helpers/Sesion'
import { filtrarNombreAlumno } from '../../../helpers/FiltarUtils'
import URL from '../../../helpers/Urls'
import { formatPrice } from '../../../helpers/Utils';

/* eslint-disable */
export default {
  components: {
    Popup,
  },
  mixins: [operacionesApi],
  name: 'consultar-estado-cuenta-alumno',
  data() {
    return {
      uid: '',
      formatPrice,
      path_retorno: '',
      resultado: {},
      usuarioSesion: {},
      sucursal: {},
      criterioNombre: '',
      listaAlumnos: [],
      lista: [],
      alumno: { id: 0, nombre: '', foto: '' },
      myCroppa: {},
      imgUrl: '',
      cargaAlumno: false,
      loadingCatalogo: false,
      loadingUpload: false,
      pagePreview: '',
      estadoCuenta: {},
      cargosAdeuda: [],
    }
  },
  beforeRouteUpdate(to) {
    console.log('uid = ' + this.uid)
    console.log(' ' + to)
    this.uid = to.params.uid
    this.path_retorno = to.params.path_retorno
  },
  async mounted() {
    this.uid = this.$route.params.uid
    this.usuarioSesion = getUsuarioSesion()

    if (!this.uid) {
      alert('No existe el alumno')
      return
    }

    if (!this.usuarioSesion) {
      alert('No tienes sesion')
      return
    }

    console.log('@ide recibido ' + this.uid)
    await this.cargarAlumno()
    //await this.cargarInformacionSucursal();
  },

  methods: {
    async cargarInformacionSucursal() {
      this.sucursal = await this.getAsync(
        `${URL.SUCURSAL_BASE}/${this.usuarioSesion.co_sucursal}`,
      )
    },
    async cargarAlumno() {
      if (!this.uid) {
        this.$notificacion.error(
          'No se encotro el alumno',
          'Al parecer no encontramos al alumno que busca.',
        )
        return
      }

      this.alumno = await this.getAsync(`${URL.ALUMNOS_BASE}/id/${this.uid}`)

      if (this.alumno) {
        this.estadoCuenta = await this.getAsync(
          `${URL.REPORTES_BASE}/estado-cuenta/${this.alumno.id}`,
        )
        this.cargosAdeuda = this.estadoCuenta.cargos || []
      }

      this.loadingUpload = false
    },
  },
}
</script>
<style scoped>
.output {
  justify-content: center;
  align-content: start;
  padding-top: 1rem;
}

.ac-card {
  display: grid;
  grid-template-columns: 173px 1fr 50px;
  background-color: #fff;
  width: 412.5px;
  height: 250px;
  margin-bottom: 1rem;

  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.ac-icon {
  width: 40px;
  margin-top: 10px;
}

.ac-card-image {
  height: 168px;
  width: 131px;
  margin: 10px 0 0 15px;
  border: 3px solid #006341;
}

.ac-card-info {
  font-size: 1.15rem;
  margin: 0;
}

.ac-card-info p {
  margin-top: 8px;
  line-height: 1.3;
}

.ac-card-footer {
  display: grid;
  align-content: center;
  grid-column: 1/-1;
  align-self: end;
  height: 56.5px;
  background-color: #006341;
}

.ac-logo {
  width: 125px;
  margin-left: 10px;
}

.hide {
  opacity: 0;
  visibility: hidden;
}
</style>
