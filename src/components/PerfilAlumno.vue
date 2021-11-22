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
            <span v-if="alumno.mostrar_nombre_carino"
              >({{ alumno.nombre_carino }})</span
            >
          </p>
          <p>
            <small>{{ alumno.nombre_grupo }}</small>
          </p>
        </div>
        <div class="col text-center">
          <div class="text-danger card font-weight-bold h6">
            <div class="card-body">
              Balance
              <p>
                $<balance-alumno
                  :idalumno="id"
                  mostrarfecha="true"
                ></balance-alumno>
              </p>
              <estado-cuenta :idAlumno="id" />
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
                id="pills-contacto-tab"
                data-toggle="pill"
                href="#pills-contacto"
                role="tab"
                aria-controls="pills-contacto"
                aria-selected="false"
                >Contacto
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
                >Pagos
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
                  <div class="form-row">
                    <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <label>Alumno<span class="text-danger">*</span></label>
                      <input
                        type="text"
                        v-model="alumno.nombre"
                        class="form-control"
                        placeholder="Nombre"
                        required
                        autofocus
                      />
                    </div>

                    <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <label>Apellidos</label>
                      <input
                        type="text"
                        v-model="alumno.apellidos"
                        class="form-control"
                        placeholder="Apellidos"
                        required
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Dirección</label>
                    <input
                      type="text"
                      v-model="alumno.direccion"
                      class="form-control"
                      placeholder="Dirección "
                    />
                  </div>

                  <div class="form-row">
                    <div class="form-group col-6">
                      <label>
                        F. de nacimiento
                        <span class="text-danger">*</span>
                      </label>
                      <datepicker
                        name="fecha_nacmiento"
                        v-model="alumno.fecha_nacimiento"
                        input-class="form-control"
                        :format="'yyyy-MM-dd'"
                        :bootstrap-styling="true"
                        :language="es"
                        required
                      ></datepicker>
                    </div>
                    <div class="form-group col-6">
                      <label>Sexo<span class="text-danger">*</span></label>
                      <select
                        v-model="alumno.cat_genero"
                        class="form-control"
                        placeholder="Grupo"
                        required
                      >
                        <option
                          id="selectGeneroAlumno"
                          v-for="genero in listaGeneroAlumno"
                          v-bind:value="genero.id"
                          v-bind:key="genero.id"
                          >{{ genero.nombre }}</option
                        >
                      </select>
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-6">
                      <label>
                        Especialidad
                        <span class="text-danger">*</span>
                      </label>
                      <select
                        v-model="alumno.co_grupo"
                        class="form-control"
                        placeholder="Grupo"
                        required
                      >
                        <option
                          v-for="grupo in listaGrupos"
                          v-bind:value="grupo.id"
                          v-bind:key="grupo.id"
                          >{{ grupo.nombre }}</option
                        >
                      </select>
                    </div>
                    <div class="form-group col-6">
                      <label>
                        F. de Inscripción
                        <span class="text-danger">*</span>
                      </label>
                      <datepicker
                        name="fecha_inscripcion"
                        v-model="alumno.fecha_inscripcion"
                        input-class="form-control"
                        :bootstrap-styling="true"
                        :language="es"
                        required
                      ></datepicker>
                    </div>
                  </div>

                  <div class="form-row">
                    <div
                      class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6"
                    >
                      <label>
                        Hora Entrada
                        <small class="text-muted">(Pe. 08:00)</small>
                        <span class="text-danger">*</span>
                      </label>
                      <input
                        type="time"
                        v-model="alumno.hora_entrada"
                        class="form-control"
                        placeholder="H. Entrada"
                        required
                      />
                    </div>
                    <div
                      class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6"
                    >
                      <label>
                        Hora Salida
                        <small class="text-muted">(Pe. 20:00)</small>
                        <span class="text-danger">*</span>
                      </label>
                      <input
                        type="time"
                        v-model="alumno.hora_salida"
                        class="form-control"
                        placeholder="H. Salida"
                        required
                      />
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-6">
                      <label>
                        Colegiatura
                        <span class="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        v-model="alumno.costo_colegiatura"
                        class="form-control"
                        placeholder="Costo Colegiatura"
                        min="0"
                        required
                      />
                    </div>
                    <div class="form-group col-6">
                      <label>
                        Inscripción
                        <span class="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        v-model="alumno.costo_inscripcion"
                        class="form-control"
                        placeholder="Costo Inscripcion"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group col-6">
                      <label for="inputFechaLimitePago">
                        Fecha Pago
                        <span class="text-danger">*</span>
                      </label>
                      <datepicker
                        id="inputFechaLimitePagoColegiatura"
                        v-model="alumno.fecha_limite_pago"
                        input-class="form-control"
                        :bootstrap-styling="true"
                        :language="es"
                        required
                      ></datepicker>
                    </div>
                    <div class="form-group col-6">
                      <label for="inputFechaLimitePago">Nota </label>
                      <textarea
                        rows="2"
                        v-model="alumno.nota"
                        class="form-control"
                        placeholder="Notas "
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    class="btn btn-lg btn-primary"
                    v-on:click="modificar()"
                  >
                    Guardar
                  </button>
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
                    :idalumno="id"
                    :requiere_factura="alumno.factura"
                  ></cargos-pagos>
                </div>
              </div>
            </div>

            <!-- PAGOS -->

            <!-- contacto -->
            <div
              class="tab-pane fade"
              id="pills-contacto"
              role="tabpanel"
              aria-labelledby="pills-contacto-tab"
            >
              <div class="card">
                <div class="card-body">
                  <div class="form-row">
                    <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <label>Télefono</label>
                      <input
                        type="text"
                        v-model="alumno.telefono"
                        class="form-control"
                        placeholder="(52)"
                        required
                        autofocus
                      />
                    </div>

                    <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
                      <label>Correo</label>
                      <input
                        type="text"
                        v-model="alumno.correo"
                        class="form-control"
                        placeholder="@"
                        required
                      />
                    </div>
                  </div>
                  <button
                  type="button"
                  class="btn btn-primary"
                  v-on:click="modificar()"
                >
                  Guardar
                </button>
                </div>                
              </div>
            </div>

            <!--contacto-->
          </div>
        </div>
      </div>
    </div>

    <!-- EN CASO DE NO ENVIAR EL ID -->
    <div class="text-info" v-else-if="display == false">
      Es necesario seleccionar un alumno
    </div>
    <!-- MODAL TOAST -->
    <div
      id="toast_id"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      class="toast border-warning"
      data-autohide="true"
      data-delay="1000"
    >
      <div class="toast-header p-1 mb-1 bg-warning text-dark">
        <!--<img src="" class="rounded mr-2" alt="...">-->
        <strong class="mr-auto">Perfil</strong>
        <!--<small>11 mins ago</small>-->
        <button
          type="button"
          class="ml-2 mb-1 close"
          data-dismiss="toast"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body">
        <p id="toast_msg"></p>
      </div>
    </div>
    <!-- MODAL TOAST -->

    <!-- captura de fecha de pago-->

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
