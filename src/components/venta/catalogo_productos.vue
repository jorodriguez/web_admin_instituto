<template>
  <span class="productos">
   <h1>Catalogo de Productos</h1>   
   <small>{{usuarioSesion.nombre_sucursal}}</small> 
   <div class="row  mt-1 ">
      <div class="col col-12 col-md-6 col-sm-6 col-xl-6  d-flex align-items-start justify-content-start  text-left ">
        <div class="btn-group btn-group-lg" role="group" aria-label="...">
          <button  class="btn btn-primary " @click="iniciarNuevo()" :disabled="loaderNuevo">            
             <span v-if="loaderNuevo" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
             <span v-else class="fa fa-plus"/>
             Nuevo artículo 
          </button>                    
        </div>
      </div>

      <div class="col col-12 col-md-6 col-sm-6 col-xl-6  d-flex align-items-end justify-content-end  text-left ">
      <!--<div class="btn-group btn-group-lg" role="group" aria-label="...">
          <button  class="btn btn-outline-primary " >
            <span class="fa fa-plus"/> Movimiento
          </button>                              
      </div>-->

      <div class="dropdown btn-group-lg">
          <button class="btn btn-outline-primary  dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Catalogos
          </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">          
            <button class="btn btn-link dropdown-item" @click="iniciarNuevaCategoria()" >Categoria</button>
            <button class="btn btn-link dropdown-item" @click="iniciarNuevaMarca()">Marca</button>
            <button class="btn btn-link dropdown-item" @click="iniciarNuevaUnidadMedida()">Medidas</button>
        </div>
      </div>
        
      </div>
   </div>  
    <div class="card ">
      <div class="card-body pl-0 pr-0 ">             
        <vue-good-table
          :columns="columnas"
          :rows="lista"          
          :isLoading="loader"
          :line-numbers="true"        
          :search-options="TABLE_CONFIG.SEARCH_OPTIONS"
          :pagination-options="TABLE_CONFIG.PAGINATION_OPTIONS"          
          :selectOptions="TABLE_CONFIG.NO_SELECT_OPTIONS"          
          class="table-striped text-sm"                    
          :groupOptions="{
  	          enabled: false,               
          }"
        >
        <div slot="emptystate">
              Sin productos para mostrar
        </div>
        <template slot="loadingContent">         
              <div  class="spinner-border text-info" role="status"/>                                
        </template>
          <template slot="table-header-row" slot-scope="props">
                <span class="font-weight-bold text-info h5">{{ props.row.label }}</span>                
          </template>

          <template slot="table-row" slot-scope="props">            
            <span v-if="props.column.field == 'foto'">              
                  <img :src="`${props.row.foto}`" width="80" />
                  <p class="text-sm font-weight-bold text-primary"><strong>{{props.row.codigo}}</strong></p>
            </span>
            <span v-else-if="props.column.field == 'nombre'">                                
                  <p class="text-sm" :disabled="loaderModificar" @click="iniciarModificacion(props.row)" >                  
                  {{props.row.nombre}}
                  <span v-if="props.row.es_nuevo" class="badge badge-warning">Nuevo</span>               
                  </p>                                 
                  
            </span>           

            <span v-else-if="props.column.field == 'cantidad_existencia'">                                
                  <p :class="`text-sm font-weight-bold  pointer ${props.row.cantidad_existencia <= 0 ? 'text-danger ':'text-primary'}`" 
                            @click="iniciarAjusteInventario(props.row)" >
                      <i v-if="props.row.cantidad_existencia <= 0 " class=" fa fa-exclamation-triangle"/>                          
                      {{props.row.cantidad_existencia}}
                  </p>                                                 
                      
            </span>           

            <span v-else-if="props.column.field == 'precio'">                                
                  <p class="text-sm font-weight-bold text-primary pointer" @click="iniciarAjusteInventario(props.row)" >${{props.row.precio}}</p>                                 
            </span>           

            <span v-else-if="props.column.field == 'costo_base'">                                
                  <p class="text-sm " >${{props.row.costo_base}}</p>                                 
            </span>           


            <span v-else-if="props.column.field == 'nota_interna'">                                
                  <!--<textarea rows="3"  style="resize: none;" disabled v-model="props.row.nota_interna"></textarea>                  -->
                  <button type="button" :class="`btn btn-link ${props.row.nota_interna ? 'text-blue':'text-gray' }`" @click="verDetalleArticulo(props.row)" :title="props.row.nota_interna">
                        <i :class="props.row.nota_interna ? 'fas fa-file':'file-text-o'"/>
                  </button>
            </span>           

            <span v-else-if="props.column.field == 'acciones'">   
              <div class="btn-group" role="group" aria-label="Basic example">                                      
                <button type="button" :disabled="loaderEliminar" @click="iniciarEliminacion(props.row)"  class="btn btn-link btn-sm text-danger">                  
                  <i class="fas fa-trash" title="Eliminar" ></i>
                </button>                
                <button type="button" :disabled="loaderModificar" @click="iniciarModificacion(props.row)" class="btn btn-link btn-sm text-primary">
                  <!--<span v-if="loaderModificar" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>-->
                  <i class="fas fa-edit" title="Modificar"></i>
                </button>                
            </div>
            </span>                                           
            <span v-else>
                  <span  >{{props.formattedRow[props.column.field]}}</span>                  
            </span>
          </template>
        </vue-good-table>
           
      </div>    
    </div>  

    <!-- popup para agregar producto -->
     <Popup id="popup_producto" size="md" :show_button_close="true">
      <div slot="header">
        Agregar producto nuevo
      </div>    

      <div slot="content" class="text-left " >             
          
           <div class="form-group" >
            <label>Código <span class="text-danger">*</span></label>
             <input
                    :disabled="(operacion == 'MODIFICAR')"
                    ref="input_codigo"
                    type="text"
                    class="form-control font-weight-bold"                    
                    v-model="articulo.codigo"                    
                  />
           </div>                    

        <div class="form-row">             
           <div class="form-group col-8">
            <label>Artículo <span class="text-danger">*</span></label>
             <input
                    type="text"
                    ref="input_articulo"
                    class="form-control"                    
                    v-model="articulo.nombre"                    
                  />
           </div>              
        
           <div class="form-group col-4">
            <label>Medida <span class="text-danger">*</span></label>
              <select
                v-model="articulo.cat_unidad_medida"
                class="form-control"
                ref="input_medida"
                placeholder="Medida"                                
              >
              <option
                v-for="unidadMedida in unidadMedidas"
                v-bind:value="unidadMedida.id"
                v-bind:key="unidadMedida.id"
              >{{ unidadMedida.nombre }}</option>
            </select>                        
        </div> 
        </div>

            <div class="form-group ">
              <label>Descripción</label>
              <textarea cols="2" v-model="articulo.descripcion" class="form-control form-control-sm" />
            </div>
                 
          
          <div class="form-row">     
        
           <div class="form-group col-md-6">
            <label>Marca <span class="text-danger">*</span></label>
              <select
                v-model="articulo.cat_marca"
                class="form-control"
                ref="input_marca"
                placeholder="Marca"                                
              >
              <option
                v-for="marcaItem in marcas"
                v-bind:value="marcaItem.id"
                v-bind:key="marcaItem.id"
              >{{ marcaItem.nombre }}</option>
            </select>                        
        </div>        
           <div class="form-group col-md-6">
            <label>Categoría <span class="text-danger">*</span></label>
              <select
                v-model="articulo.cat_categoria"
                class="form-control"
                ref="input_categoria"
                placeholder="Categoria"              
              >
              <option
                v-for="categoriaItem in categorias"
                v-bind:value="categoriaItem.id"
                v-bind:key="categoriaItem.id"
              >{{ categoriaItem.nombre }}</option>
            </select>                        
        </div>        
            </div>

        <div class="form-row">             
           <div class="form-group col-md-6">
            <label>Precio <span class="text-danger">*</span></label>
               <input
                     type="number"                     
                     ref="input_precio"
                    class="form-control "                    
                    v-model="articulo.precio"                    
                    min="0"                 
                  />                       
        </div>        
           <div class="form-group col-md-6">
            <label>Costo <span class="text-danger">*</span></label>
                <input
                     type="number"                     
                     ref="input_costo_base"
                     class="form-control "                    
                     v-model="articulo.costo_base"   
                     min="-1"                 
                  />                     
        </div>        
            </div>

           <div class="form-row">             
           <div class="form-group col-md-6">
            <label>Existencia <span class="text-danger">*</span></label>
               <input
                     type="number"
                     :disabled="(operacion == 'MODIFICAR')"
                     ref="input_cantidad_existencia"
                      :class="`form-control ${articulo.cantidad_existencia <= 0 ? 'text-danger':''}`"                    
                      v-model="articulo.cantidad_existencia"                    
                      min="0"
                  />                       
        </div>        
           <div class="form-group col-md-6">
            <label>Stock Mínimo <span class="text-danger">*</span></label>
                <input
                     type="number"
                     ref="input_stock_minimo"
                    class="form-control "                    
                    v-model="articulo.stock_minimo"         
                    min="-1"           
                  />                     
        </div>        
            </div>

            <div class="form-group ">
              <label>Nota</label>
              <textarea cols="2" v-model="articulo.nota_interna" class="form-control form-control-sm" />              
            </div>

      </div>
      <div slot="footer">
        <button
          v-if="(operacion=='INSERTAR')"
          class="btn btn-primary"                                                   
           @click="guardar()" 
           :disabled="loaderGuardar"
        >
          <div v-if="loaderGuardar" class="spinner-border spinner-border-sm" role="status"/> Guardar
        </button>

        <button
          v-if="(operacion=='MODIFICAR')"
          class="btn btn-primary"                                                   
           @click="guardar()" 
           :disabled="loaderGuardar"
        >
          <div v-if="loaderGuardar" class="spinner-border spinner-border-sm" role="status"/> Guardar
        </button>
      </div>
    </Popup> 

    <!-- catalogo de categoria -->    
     <Popup id="popup_categoria" size="md" :show_button_close="true">
      <div slot="header">
       Catalogo de Categorias
      </div>    
      <div slot="content" class="text-left" >                       
        
         <div class="form-inline pb-1">           
             <label>Categoria <span class="text-danger">*</span></label>
             <input                    
                    type="text"
                    class="form-control  "        
                    placeholder="Escribe el nombre"            
                    v-model="nombre"                    
             />                                       
              <button class="btn btn-primary " @click="guardarCategoria()">Agregar</button>                       
          </div>
      
         <vue-good-table
          :columns="columnasCatalogos"
          :rows="categorias"          
          :isLoading="loader"
          :line-numbers="false"        
          :search-options="{enabled:false}"
          :pagination-options="TABLE_CONFIG.PAGINATION_OPTIONS"          
          :selectOptions="TABLE_CONFIG.NO_SELECT_OPTIONS"               
          
           styleClass="vgt-table condensed"
          :groupOptions="{
  	          enabled: false,               
          }"
        >
        <template slot="loadingContent">              
              <div  class="spinner-border text-info" role="status"/>                                
        </template>
          <template slot="table-header-row" slot-scope="props">
                <span class="font-weight-bold text-info h5">{{ props.row.label }}</span>                
          </template>

          <template slot="table-row" slot-scope="props">                        
            <span v-if="props.column.field == 'nombre'">                                
                  <!--<p class="text-sm" >{{props.row.categoria}}</p>                                 -->                                    
                  <ModificarCatalogo :id="props.row.id" :nombre="props.row.nombre" :url_catalogo="URL.CATALOGO_CATEGORIA"  />
            </span>           

            <!--<span v-else-if="props.column.field == 'acciones'">   
              <div class="btn-group" role="group" aria-label="Basic example">                                      
                <button type="button" class="btn btn-link btn-sm text-danger">
                  <i class="fas fa-trash" title="Eliminar" ></i>
                </button>                                
            </div>
            </span>                                           
            -->
            <span v-else>
                  <span  >{{props.formattedRow[props.column.field]}}</span>                  
            </span>
          </template>
        </vue-good-table>                   
           
      </div>
      <div slot="footer">
        
      </div>
    </Popup> 


    <!-- CATALOGO MARCAS -->    
     <Popup id="popup_marca" size="md" :show_button_close="true">
      <div slot="header">
       Catalogo de Marcas
      </div>    
      <div slot="content" class="text-left" >                       
        
         <div class="form-inline pb-1">           
             <label>Marca <span class="text-danger">*</span></label>
             <input                    
                    type="text"
                    class="form-control  "        
                    placeholder="Escribe el nombre"            
                    v-model="nombre"                    
             />                                       
              <button class="btn btn-primary " @click="guardarMarca()">Agregar</button>                       
          </div>
      
         <vue-good-table
          :columns="columnasCatalogos"
          :rows="marcas"          
          :isLoading="loader"
          :line-numbers="false"        
          :search-options="{enabled:false}"
          :pagination-options="TABLE_CONFIG.PAGINATION_OPTIONS"          
          :selectOptions="TABLE_CONFIG.NO_SELECT_OPTIONS"            
          class="table-striped"
          :groupOptions="{
  	          enabled: false,               
          }"
        >
        <template slot="loadingContent">              
              <div  class="spinner-border text-info" role="status"/>                                
        </template>
          <template slot="table-header-row" slot-scope="props">
                <span class="font-weight-bold text-info h5">{{ props.row.label }}</span>                
          </template>

          <template slot="table-row" slot-scope="props">                        
            <span v-if="props.column.field == 'nombre'">                                                  
                  <ModificarCatalogo :id="props.row.id" :nombre="props.row.nombre" :url_catalogo="URL.CATALOGO_MARCA"  />
            </span>                       
            <span v-else>
                  <span  >{{props.formattedRow[props.column.field]}}</span>                  
            </span>
          </template>
        </vue-good-table>                   
           
      </div>
      <div slot="footer">
        
      </div>
    </Popup> 
    <!-- FIN CATALOGO-MARCAS-->

    <!-- UNIDAD MEDIDA -->
    <Popup id="popup_unidad_medida" size="md" :show_button_close="true">
      <div slot="header">
       Catalogo de Unidades de medida
      </div>    
      <div slot="content" class="text-left" >                       
        
         <div class="form-inline pb-1">           
             <label>Unidad Medida <span class="text-danger">*</span></label>
             <input                    
                    type="text"
                    class="form-control  "        
                    placeholder="Escribe el nombre"            
                    v-model="nombre"                    
             />                                       
              <button class="btn btn-primary " @click="guardarUnidadMedida()">Agregar</button>                       
          </div>
      
         <vue-good-table
          :columns="columnasCatalogos"
          :rows="unidadMedidas"          
          :isLoading="loader"
          :line-numbers="false"        
          :search-options="{enabled:false}"
          :pagination-options="TABLE_CONFIG.PAGINATION_OPTIONS"          
          :selectOptions="TABLE_CONFIG.NO_SELECT_OPTIONS"          
          class="table-striped"
          :groupOptions="{
  	          enabled: false,               
          }"
        >
        <template slot="loadingContent">              
              <div  class="spinner-border text-info" role="status"/>                                
        </template>
          <template slot="table-header-row" slot-scope="props">
                <span class="font-weight-bold text-info h5">{{ props.row.label }}</span>                
          </template>

          <template slot="table-row" slot-scope="props">                        
            <span v-if="props.column.field == 'nombre'">                                                  
                  <ModificarCatalogo :id="props.row.id" :nombre="props.row.nombre" :url_catalogo="URL.CATALOGO_UNIDAD_MEDIDA"  />
            </span>                       
            <span v-else>
                  <span  >{{props.formattedRow[props.column.field]}}</span>                  
            </span>
          </template>
        </vue-good-table>                   
           
      </div>
      <div slot="footer">
        
      </div>
    </Popup> 
    <!-- FIN UNIDAD MEDIDA-->

  <!-- VER COMENTANTARIOS DE PRODUCTO -->
    <Popup id="popup_comentario_producto" size="sm" :show_button_close="true">
      <div slot="header">
       Nota de producto
      </div>    
      <div slot="content" class="text-left" >                                                 
           <div v-if="articulo" class="row ">
           <div class="media">
                <img :src="`${articulo.foto}`" width="80" class="m-1" />
                <div class="media-body">
                  <h4 class="mt-0">{{articulo.codigo}}</h4>
                  <p>{{articulo.nombre}}</p>
              </div>
          </div>              
           </div>
           <div v-if="articulo" class="row">
                <span class="text-gray">Descripción</span>
                <textarea v-model="articulo.descripcion" rows="2" class="form-control" disabled/>
                <span class="text-gray">Nota</span>
                <textarea v-model="articulo.nota_interna" rows="2" class="form-control" disabled/>
           </div>
      </div>
      <div slot="footer">
        
      </div>
    </Popup> 
    <!-- FIN VER COMENTANTARIOS DE PRODUCTO-->

    <!-- ELIMINAR PRODUCTO -->
    <Popup id="popup_eliminar" size="sm" :show_button_close="true">
      <div slot="header">
       Eliminar Articulo
      </div>    
      <div slot="content" class="text-left" >                                                 
           <div v-if="articulo" class="row ">
           <div class="media">
                <img :src="`${articulo.foto}`" width="80" class="m-1" />
                <div class="media-body">
                  <h4 class="mt-0">{{articulo.codigo}}</h4>
                  <p>{{articulo.nombre}}</p>
              </div>
          </div>              
           </div>
           <div v-if="articulo" class="row">
                <span class="text-gray">Descripción</span>
                <textarea v-model="articulo.descripcion" rows="2" class="form-control" disabled/>
                <span class="text-gray">Nota</span>
                <textarea v-model="articulo.nota_interna" rows="2" class="form-control" disabled/>
           </div>
           <div v-if="articulo" class="row text-center">
            <p >¿Esta seguro de eliminar el producto seleccionado?</p>
           </div>
      </div>
      <div slot="footer">
         <button          
          class="btn btn-danger"                                                   
           @click="eliminar()" 
           :disabled="loaderEliminar"
         >
          <div v-if="loaderEliminar" class="spinner-border spinner-border-sm" role="status"/> Eliminar
        </button>
      </div>
    </Popup> 
    <!-- FIN VER COMENTANTARIOS DE PRODUCTO-->


       <!-- ajuste de existencia -->
    <Popup id="popup_ajuste_existencia" size="sm" :show_button_close="true">
      <div slot="header">
       Ajuste libre de existencia
      </div>    
      <div slot="content" class="text-left" >                                                 
           <div v-if="articulo" class="row ">
           <div class="media">
                <img :src="`${articulo.foto}`" width="80" class="m-1" />
                <div class="media-body">
                  <h3>{{articulo.nombre}}</h3>
                  <small class="mt-0">{{articulo.codigo}}</small>                  
              </div>
           </div>              
           </div>           
           <hr/>
           <div v-if="articulo" class="row">
              <!-- ajustar precio existenca costo -->
         
           <!--<div class="form-group col-md-6">
            <label>Precio <span class="text-danger">*</span></label>
               <input
                     type="number"                     
                     ref="input_precio_ajuste"
                     class="form-control "                    
                     v-model="articulo.precio"                    
                     min="0"
                  />                       
           </div>        -->
           <div class="form-group col-md-12">            
            <label>Nueva Existencia <span class="text-danger">*</span></label>
               <input
                     type="number"                     
                     ref="input_cantidad_existencia_ajuste"
                     :class="`form-control ${articulo.cantidad_existencia <= 0 ? 'text-danger':''}`"                    
                     class="form-control "                    
                     v-model="articulo.cantidad_existencia"                    
                     min="-1"
                  />                       
            </div>        
              <!-- FIN - ajustar precio existencia costo-->           

           </div>
           <div class="form-group ">
              <label>Nota</label>
              <textarea cols="2" v-model="nota" class="form-control form-control-sm" />              
            </div>
      </div>
      <div slot="footer">
         <button          
          class="btn btn-success"                                                              
           :disabled="loaderAjuste"
           @click="guardarMovimiento()"
         >
          <div v-if="loaderAjuste" class="spinner-border spinner-border-sm" role="status"/> Confirmar
        </button>
      </div>
    </Popup> 
    <!-- FIN VER COMENTANTARIOS DE PRODUCTO-->
  </span>
