/* eslint-disable vue/no-parsing-error */
/* eslint-disable vue/valid-v-bind */
<template>
  <div id="id_tabla_cargos">
    <div class="row">
      <div class="col">
        <div class="btn-group">
          <button
            type="button"
            class="btn btn-success"
            title="Agregar un nuevo cargo al alumno"
            v-on:click="iniciarAgregarCargo()"
          >
           <i class="fa fa-plus"></i> Agregar Cargo
          </button>
          <button
            type="button"
            v-on:click="iniciarEliminacionCargo()"
            class="btn btn-danger"
            title="Selecciona uno o varios cargos para eliminarlos"            
          >
            <i class="fa fa-minus"></i> Eliminar Cargo
          </button>
        </div>
      </div>
      <div class="col d-flex justify-content-end">
        <div class="btn-group">
          <button
            type="button"
            v-on:click="iniciarAgregarPago()"
            class="btn btn-success"
            title="Seleccionar uno o varios cargos y efectura su pago"
          >
            <i class="fa fa-dollar-sign"></i> Efectuar Pago
          </button>
        </div>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table">
        <thead>
          <th>
            <!--<div class="custom-control custom-checkbox">-->
            <input
              type="checkbox"
              id="checkboxSeleccionarTodo"
              v-model="seleccionTodos"
              v-on:change="seleccionarTodoPagos()"
            />
            <!--</div>-->
          </th>          
          <th>Concepto</th>
          <th>Fecha</th>
          <th>Monto</th>
          <th>Abono</th>
          <!--<th>Desc.</th>-->
          <th>Saldo</th>
          <!--<th>Nota</th>-->
          <th></th>
        </thead>
        <tbody v-for="row in listaCargosAlumnos" :key="row.id">
          <tr>
            <td >
              <input
                type="checkbox"
                id="checkbox"
                v-model="row.checked"
                v-if="!row.pagado"
              />
              <i v-else class="text-primary font-weight-normal">¡Pagado!</i>
            </td>            
            <td>
              <a
                v-on:click="verDetalleCargo(row)"
                class="btn-link text-primary font-weight-normal"
                style="cursor: pointer;"
              >
                <span v-if="!row.pagado" class="font-weight-bold"
                  >{{ row.cantidad > 1 ? row.cantidad : "" }}
                  {{ row.nombre_cargo }}{{ row.cantidad > 1 ? "s" : "" }}                  
                  <span v-if="row.cat_esquema_pago == 1">
                    {{ row.numero_semana_curso != null ? `Semana ${row.numero_semana_curso}` : "" }}
                  </span>
                  <span v-if="row.cat_esquema_pago == 2">
                    {{ row.texto_ayuda != null ? row.texto_ayuda : "" }}                  
                  </span>                  
                </span>
                
                <span v-else-if="row.pagado" class="font-weight-bold tachado"
                  >{{ row.cantidad > 1 ? row.cantidad : "" }}
                  {{ row.nombre_cargo }}
                  <span v-if="row.cat_esquema_pago == 1">
                    {{`${row.numero_semana_curso ? 'Semana '+ row.numero_semana_curso :''}`}}                  
                  </span>
                  <span v-if="row.cat_esquema_pago == 2">
                    {{ row.texto_ayuda != null ? row.texto_ayuda : "" }}                  
                  </span>                  
                </span>
               
                <span class="small ">
                  <div class="text-wrap" style="width: 10rem;">
                    {{row.especialidad != null ? row.especialidad :"" }} 
                    <!--{{ row.materia_modulo != null ? row.materia_modulo:'' }}-->
                  </div>
                </span>
                <span class="small text-muted">
                  <div class="text-wrap" style="width: 10rem;">
                    {{ row.nota }}
                  </div>
                </span>
              </a>
            </td>
            <td>
              <span :class="`font-weight-normal ${row.pagado ? 'text-gray':''}`">{{ row.fecha_format }}</span>
            </td>
            <td> <!-- monto -->
               <strong>
                <span :class="`font-weight-normal ${row.pagado ? 'text-gray':''}`"
                  >${{ row.cargo }}</span
                >
              </strong>
            </td>   
             <td><!-- abonos -->
              <strong>
                <span :class="`font-weight-normal ${row.pagado ? 'text-gray':''} `"
                  >${{ row.total_pagado }}</span
                >
              </strong>
            </td>         
            <td>
              <strong>
                <span class="font-weight-bold text-danger"
                  >${{ row.total }}</span
                >
              </strong>
            </td>
            <!--
            <td>
              <strong>
                <span class="font-weight-bold text-">${{ row.descuento }}</span
                ><br />
                <span class="text-orange">{{
                  row.descuento_aplicado ? "(" + row.nombre_descuento + ")" : ""
                }}</span>
              </strong>
            </td>
            -->
           
            <!--
          <td>
            <div class="text-wrap" style="width: 15rem;">{{row.nota}}</div>
          </td>
          -->
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-center">
      <div v-if="loaderCargos" class="spinner-border text-info" role="status">
        <span class="sr-only"></span>
      </div>
    </div>

    <button
      class="btn  btn-link  border btn-block"
      :disabled="loaderCargos"
      @click="cargarTodosCargos()"
    >
      Ver todos los cargos
    </button>

    <Popup id="modal_cargo" size="md" show_button_close="true">
      <div slot="header">
        Agregar Cargo para {{ alumno ? alumno.nombre : "" }}
      </div>
      <div slot="content">
  
        <div class="form-group">
          <label for="selectTipoCargo">
            Cargo
            <span class="text-danger">*</span>
          </label>
          <select
            v-model="cargo.cat_cargo"
            class="form-control"
            placeholder="Cargo"
            @change="onChangeCargo()"
            required
            autofocus
          >
            <option
              id="selectCargo"
              v-for="p in listaCargos"
              v-bind:value="p"
              v-bind:key="p.id"
              >{{ p.nombre }}</option
            >
          </select>
        </div>

        <div
          class="form-group"
          v-if="cargo.cat_cargo.id == 1 
            || cargo.cat_cargo.id == 2"
        >
          <label for="inputMensualidadCargo">
            Curso 
            <span class="text-danger">*</span>
          </label>
          <select
            v-model="cargo.co_curso"
            class="form-control"
            placeholder="Cursos"
            @change="onChangeCurso()"
          >
            <option
              id="selectCurso"
              v-for="c in listaCursosAlumno"
              v-bind:value="c"
              v-bind:key="c.id_curso"             
            >
              {{c.especialidad}} - {{c.horario}}
            </option>
          </select>
        </div>


        <div
          class="form-group"
          v-if="cargo.cat_cargo.id == 1 && cargo.co_curso.cat_esquema_pago == 1"
        >
          <label for="inputSemanaCurso">
            Colegiatura Semana
            <span class="text-danger">*</span>
          </label>
          <select
            v-model="cargo.id_curso_semanas"
            class="form-control"
            placeholder="Cursos"            
          >
            <option
              id="selectCurso"
              v-for="semana in listaSemanasCurso"
              v-bind:value="semana.id"
              v-bind:key="semana.id"             
              :disabled="semana.tiene_cargo"
            >
             Semama-{{semana.numero_semana_curso}} / {{semana.fecha_clase_format}}
            </option>
          </select>          
        </div>


        <div
          class="form-group"
          v-if="cargo.cat_cargo.id == 1 && cargo.co_curso.cat_esquema_pago == 2"
        >
          <label for="inputMesesCurso">
            Colegiatura del mes
            <span class="text-danger">*</span>
          </label>
          <select
            v-model="cargo.mes"
            class="form-control"
            placeholder="Mensualidad"            
          >
            <option
              id="selectMesCurso"
              v-for="mes in listaMesesAdeuda"
              v-bind:value="mes"
              v-bind:key="mes.fecha_mes"             
              :disabled="mes.cargo_registrado"
            >
             {{mes.nombre_mes_anio}} 
            </option>
          </select>          
        </div>

         

        <div
          class="form-group"
          v-if="cargo.cat_cargo.id != -1 && cargo.cat_cargo.escribir_cantidad"
        >
          <label for="inputCargo">
            Cantidad
            <span class="text-danger">*</span>
          </label>
          <input
            id="inputCargo"
            type="number"
            v-model="cargo.cantidad"
            class="form-control"
            placeholder="Cantidad"
            min="1"
            max="999"
            @change="calcularTotalCargo()"
            maxlength="3"
          />
        </div>

        <div class="form-group" v-if="cargo.cat_cargo.id != -1">
          <label for="inputMonto">
            Monto $
            <span class="text-danger">*</span>
          </label>
          <input
            id="inputMonto"
            type="number"
            v-model="cargo.monto"
            class="form-control"
            :disabled="!cargo.cat_cargo.escribir_monto"
            placeholder="Monto"
            min="1"
            @change="calcularTotalCargo()"
            maxlength="6"
          />
        </div>
        <div class="form-group">
          <label for="inputNota">Nota</label>
          <input
            id="inputNota"
            type="text"
            v-model="cargo.nota"
            class="form-control"
            placeholder="Escriba una nota"
          />
        </div>
      </div>
      <div slot="footer">
        <button class="btn btn-lg btn-primary" v-on:click="guardarCargo()">
          Guardar
        </button>
      </div>
    </Popup>

    <!-- PAGO -->
    <Popup id="modal_pago" size="lg" :show_button_close="false">
      <div slot="header">Efectuar Pago</div>
      <div slot="content">
        <label for="selectFormaPago">
          Forma de Pago
          <span class="text-danger">*</span>
        </label>
        <select
          v-model="pago.cat_forma_pago"
          class="form-control"
          placeholder="Forma pago"
          required
        >
          <option
            id="selectFormaPago"
            v-for="p in listaFormasPago"
            v-bind:value="p"
            v-bind:key="p.id"
            >{{ p.nombre }} - ({{ p.descripcion }})</option
          >
        </select>

       <div
          class="form-row"
          v-if="
            pago.cat_forma_pago.permite_factura &&
              existen_montos_facturables &&
              escribir_folio_factura
          "
        >
          <span v-if="!requiere_factura" class="text-danger"
            >* No estan activos los datos de facturación, vaya a la pestaña
            facturación para habilitarlos ó escribirlos.</span
          >
          <div class="col-md-6" v-if="requiere_factura">
            <label for="inputIdentificadorFactura">Folio de factura</label>
            <input
              id="inputIdentificadorFactura"
              type="text"
              v-model="pago.identificador_factura"
              class="form-control font-weight-bold text-primary"
              placeholder="Folio de factura"
            />
          </div>
        </div>
        <div class="form-row">
          <div class="col-md-2" v-if="pago.cat_forma_pago.escribir_numero_pago">
            <label for="inputIdentificadorPago">Ident</label>
            <input
              id="inputIdentificadorPago"
              type="text"
              v-model="pago.identificador_pago"
              class="form-control"
              :placeholder="'No. ' + pago.cat_forma_pago.nombre"
            />
          </div>
          <div
            :class="
              pago.cat_forma_pago.escribir_numero_pago
                ? 'col-md-10'
                : 'col-md-12'
            "
          >
            <label for="inputNotaPago">Nota</label>
            <input
              id="inputNotaPago"
              type="text"
              v-model="pago.nota_pago"
              class="form-control"
              placeholder="Escribir nota "
            />
          </div>
        </div>

        <table class="table">
          <thead>
            <th>Concepto</th>
            <th>Cargo</th>
            <!--<th>Adeuda</th>-->
            <!--<th>Descuento</th>-->
            <th>Pago Recibido</th>
            <th>Importe</th>
          </thead>
          <tbody v-for="row in listaCargosAlumnosSeleccionados" :key="row.id">
            <tr
              v-if="row.checked"
              :class="row.es_facturable ? 'bg-info text-white' : ''"
            >
              <td style="width:25%">
                <span class="h4"
                  >{{ row.nombre_cargo }}  
                  {{ row.numero_semana_curso != null ? `Semana ${row.numero_semana_curso}` : "" }}
                  {{ row.texto_ayuda ? row.texto_ayuda  : '' }}
                </span>
                 <span class="small ">
                  <div class="text-wrap" style="width: 10rem;">
                    {{row.especialidad != null ? row.especialidad :"" }}                     
                  </div>
                </span>
              </td>
              <td>
                <strong>
                  <span class="h3 font-weight-bold">${{ row.cargo }}</span>
                </strong>
              </td>
              <!--
              <td style="width:15%">
                <select
                  v-model="row.cat_descuento"
                  class="form-control h3 font-weight-bold"
                  placeholder="Descuento"
                  @change="reacalcularTotalDescuento(row)"
                  v-if="!row.descuento_aplicado && row.aplica_descuento"
                  :disabled="row.total_pagado > 0"
                >
                  <option
                    id="noOptionDescuento"
                    v-bind:value="noOptionDescuento"
                  >
                    <span class="h3 font-weight-bold">{{
                      noOptionDescuento.nombre
                    }}</span>
                  </option>
                  <option
                    id="selectDescuento"
                    v-for="d in listaDescuentos"
                    v-bind:value="d"
                    v-bind:key="d.id"
                  >
                    <span class="h3 font-weight-bold">{{ d.nombre }}</span>
                  </option>
                </select>
                <h3 v-if="row.descuento_aplicado">
                  {{ row.nombre_descuento }}
                </h3>
              </td>
              -->
              <td style="width:20%">
                <input
                  id="inputAbono"
                  type="number"
                  @change="reacalcularTotales"
                  v-model="row.pago"
                  class="form-control font-weight-bold"
                  placeholder="Pago"
                  required
                />
                <span v-if="row.total_pagado > 0">
                  pagado : ${{ row.total_pagado }}</span
                >
              </td>
              <td>
                <strong>
                  <span class="h3 font-weight-bold text-danger"
                    >${{ row.total }}</span
                  >
                </strong>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="row float-right p-3 mb-2 text-dark">
          <table>
            <tr>
              <td>
                <strong>Cargos :</strong>
              </td>
              <td class="text-danger">
                <strong>${{ formatPrice(total_cargos) }}</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Desc.</strong>
              </td>
              <td>
                <strong>{{
                  pago.descuento_total != 0
                    ? "$-" + formatPrice(pago.descuento_total)
                    : ""
                }}</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Pago :</strong>
              </td>
              <td>
                <strong>${{ formatPrice(pago.pago_total) }}</strong>
              </td>
            </tr>
            <tr>
              <td>
                <h2>
                  <strong>Adeuda :</strong>
                </h2>
              </td>
              <td class="text-danger">
                <!--<strong>${{total_cargos - pago.pago_total }}</strong>-->
                <strong
                  >${{
                    formatPrice(
                      total_cargos - (pago.descuento_total + pago.pago_total)
                    )
                  }}</strong
                >
                <!--<strong>${{total_adeuda}}</strong>                -->
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div slot="footer">
        <!-- <button type="button" 
                class="btn btn-lg btn-secondary" 
                data-dismiss="modal">Cerrar</button>-->
        <button
          type="button"
          class="btn btn-lg btn-secondary"
          @click="cancelarEfectuarPago()"
        >
          Cerrar
        </button>
        <button class="btn btn-lg btn-primary" :disabled="loaderGuardarPago"  v-on:click="guardarPago()">
          <div class="spinner-border spinner-border-sm" v-if="loaderGuardarPago"  role="status"/> Pagar
        </button>
      </div>
    </Popup>

    <Popup id="modal_detalle_cargo" size="lg" show_button_close="true">
      <div slot="header">Detalle del cargo</div>
      <div slot="content">
        <table class="table">
          <thead>            
            <th>Cargo</th>
            <th>Fecha</th>
            <!--<th>Descuento</th>-->
            <th>Pagado</th>
            <th>Total Adeuda</th>            
          </thead>
          <tbody>
            <tr>              
              <td style="width:25%;">
                <span v-if="!cargoSeleccionado.pagado" class="font-weight-bold text-primary">
                  {{
                    cargoSeleccionado.cantidad > 1
                      ? cargoSeleccionado.cantidad
                      : ""
                  }}
                  {{ cargoSeleccionado.nombre_cargo
                  }}{{ cargoSeleccionado.cantidad > 1 ? "s" : "" }}
                   <span v-if="cargoSeleccionado.cat_esquema_pago == 1">
                    {{`${cargoSeleccionado.numero_semana_curso ? 'Semana '+ row.numero_semana_curso :''}`}}                  
                  </span>
                  <span v-if="cargoSeleccionado.cat_esquema_pago == 2">
                    {{ cargoSeleccionado.texto_ayuda != null ? cargoSeleccionado.texto_ayuda : "" }}                  
                  </span> 
                  <!--{{cargoSeleccionado.numero_semana_curso != null ? `Semana ${cargoSeleccionado.numero_semana_curso}` : "" }}-->
                </span>
                <span
                  v-else-if="cargoSeleccionado.pagado"
                  class="tachado font-weight-bold text-primary"
                  >{{
                    cargoSeleccionado.cantidad > 1
                      ? cargoSeleccionado.cantidad
                      : ""
                  }}
                  {{ cargoSeleccionado.nombre_cargo }}
                  {{cargoSeleccionado.numero_semana_curso != null ? `Semana ${cargoSeleccionado.numero_semana_curso}` : "" }}
                </span>
                 <span :class="`small text-primary ${cargoSeleccionado.pagado ? 'tachado':''} `">
                  <div class="text-wrap" style="width: 10rem;">
                    {{cargoSeleccionado.especialidad != null ? cargoSeleccionado.especialidad :"" }}                     
                  </div>
                </span>
                <div class="text-wrap" style="width: 10rem;">
                  <small :class="cargoSeleccionado.pagado ? 'tachado' : ''">{{
                    cargoSeleccionado.nota
                  }}</small>
                </div>
              </td>
              <td>{{ cargoSeleccionado.fecha_format }}</td>
              <!--<td>
                <label class="font-weight-bold h3"
                  >${{ cargoSeleccionado.descuento }} <br />
                  <span class="h4 text-orange"
                    >{{
                      cargoSeleccionado.descuento_aplicado
                        ? "(" + cargoSeleccionado.nombre_descuento + ")"
                        : ""
                    }}
                  </span></label
                >
              </td>-->             
              <td>
                <label class="font-weight-bold text-success h3"
                  >${{ cargoSeleccionado.total_pagado }}</label
                >
                <i
                  v-if="cargoSeleccionado.pagado"
                  class="fas fa-check-circle text-success"
                ></i>
                <i v-else class="fas fa-check-circle text-gray"></i>
              </td>
               <td>
                <label class="font-weight-bold text-danger h3"
                  >${{ cargoSeleccionado.total }}</label
                >
              </td>
            </tr>
          </tbody>
        </table>
        <div class="text-center">
          <h4>Pagos Realizados</h4>
        </div>
        <div class="row">
          <div class="table-responsive">
          <table class="table">
            <thead>
              <th>Folio</th>              
              <th>Fecha</th>              
              <th>Pago</th>
              <th>Forma de Pago</th>
              <!--<th>Factura</th>
              <th>Ident.</th>-->
              <th>Nota</th>
              <th>Actions</th>
            </thead>
            <tbody v-for="row in listaPagosCargo" :key="row.id">
              <tr>
                <td>
                  <label class="font-weight-bold"
                    >{{ row.folio }}
                  </label>                  
                </td>                
                <td>                                    
                  <small>{{ row.fecha_format }}</small>
                </td>                
                <td>
                  <label class="font-weight-bold text-success"
                    >${{ row.pago }}</label
                  >
                </td>
                <td>
                  <label class="font-weight-bold text-info">{{
                    row.nombre_forma_pago
                  }}</label>
                </td>
                <!--<td>{{ row.identificador_factura }}</td>
                <td>{{ row.identificador_pago }}</td>-->
                <td>
                  <div class="text-wrap" style="width: 4rem;">
                    {{ row.nota }}
                  </div>
                </td>
                <td>
                  <!--<ReenviarComprobantePago
                    :id_alumno="idalumno"
                    :id_pago="row.id_pago"
                  />-->
                  <!--<ImprimirPago :idPago="row.id_pago"/>-->                                     
                   <!--<router-link :to="{path:'ReciboPago', params:{id_pago:row.id_pago}}"   class="btn btn-link ">
                        Imprimir
                    </router-link>    -->
                  <a class="text-primary pointer pr-1" @click="imprimirPago(row.id_pago)" title="Imprimir" > <i class="fas fa-print"></i> </a>                  
                  <a class="text-primary pointer pl-1" v-if="alumno.correo" @click="reenviarCompronatePago(row.id_pago)" title="Enviar por correo">
                      <i class="fas fa-envelope"></i>                      
                      <span v-if="loaderEnvioComprobante" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  </a>                     
                  <span v-else class="text-muted" title="No tiene correo registrado"><i class="fas fa-envelope "></i>   </span>
                  
                </td>
              </tr>
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </Popup>

    <!-- ELIMINAR CARGO -->
    <Popup id="eliminarCargoAlumno" show_button_close="true">
      <div slot="header">Eliminar cargo</div>
      <div slot="content">
        <div class="row">
          <div class="container">
            <label>
              Motivo
              <span class="text-danger">*</span>
            </label>
            <textarea
              v-model="motivo_eliminacion"
              class="form-control"
              required
            ></textarea>
          </div>
        </div>
      </div>
      <div slot="footer">
        <button v-on:click="confirmarEliminacion()" class="btn btn-danger">
          Eliminar
        </button>
      </div>
    </Popup>
    <!-- ELIMINAR CARGO -->
  </div>
</template>

<script src="../controller/CargosPagosController.js"></script>

<style scoped>
.tachado {
  text-decoration: line-through;
}
</style>
