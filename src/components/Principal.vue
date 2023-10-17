<template>
  <div class="principal fondo_override">
    <h1>{{ usuarioSesion.nombre_sucursal }}</h1>

    <div
      v-if="usuarioSesion.pago_pendiente"
      class="alert alert-warning alert-dismissible fade show"
      role="alert"
    >
      <i class="fa fa-cog fa-spin fa-3x fa-fw"></i>

      <img
        src="https://res.cloudinary.com/dwttlkcmu/image/upload/v1697476796/static-paris/robot_emyyoq.png"
        class="img-thumbnail"
      />
      <i class="fa fa-cog fa-spin fa-3x fa-fw"></i>
      <h2 class="alert-heading">Hola¡</h2>
      <p class="h2">¡Nos emociona mucho ayudarte mes con mes!</p>
      <p class="h4 text-white">
        Te comentamos que ya esta disponible tu
        <strong>facturación mensual</strong>
      </p>
      <hr />
      <p class="mb-0">
        <router-link to="/Cuenta" class="btn btn-secondary">
          Clic aquí para ver tu cuenta
        </router-link>
      </p>
    </div>

    <span v-if="mostrarDashboard">
      <DashboardPrincipal />
    </span>
    <!--<div class="row">                
            <PopupPagoPendiente/>       
      
    </div>   -->
  </div>
</template>

<script>
import URL from '../helpers/Urls'
import { operacionesApi } from '../helpers/OperacionesApi'
import { getUsuarioSesion } from '../helpers/Sesion'
import Constantes from '@/helpers/Constantes'
import PopupPagoPendiente from './PopupPagoPendiente.vue'
import DashboardPrincipal from './reportes/DashboardPrincipal.vue'

export default {
  name: 'principal',
  components: { PopupPagoPendiente, DashboardPrincipal },
  mixins: [operacionesApi],
  data() {
    return {
      usuarioSesion: {},
      mostrarDashboard: false,
    }
  },
  mounted() {
    console.log('##### pagina principal ####')
    this.usuarioSesion = getUsuarioSesion()
    this.revisarPersmiso()
    this.$root.$on('CAMBIO_SUCURSAL', (text) => {
      console.log('CAMBIO_SUCURSAL en MENU ENCABEZADO')
      let message = text
      this.usuarioSesion = getUsuarioSesion()

      this.revisarPersmiso()
    })
  },
  methods: {
    revisarPersmiso() {
      this.mostrarDashboard = false

      let roles = this.usuarioSesion.roles || []

      if (roles) {
        roles.forEach((element) => {
          if (
            element.id == Constantes.ID_ROL_VER_DASHBOARD ||
            element.id == Constantes.ID_ROL_GERENTE ||
            element.id == Constantes.ID_ROL_ADMINISTRADOR
          ) {
            console.log('mostrar dash ')
            this.mostrarDashboard = true
          }
        })
      }
    },
  },
}
</script>

<style>
.btn-head {
  width: 70px !important;
  height: 70px !important;
  /*font-size: 40px;*/
  font-size: 11px;
}

.scroll-div {
  width: 100%;
  height: 75px;
  overflow-y: scroll;
}

.scroll-horas-extra-div {
  width: 100%;
  height: 200px;
  overflow-y: scroll;
}

.scroll-panel-salida-div {
  width: 100%;
  height: 600px;
  padding-left: 15px;
  padding-right: 15px;
  /*overflow-y: scroll;*/
  overflow-y: hidden;
}

#toast-container {
  z-index: 9999999;
}

.container-fluid.override.fondo-override {
  /*background: linear-gradient(80deg, #ffffff, #d4d4d4) !important;*/
}
</style>
