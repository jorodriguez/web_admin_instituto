<template>
  <div class="perfil container">
    <div class="text-info">{{ mensaje }}</div>
    <div v-if="display == true" class="text-left">
      <div class="row">
        <div class="col">
          <router-link
            :to="{ name: 'CatAlumno', params: {} }"
            class="btn btn-secondary btn-lg"
            v-if="!usuarioSesion.permiso_gerente"
          >
            <i class="fas fa-arrow-circle-left text-gray"></i>
          </router-link>
          <router-link
            :to="{ name: 'ReporteDeudas', params: {} }"
            class="btn btn-secondary btn-lg"
            v-if="usuarioSesion.permiso_gerente"
          >
            <i class="fas fa-arrow-circle-left text-gray"></i>
          </router-link>
          <!--<a @click="$router.go(-1)" class="btn btn-secondary btn-lg">
            <i class="fas fa-arrow-circle-left text-white"></i>
          </a>
          -->
        </div>
        <div class="col text-center">
          <img
            :src="alumno.foto"
            class="rounded-circle"
            width="50"
            height="50"
            style="cursor:pointer"
            title="Actualizar foto de perfil"
            @click="subirFotoPerfil(alumno.id)"
          />
          <p class="font-weight-bold h4">
            {{ alumno.nombre }}
            {{ alumno.apellidos }}            
          </p>
          <p>
            <small>especialidad</small>
          </p>
        </div>
        <div class="col text-center">
          <div class="text-danger card font-weight-bold h6">
            <div class="card-body">
              Balance
              <p>
                ${{alumno.total_adeudo}}
                <!--<balance-alumno
                  :idalumno="id"
                  mostrarfecha="true"
                ></balance-alumno>-->
              </p>
              <!--<estado-cuenta :idAlumno="id" />-->
            </div>
          </div>
        </div>
        <div class="w-100" />
      </div>

      <div class="row">
        <div class="col">
          <!-- CONTENIDO -->
          <ul class="nav nav-pills nav-justified" id="pills-tab" role="tablist">
            <li class="nav-item">
              <a
                class="nav-link active"
                id="pills-home-tab"
                data-toggle="pill"
                href="#pills-home"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
                >Perfil</a
              >
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                id="pills-inscripciones-tab"
                data-toggle="pill"
                href="#pills-inscripciones"
                role="tab"
                aria-controls="pills-inscripciones"
                aria-selected="false"
                @click="cargarCursos()"
                >Inscripciones
              </a>
            </li>

            <li class="nav-item">
              <a
                class="nav-link"
                id="pills-servicios-tab"
                data-toggle="pill"
                href="#pills-servicios"
                role="tab"
                aria-controls="pills-servicios"
                aria-selected="false"
                >Cobranza
              </a>
            </li>
          </ul>
          <div class="tab-content" id="pills-tabContent">
            <div
              class="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
            >
              <div class="card">
                <div class="card-body">                  
                  <DatosAlumno :uuidAlumno="alumno.uid"/>               
                </div>
              </div>
            </div>

            <!-- PAGOS -->
            <div
              class="tab-pane fade"
              id="pills-servicios"
              role="tabpanel"
              aria-labelledby="pills-servicios-tab"
            >
              <div class="card">
                <div class="card-body">
                  <!-- Componente especial para cargos y pagos -->
                  <cargos-pagos
                    :uidalumno="alumno.uid"                    
                  ></cargos-pagos>
                </div>
              </div>
            </div>

            <!-- PAGOS -->

            <!-- inscripciones -->
            <div
              class="tab-pane fade"
              id="pills-inscripciones"
              role="tabpanel"
              aria-labelledby="pills-inscripciones-tab"
            >
              <div class="card">
                <div class="card-body">
                  
                  <CursosAlumno :lista="listaInscripciones"/>
                                    
                </div>                
              </div>
            </div>

            <!--inscripciones-->
          </div>
        </div>
      </div>
    </div>

   

    <!-- captura de fecha de pago-->
<!--
    <Popup id="popup_captura_fecha_pago" :show_button_close="false">
      <div slot="header">
        Fecha de pago
        <strong> {{ alumno.nombre }} {{ alumno.apellidos }}</strong>
      </div>
      <div slot="content">
        <div class="row justify-content-md-center"></div>
      </div>
      <div slot="footer">
        <button class="btn btn-primary">
          Seleccionar
        </button>
      </div>
    </Popup>
    -->
  </div>
</template>

<script src="../controller/PerfilAlumnoController.js"></script>

<style scoped>
.scroll-div {
  width: 100%;
  height: 500px;
  overflow-y: scroll;
}
</style>
