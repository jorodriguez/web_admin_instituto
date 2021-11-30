<template>
  <div class="cat_alumno">
    <h1>Alumnos ({{ lista != [] ? lista.length : 0 }})</h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>
    <div class="row">
      <div class="col-auto mr-auto">
        <router-link to="/principal" class="btn btn-secondary btn-lg">
          <i class="fas fa-arrow-circle-left text-gray"></i>
        </router-link>
        <router-link to="/Inscripcion" class="btn btn-secondary btn-lg">
          Nueva Inscripciòn
        </router-link>        
      </div>
      <div class="col-auto">
        <router-link
          to="/ReactivarAlumno"
          class="btn btn-outline-danger btn-lg"
        >
          Reactivar alumno
        </router-link>
      </div>
    </div>

    <br />
    <div
      id="modal_alumno"
      class="modal"
      tabindex="-1"
      data-keyboard="false"
      data-backdrop="static"
      role="dialog"
    >
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Registro de Alumno</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body text-left">
            <div class="form-row">
              <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <label>Alumno<span class="text-danger">*</span></label>
                <input
                  type="text"
                  v-model="input.nombre"
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
                  v-model="input.apellidos"
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
                v-model="input.direccion"
                class="form-control"
                placeholder="Dirección "
              />
            </div>

            <div class="form-row">
               <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
                <label>
                  Fecha de nacimiento
                  <span class="text-danger">*</span>
                </label>
                <datepicker
                  name="fecha_nacmiento"
                  v-model="input.fecha_nacimiento"
                  input-class="form-control"
                  :format="'yyyy-MM-dd'"
                  :bootstrap-styling="true"
                  :language="es"
                  required
                ></datepicker>
              </div>
              <div class="form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <label>Télefono</label>
                <input
                  type="text"
                  v-model="input.telefono"
                  class="form-control"
                  placeholder="(52)"
                  required
                />
                
                <!--<label>Sexo<span class="text-danger">*</span></label>
                <select
                  v-model="input.cat_genero"
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
                </select>-->
              </div>

            </div>

            <div class="form-row">
              <div class="form-group col-6">
                <label>
                  Especialidad
                  <span class="text-danger">*</span>
                </label>
                <select
                  v-model="input.co_grupo"
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
             
            </div>
    
            <div class="form-row">
              <div class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
                 <div class="form-group col-6">
                <label>
                  F. de Inicio
                  <span class="text-danger">*</span>
                </label>
                <datepicker
                  name="fecha_inscripcion"
                  v-model="input.fecha_inicio"
                  input-class="form-control"
                  :bootstrap-styling="true"
                  :language="es"
                  required
                ></datepicker>
              </div>
              </div>
              <div class="form-group form-group col-sm-6 col-md-6 col-lg-6 col-xl-6">
                 <div class="form-group col-6">
                <label>
                  F. de Fin
                  <span class="text-danger">*</span>
                </label>
                <datepicker
                  name="fecha_inscripcion"
                  v-model="input.fecha_fin"
                  input-class="form-control"
                  :bootstrap-styling="true"
                  :language="es"
                  required
                ></datepicker>
              </div>
              </div>
            </div>
            <!--
            <label>
              Minutos de Gracia
              <span class="text-danger">*</span>
            </label>
            <input
              type="number"
              v-model="input.minutos_gracia"
              class="form-control"
              placeholder="Min. Gracia"
              min="0"
              required
            />-->
            <div class="form-row">
              <div class="form-group col-6">
                <label>
                  Colegiatura
                  <span class="text-danger">*</span>
                </label>
                <input
                  type="number"
                  v-model="input.costo_colegiatura"
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
                  v-model="input.costo_inscripcion"
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
                  v-model="input.fecha_limite_pago"
                  input-class="form-control"
                  :bootstrap-styling="true"
                  :language="es"
                  required
                ></datepicker>
              </div>
              <div class="form-group col-6">
              <label for="inputFechaLimitePago">Nota
              </label>
                  <textarea
                    rows="1"
                    v-model="input.nota"
                    class="form-control"
                    placeholder="Notas "
                  />
              </div>
            </div>
            
          </div>

          <div class="modal-footer">
            <div v-if="operacion == 'INSERT'">
              <button class="btn btn-lg btn-primary" :disabled="loader" v-on:click="guardar()">
                Guardar
              </button>
            </div>
            <div v-else-if="operacion == 'UPDATE'">
              <button class="btn btn-lg btn-primary" :disabled="loader" v-on:click="modificar()">
                Modificar
              </button>
            </div>
            <button
              type="button"
              class="btn btn-lg btn-secondary"
              data-dismiss="modal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
    <!-- </form>-->

    <!-- ELIMINAR MODAL -->
    <div
      id="modal_eliminar_alumno"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      data-keyboard="false"
      data-backdrop="static"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">
              Confirmar baja del alumno
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h4>
              <strong>{{ input.nombre }} {{ input.apellidos }}</strong>
            </h4>
            <div class="form-group text-left">
              <label for="fecha_baja">Fecha de baja</label>
              <datepicker
                name="fecha_baja"
                v-model="fechaBaja"
                input-class="form-control"
                :format="'yyyy-MM-dd'"
                :bootstrap-styling="true"
                :language="es"
              ></datepicker>
            </div>
            <div class="form-group">
              <textarea
                v-model="observacionesBaja"
                class="form-control"
                placeholder="Observaciones"
                rows="3"
              >
              </textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger"
              v-on:click="eliminar()"
              data-dismiss="modal"
            >
              Dar de Baja
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              data-dismiss="modal"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Buscar por nombre.."
            v-model="criterioNombre"
            v-on:keyup.enter="buscarPorNombre()"
            aria-label="Buscar por nombre.."            
          />
           <div class="input-group-append">
            <button
              class="btn btn-outline-secondary "
              type="button"
              v-on:click="buscarPorNombre()"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
        </div>

        <div v-if="loader" class="mx-auto">
            <Loader :loading="loader" :mini="true" />
        </div>

        <div class="row">                 
          <div
            class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-3 mt-2"
            v-for="row in lista"
            :key="row.id"            
          >
            <div class="card border-light">
              <div class="d-flex justify-content-end ">
                <div class="btn-group" role="group">
                  <button
                    id="btnGroupDrop1"
                    type="button"
                    class="btn btn-link btn-block btn-sm dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  ></button>
                  <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                    <button
                      class="dropdown-item"
                      @click="cambiarSucursal(row)"
                      href="#"
                    >
                      <i class="fas fa-exchange-alt"></i>Cambiar de sucursal
                    </button>
                    <button
                      class="dropdown-item"
                      @click="select(row, 'DELETE')"
                      href="#"
                    >
                      <i class="fas fa-user-minus"></i> Iniciar Baja
                    </button>
                  </div>
                </div>
              </div>

              <img
                class="card-img-top pointer rounded-circle mx-auto"
                style="width:100px"                
                :src="row.foto"
                alt="Foto"
                @click="verPerfil(row)"
                title="Cambiar la foto"
              />

              <div class="card-body pointer" @click="verPerfil(row)" >
                <h4 class="card-text">
                  {{ row.nombre }}
                  <span v-if="row.mostrar_nombre_carino"
                    >({{ row.nombre_carino }})</span
                  >
                  <span class="text-danger">{{ row.adeuda ? "*" : "" }}</span>
                </h4>
                <h5 class="card-text small">
                  {{ row.apellidos }}
                </h5>
                <h6
                  :style="row.color ? 'background-color:' + row.color : ''"
                  class="badge badge-info text-wrap"
                >
                  {{ row.nombre_grupo }}
                </h6>
                <h5><span>de</span> {{ row.hora_entrada }}</h5>
                <h5><span>a</span> {{ row.hora_salida }}</h5>
                <!--<div
                  class="btn-group"
                  role="group"
                  aria-label="Button group with nested dropdown"
                >
                  <button
                    type="button"
                    @click="verPerfil(row)"
                    class="btn btn-outline-primary btn-block btn-sm"
                  >
                    Ver Perfil
                  </button>
                </div>-->
              </div>
            </div>
          </div>

          

          <!-- Mensajes para la busqueda y carga-->
          <div v-if="criterioNombre != '' && lista.length == 0" class="mx-auto">
            <p class="text-muted ">Ningún resultado</p>
          </div>
          <div
            v-if="criterioNombre == '' && lista.length == 0 && !loader"
            class="mx-auto"
          >
            <p class="text-muted ">Oprime ENTER para listar todo</p>
          </div>
          <div v-if="loader" class="mx-auto">
            <Loader :loading="loader" :mini="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="../controller/CatAlumnoController.js"></script>

<style scoped></style>
