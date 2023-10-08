<template>
  <div class="cat_alumno">
    <PopupPagoPendiente/>
    <h1>Alumnos ({{lista ? lista.length:0}}) </h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>
    <div class="row">
      <div class="col-auto mr-auto">
        <router-link to="/principal" class="btn btn-secondary btn-lg">
          <i class="fas fa-arrow-circle-left text-gray"></i>
        </router-link>
        <router-link to="/Inscripcion" class="btn btn-primary btn-lg">
          Nueva Inscripción
        </router-link>               
        
      </div>
      <div class="col-auto">
       <!--<button @click="carg<arInscripcionesBaja()">Alumnos en baja</button>-->
      </div>
    </div>

    <br />
    
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
        <!-- filtro-->
        
        <div v-if="loader" class="mx-auto">
            <Loader :loading="loader" :mini="true" />
        </div>

<!-- class="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3 mt-2"-->
        <div class="row">                 
          <div
            class="col-12 col-sm-6 col-md-6 col-lg-2 col-xl-2 mt-2 p-1"
            v-for="row in lista"
            :key="row.id"            
          >
            <div class="card border-light  " style="min-height: 244px;">            
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
                      @click="select(row, 'DELETE')"
                      href="#"
                    >
                      <i class="fas fa-user-minus text-red"></i> Iniciar Baja
                    </button>                    
                    <button
                      class="dropdown-item"
                      @click="select(row, 'FOTO')"
                      href="#"
                    >
                      <i class="fas fa-camera text-gray"></i> Actualizar foto
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
                title="Ver perfil"
              />

              <div class="card-body p-1 pointer" @click="verPerfil(row)" >
                <p class="card-text text-sm font-weight-bold col-12 text-truncate mb-0 " 
                      :title="`${row.alumno} ${row.apellidos}`">                  
                  {{ row.alumno }}                                    
                </p>
                <small class="card-text pt-0 small" :title="`${row.alumno} ${row.apellidos}`">
                  <div class="col-12 text-truncate">
                  {{ row.apellidos }}
                  </div>
                </small>
                <div class="card-item small">
                  <small
                  :style="row.color_especialidad ? 'background-color:' + row.color_especialidad : ''"
                  class="badge badge-info text-wrap "
                >
                  {{ row.especialidad }}
                </small>                                                    
                </div>                
                <p class="font-weight-normal small m-0">{{row.dia}} {{ row.horario }}</p>                
              </div>
               <div class="card-footer p-0 text-muted d-flex justify-content-start">
                    <small style="font-size:10px"><i class="fa fa-user-check text-gray pl-1"></i></small>
                    <small style="font-size:10px" class="text-gray col-12 text-truncate">                      
                        INSCRIBIÓ {{row.inscribio ? row.inscribio:'-'}} 
                    </small>
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
