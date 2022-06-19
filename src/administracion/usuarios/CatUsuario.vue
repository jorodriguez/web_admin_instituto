<template>
  <div class="catalogo_alumno">
    <h1>Personal ({{ contador }})</h1>
    <small>{{ usuarioSesion.nombre_sucursal }}</small>
    <div class="row">
      <div class="col-1">
        <router-link to="/Administracion" class="btn btn-secondary btn-lg">
          <i class="fas fa-arrow-circle-left text-gray"></i>
        </router-link>
      </div>
      <div class="col-1">
        <!--<button type="button" class="btn btn-primary btn-lg" v-on:click="nuevo()">Nuevo</button>-->
        <PopupNuevoUsuario :metodo_refrescar="init"></PopupNuevoUsuario>
      </div>

    </div>
    <Loader :loading="loader" />
    <br />

    <div class="card">
      <div class="card-body">

        <div class="table-responsive">
          <div>
            <table class="table align-items-center">
              <thead class="thead-light">
                <tr>
                  <th scope="col" class="sort" data-sort="name">Nombre</th>
                  <th scope="col" class="sort" data-sort="budget">Hora Entra</th>
                  <th scope="col" class="sort" data-sort="status">Hora Sale</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody class="list">
                <tr v-for="row in listaUsuario" :key="row.id">
                  <th scope="row">
                    <div class="media text-left">
                      <a href="#" class="avatar rounded-circle mr-3">
                      </a>
                      <div class="media-body">
                        <span class="name mb-0 text-sm">
                          {{ row.nombre }} <span v-if="row.alias"><strong>{{ row.alias }}</strong></span>
                          <span v-if="row.nuevo_ingreso" class="badge  badge-pill badge-warning">Nuevo</span>
                          <p class="small"><i>{{ row.correo }}</i></p>
                          <p class="small"><i>{{ row.correo_copia }}</i></p>
                          <p class="small"><i>{{ row.tipo_usuario }}</i></p>
                          <p class="small" v-if="row.acceso_sistema">accesa al sistema </p>
                          
                            <span  class="small pl-1" v-for="rol in row.roles" :key="rol.si_usuario_sucursal_rol">                            
                              <span class="badge badge-pill badge-primary">{{rol.rol}}</span>
                            </span>
                        </span>
                      </div>
                    </div>
                  </th>
                  <td class="budget">
                    {{ row.hora_entrada }}
                  </td>
                  <td>
                    <span class="badge badge-dot mr-4">
                      {{ row.hora_salida }}
                    </span>
                  </td>
                  <td class="text-right">
                    <PopupOperacionesUsuario :usuario_value="row" :metodo_refrescar="init" />
                    <!--<div class="dropdown">
                        <a class="btn btn-sm btn-icon-only text-light" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i class="fas fa-ellipsis-v"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right dropdown-menu-arrow">
                            <a class="dropdown-item" href="#">Action</a>
                            <a class="dropdown-item" href="#">Another action</a>
                            <a class="dropdown-item" href="#">Something else here</a>
                        </div>
                    </div>-->
                  </td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>



<!--
        <vue-good-table :columns="columnasUsuario" :rows="listaUsuario" :line-numbers="false"
          :search-options="TABLE_CONFIG.SEARCH_OPTIONS" :pagination-options="TABLE_CONFIG.PAGINATION_OPTIONS"
          :selectOptions="TABLE_CONFIG.NO_SELECT_OPTIONS" :groupOptions="{ enabled: false }">
          <template slot="table-row" slot-scope="props">
            <span v-if="props.column.field == 'nombre'">
              <span><strong>{{ props.row.alias }}</strong></span><br />
              <span class="small"> {{ props.row.nombre }} <span v-if="props.row.nuevo_ingreso"
                  class="badge  badge-pill badge-warning">Nuevo</span>
              </span><br />
              <span class="small"><i>{{ props.row.correo }}</i></span>
            </span>
            <span v-else-if="props.column.field == 'botones'">
              <PopupOperacionesUsuario :usuario_value="props.row" :metodo_refrescar="init" />
            </span>
            <span v-else>{{ props.formattedRow[props.column.field] }}</span>
          </template>
        </vue-good-table>
        -->
      </div>
    </div>
  </div>
</template>

<script src="../../controller/CatUsuarioController.js" >
</script>

<style scoped>
</style>