</template>

<script>
import Vue from "vue";
import { operacionesApi } from "../../helpers/OperacionesApi";
import { formatPrice } from "../../helpers/Utils";
import { getUsuarioSesion } from "../../helpers/Sesion";
import CatArticuloSucursal from "../../models/CatArticuloSucursal";
import URL from "../../helpers/Urls";
import { en, es } from "vuejs-datepicker/dist/locale";
import moment from "moment";
import Popup from "../../controller/Popup";
import TABLE_CONFIG from "../../helpers/DatatableConfig";
import { VueGoodTable } from 'vue-good-table';
import ModificarCatalogo from "../fragmentos/catalogos/modificarCatalogo.vue";
import Datepicker from 'vuejs-datepicker';


export default {
  name: "productos",
  components: {
    Popup,VueGoodTable, Datepicker,ModificarCatalogo
  },
  mixins: [operacionesApi],  
    data() {
    return {
      uidCurso: "",
      usuarioSesion: {},
      operacion: "",
      TABLE_CONFIG:TABLE_CONFIG,      
      loaderConfirmacion:false,
      loader:false,  
      loaderNuevo:false,  
      URL,
      loaderGuardar:false,  
      loaderModificar:false,  
      loaderEliminar:false,  
      loaderAjuste:false,  
      articulo:CatArticuloSucursal,
      articuloMemento:CatArticuloSucursal,
      motivo:"",      
      nota:"",      
      htmlTicket:"",
      es: es,           
      lista:[],
      nombre:"",
      categorias:[],
      marcas:[],
      unidadMedidas:[],
      columnasCatalogos:[
      {
        label: 'Id',
        field: 'id',
        hidden: true
      },
      {
        label: 'Nombre',
        field: 'nombre',
        filterable: false,
        thClass: 'text-left ',
        tdClass: 'text-left',
        hidden: false
      },      
      ],
      columnas:[
      {
        label: 'Id',
        field: 'id',
        hidden: true
      },
      {
        label: 'Foto',
        field: 'foto',
        filterable: false,
        thClass: 'text-center text-sm',
        tdClass: 'text-left text-sm',
        hidden: false
      },      
      /*{
        label: 'Código',
        field: 'codigo',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center text-sm',
        hidden: false
      },*/      
      {
        label: 'Artículo',
        field: 'nombre',
        filterable: false,
        thClass: 'text-center text-sm',
        tdClass: 'text-lefy text-sm',
        hidden: false
      },
       {
        label: 'marca',
        field: 'marca',
        filterable: false,
        thClass: 'text-center text-sm',
        tdClass: 'text-center text-sm',
        hidden: false
      },
      {
        label: 'Categoria',
        field: 'categoria',
        filterable: false,
        thClass: 'text-center text-sm',
        tdClass: 'text-center text-sm',
        hidden: false
      },
      {
        label: 'Unidad',
        field: 'unidad_medida',
        filterable: false,
        thClass: 'text-center text-sm',
        tdClass: 'text-center text-sm',
        hidden: false
      },
      {
        label: 'Cant. Exis.',
        field: 'cantidad_existencia',
        filterable: false,
        thClass: 'text-center text-sm',
        tdClass: 'text-center text-sm',
        hidden: false
      },      
      /*{
        label: 'Stock Min.',
        field: 'stock_minimo',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center text-sm',
        hidden: false
      },*/     
      {
        label: 'Precio',
        field: 'precio',
        filterable: false,
        thClass: 'text-center text-sm',
        tdClass: 'text-center text-sm',
        hidden: false
      },
      {
        label: 'Costo',
        field: 'costo_base',
        filterable: false,
        thClass: 'text-center text-sm',
        tdClass: 'text-center text-sm',
        hidden: false
      },
      {
        label: 'Nota',
        field: 'nota_interna',
        filterable: false,
        thClass: 'text-center text-sm',
        tdClass: 'text-left text-sm',
        hidden: false
      },                  
      {
        label: '',
        field: 'acciones',
        filterable: true,
        thClass: 'text-center',
        tdClass: 'text-left',
        hidden:false
      },
     
      ],
      mensajeCodigo:"",
    };
  },
  mounted() {
    console.log("##### INCIAR LISTA DE PRODUCTOS ####");
    this.usuarioSesion = getUsuarioSesion();        
    this.TABLE_CONFIG.PAGINATION_OPTIONS.perPage = 5;
    //this.TABLE_CONFIG_CATALOGO.SEARCH_OPTIONS.enabled = false;
    this.init();    
  },
  methods: {
    async init() {        
        await this.cargarCatalogo();
    },            
    async cargarCatalogo() {
      this.loader = true;
      console.log("@c@@@@argarCatalogo");            
      setTimeout(async()=>{        
        this.lista = await this.getAsync(`${URL.ARTICULO}/sucursal/${this.usuarioSesion.co_sucursal}`);
        this.loader = false;
      },1000);
            
    },
    seleccionarArticulo(row,operacion){
        this.articulo =  Object.assign(new CatArticuloSucursal(),row);        
        this.articuloMemento =  Object.assign(new CatArticuloSucursal(),row);        
        this.operacion = operacion;
    },          
    async iniciarModificacion(row){
        this.seleccionarArticulo(row,'MODIFICAR');
        this.loaderModificar = true;
         await this.cargarCatalogosAlta(); 
        this.loaderModificar = false;
        $("#popup_producto").modal("show");        
    },          
    async iniciarAjusteInventario(row){
        this.seleccionarArticulo(row,'AJUSTE_INVENTARIO');
        this.loaderAjuste = true;
        this.nota = "";
         await this.cargarCatalogosAlta(); 
        this.loaderAjuste = false;
        $("#popup_ajuste_existencia").modal("show");        
    },              
    iniciarEliminacion(row){
        this.seleccionarArticulo(row,'ELIMINAR');                 
         $("#popup_eliminar").modal("show");        
    },
    verDetalleArticulo(row){
        this.seleccionarArticulo(row,'DETALLE');
        $("#popup_comentario_producto").modal("show");
    },          

    async cargarCatalogosAlta(){        
        await this.cargarCategorias();        
        await this.cargarMarcas();                
        await this.cargarUnidadMedida();
    },
    async iniciarNuevo(){
        this.articulo = new CatArticuloSucursal();
        this.loaderNuevo = true;        
        await this.cargarCatalogosAlta();
        this.loaderNuevo = false;
        this.operacion = 'INSERTAR';
        $("#popup_producto").modal("show");
    },
    async guardar(){
        if(!this.validacion()){
           return; 
        }

        this.loaderGuardar=true;

        const data = this.articulo
                      .setGenero(this.usuarioSesion.id)
                      .setCoEmpresa(this.usuarioSesion.id_empresa)
                      .setCoSucursal(this.usuarioSesion.co_sucursal)
                      .buildForInsert();

        const results = this.operacion == 'INSERTAR' ?
                        await this.postAsync(`${URL.ARTICULO}`,data) 
                        :
                        await this.putAsync(`${URL.ARTICULO}/${this.articulo.id}`,data);

        if(results && results.error){              
          
          this.$notificacion.error(results.mensaje,"");
          
        }else{          
          $("#popup_producto").modal("hide");
            await this.cargarCatalogo();
        }
        this.loaderGuardar=false;

    },
    async eliminar(){
        this.loaderEliminar=true;

        const data = this.articulo
                      .setModifico(this.usuarioSesion.id)                                            
                      .setGenero(this.usuarioSesion.id)                                            
                      .buildForInsert();

        const results = await this.patchAsync(`${URL.ARTICULO}/${this.articulo.id}`,data);

        if(results && results.error){              
          
          this.$notificacion.error(results.mensaje,"");
          
        }else{          
          $("#popup_eliminar").modal("hide");
            await this.cargarCatalogo();
        }
        this.loaderEliminar=false;

    },
    validacion(){

      if(!this.articulo.codigo){
          this.$notificacion.warn("Escribe un código","");
          this.$refs.input_codigo.focus();          
          return false;
      }

      if(!this.articulo.nombre){
          this.$notificacion.warn("Escribe el nombre ","");
          this.$refs.input_articulo.focus();          
          return false;
      }

      if(!this.articulo.cat_unidad_medida){
          this.$notificacion.warn("Seleccionar una Medida","");
          this.$refs.input_unidad.focus();          
          return false;
      }

      if(!this.articulo.cat_marca){
          this.$notificacion.warn("Seleccionar una Marca","");
          this.$refs.input_marca.focus();          
          return false;
      }

      if(!this.articulo.cat_categoria){
          this.$notificacion.warn("Seleccionar una Categoria","");
          this.$refs.input_categoria.focus();          
          return false;
      }
      

      if(!this.articulo.precio || this.articulo.precio <= 0){
          this.$notificacion.warn("Escribe el precio","");
          this.$refs.input_precio.focus();          
          return false;
      }
     
      if(!this.articulo.costo_base || this.articulo.costo_base < 0 ){
          this.$notificacion.warn("Escribe el costo","");
          this.$refs.input_costo_base.focus();          
          return false;
      }

      if(!this.articulo.cantidad_existencia || this.articulo.cantidad_existencia <= 0){
          this.$notificacion.warn("Escribe la cantidad en existencia","");
          this.$refs.input_cantidad_existencia.focus();          
          return false;
      }

      if(!this.articulo.stock_minimo || this.articulo.stock_minimo <= 0){
          this.$notificacion.warn("Escribe la cantidad en stock","");
          this.$refs.input_stock_minimo.focus();          
          return false;
      }

      return true;     

    },
    validarNombre(){
      if(!this.nombre){
          this.$notificacion.warn("Escribe el nombre","");          
          return false;
      }
      return true;
    },
    async cargarCategorias(){
      this.categorias = await this.getAsync(`${URL.CATALOGO_CATEGORIA}/${this.usuarioSesion.id_empresa}`);      
    },
    async iniciarNuevaCategoria(){
      await this.cargarCategorias();
      $("#popup_categoria").modal("show");
    },
    async guardarCategoria(){
      if(this.validarNombre()){       
        const res = await this.postAsync(`${URL.CATALOGO_CATEGORIA}`,{nombre:this.nombre,co_empresa:this.usuarioSesion.id_empresa,genero:this.usuarioSesion.id});
        if(res){            
            await this.cargarCategorias();
            this.nombre="";
        }
      }
    },
    async cargarMarcas(){
      this.marcas = await this.getAsync(`${URL.CATALOGO_MARCA}/${this.usuarioSesion.id_empresa}`);      
    },
    async iniciarNuevaMarca(){
      await this.cargarMarcas();
      $("#popup_marca").modal("show");
    },
    async guardarMarca(){
      if(this.validarNombre()){       
        const res = await this.postAsync(`${URL.CATALOGO_MARCA}`,{nombre:this.nombre,co_empresa:this.usuarioSesion.id_empresa,genero:this.usuarioSesion.id});
        if(res){            
            await this.cargarMarcas();
            this.nombre="";
        }
      }
    },
    async cargarUnidadMedida(){
      this.unidadMedidas = await this.getAsync(`${URL.CATALOGO_UNIDAD_MEDIDA}/${this.usuarioSesion.id_empresa}`);
    },  
   async iniciarNuevaUnidadMedida(){
      await this.cargarUnidadMedida();
      $("#popup_unidad_medida").modal("show");
    },
    async guardarUnidadMedida(){
      if(this.validarNombre()){       
        const res = await this.postAsync(`${URL.CATALOGO_UNIDAD_MEDIDA}`,{nombre:this.nombre,co_empresa:this.usuarioSesion.id_empresa,genero:this.usuarioSesion.id});
        if(res){            
            await this.cargarUnidadMedida();
            this.nombre="";
        }
      }
    },
    tdClassMarcarNuevoModificado(row) {
      if (row.es_nuevo) {
          return 'text-left text-sm border border-primary';
        }
        return 'text-left text-sm';
      },
    async guardarMovimiento(){

       if(!this.articulo.cantidad_existencia){
          this.$notificacion.warn("Escribe la cantidad de existencia","");
          this.$refs.input_cantidad_existencia_ajuste.focus();          
          return false;
      }

      /*if(!this.articulo.precio){
          this.$notificacion.warn("Escribe el precio","");
          this.$refs.input_precio_ajuste.focus();          
          return false;
      }*/

      /*if(this.articulo.cantidad_existencia == this.articuloMemento.cantidad_existencia &&
           this.articulo.precio == this.articuloMemento.precio ){*/
      if(this.articulo.cantidad_existencia == this.articuloMemento.cantidad_existencia){
           this.$notificacion.warn("No se han detectado cambios","");

          return false;
      }

      const AJUSTE_LIBRE = 5;

      const send= {
        id_articulo_sucursal:this.articulo.id,
        cat_tipo_movimiento:AJUSTE_LIBRE,
        existencia_nueva:this.articulo.cantidad_existencia,
        //precio_nuevo:this.articulo.precio,
        nota:this.nota,
        co_empresa:this.usuarioSesion.id_empresa,
        co_sucursal:this.usuarioSesion.co_sucursal,        
        genero:this.usuarioSesion.id
      }
      const res = await this.postAsync(`${URL.MOVIMIENTO_INVENTARIO}`,send);
        if(res){            
              await this.cargarCatalogo();
              $("#popup_ajuste_existencia").modal("hide");
              
        }
         
    },    
    
  }
};

</script>

<style scoped>
.scroll-thead {
  width: 100%;
  display: inline-table;
}

.scroll-tbody-y {
  display: block;
  overflow-y: scroll;
}

.table-body {
  height: 500px /*fix height here*/;
}

.scroll {
  height: 500px;
  overflow-y: scroll;
}
</style>
