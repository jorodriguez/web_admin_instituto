<template>
  <span class="productos">
   <h1>Inventario</h1>   
   <small>{{usuarioSesion.nombre_sucursal}}</small> 
   <div class="row  mt-1 ">
      <div class="col col-12 col-md-6 col-sm-6 col-xl-6  d-flex align-items-start justify-content-start  text-left ">
        <div class="btn-group btn-group-lg" role="group" aria-label="...">
          <button  class="btn btn-primary " @click="iniciarNuevo()">
            <span class="fa fa-plus"/> Nuevo artículo
          </button>                    
        </div>
      </div>

      <div class="col col-12 col-md-6 col-sm-6 col-xl-6  d-flex align-items-end justify-content-end  text-left ">
      <div class="btn-group btn-group-lg" role="group" aria-label="...">
          <button  class="btn btn-outline-primary " >
            <span class="fa fa-plus"/> Movimiento
          </button>                              
      </div>

      <div class="dropdown btn-group-lg">
          <button class="btn btn-outline-primary  dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Catalogos
          </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">          
            <button class="btn btn-link dropdown-item" @click="iniciarNuevaCategoria()" >Categoria</button>
            <button class="btn btn-link dropdown-item" href="#">Marca</button>
            <button class="btn btn-link dropdown-item" href="#">Medidas</button>
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
            <span v-if="props.column.field == 'foto'">              
                  <img :src="`${props.row.foto}`" width="80" />
                  <p class="text-sm font-weight-bold text-primary"><strong>{{props.row.codigo}}</strong></p>
            </span>
            <span v-else-if="props.column.field == 'nombre'">                                
                  <p class="text-sm" >{{props.row.nombre}}</p>                                 
            </span>           

            <span v-else-if="props.column.field == 'precio'">                                
                  <p class="text-sm font-weight-bold" >${{props.row.precio}}</p>                                 
            </span>           

            <span v-else-if="props.column.field == 'costo_base'">                                
                  <p class="text-sm" >${{props.row.costo_base}}</p>                                 
            </span>           


            <span v-else-if="props.column.field == 'nota_interna'">                                
                  <textarea rows="3"  style="resize: none;" disabled v-model="props.row.nota_interna"></textarea>                  
            </span>           

            <span v-else-if="props.column.field == 'acciones'">   
              <div class="btn-group" role="group" aria-label="Basic example">                                      
                <button type="button" class="btn btn-link btn-sm text-danger">
                  <i class="fas fa-trash" title="Modificar" ></i>
                </button>                
                <button type="button" class="btn btn-link btn-sm text-primary">
                  <i class="fas fa-edit" title="eliminar"></i>
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
     <Popup id="popup_agregar" size="md" :show_button_close="true">
      <div slot="header">
        Agregar producto nuevo
      </div>    

      <div slot="content" class="text-left " >             
          
           <div class="form-group ">
            <label>Código <span class="text-danger">*</span></label>
             <input
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
                    class="form-control text-success"                    
                    v-model="articulo.precio"                    
                  />                       
        </div>        
           <div class="form-group col-md-6">
            <label>Costo <span class="text-danger">*</span></label>
                <input
                     type="number"
                     ref="input_costo_base"
                    class="form-control text-success"                    
                    v-model="articulo.costo_base"                    
                  />                     
        </div>        
            </div>

           <div class="form-row">             
           <div class="form-group col-md-6">
            <label>Existencia <span class="text-danger">*</span></label>
               <input
                     type="number"
                     ref="input_cantidad_existencia"
                    class="form-control text-success"                    
                    v-model="articulo.cantidad_existencia"                    
                  />                       
        </div>        
           <div class="form-group col-md-6">
            <label>Stock Mínimo <span class="text-danger">*</span></label>
                <input
                     type="number"
                     ref="input_stock_minimo"
                    class="form-control text-success"                    
                    v-model="articulo.stock_minimo"                    
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
          class="btn btn-primary"                                                   
           @click="guardar()" 
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
      <div slot="content" class="text-left " >                       
      
         <div class="form-inline">           
             <label>Nombre <span class="text-danger">*</span></label>
             <input
                    ref="input_nombre_categoria"
                    type="text"
                    class="form-control col-6"                    
                    v-model="nombreCategoria"                    
             />                                       
              <button class="btn btn-primary ">Agregar</button>                       
          </div>

         <vue-good-table
          :columns="columnasCatalogos"
          :rows="categorias"          
          :isLoading="loader"
          :line-numbers="false"        
          :search-options="TABLE_CONFIG.SEARCH_OPTIONS"
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
                  <!--<p class="text-sm" >{{props.row.categoria}}</p>                                 -->                                    
                  <ModificarCategoria :id="props.row.id" :nombre="props.row.nombre" />
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
import ModificarCategoria from "../fragmentos/catalogos/modificarCategoria.vue";
import Datepicker from 'vuejs-datepicker';


export default {
  name: "productos",
  components: {
    Popup,VueGoodTable, Datepicker,ModificarCategoria
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
      loaderGuardar:false,  
      articulo:CatArticuloSucursal,
      motivo:"",      
      htmlTicket:"",
      es: es,     
      lista:[],
      nombreCategoria:"",
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
        thClass: 'text-left',
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
        thClass: 'text-center',
        tdClass: 'text-center',
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
        thClass: 'text-center',
        tdClass: 'text-left text-sm',
        hidden: false
      },
       {
        label: 'marca',
        field: 'marca',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center text-sm',
        hidden: false
      },
      {
        label: 'Categoria',
        field: 'categoria',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center text-sm',
        hidden: false
      },
      {
        label: 'Unidad',
        field: 'unidad_medida',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center text-sm',
        hidden: false
      },
      {
        label: 'Cant. Exis.',
        field: 'cantidad_existencia',
        filterable: false,
        thClass: 'text-center',
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
        thClass: 'text-center',
        tdClass: 'text-center text-sm',
        hidden: false
      },
      {
        label: 'Costo',
        field: 'costo_base',
        filterable: false,
        thClass: 'text-center',
        tdClass: 'text-center text-sm',
        hidden: false
      },
      {
        label: 'Nota',
        field: 'nota_interna',
        filterable: false,
        thClass: 'text-center',
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
    this.TABLE_CONFIG.SEARCH_OPTIONS.enabled = false;
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
      },1000);

      //this.categoriaSeleccionada = {id:-1,categoria:"Todos"};
      this.loader = false;
    },       
    async cargarCatalogosAlta(){
        //this.categorias = await this.getAsync(`${URL.CATEGORIA_ARTICULO}/${this.usuarioSesion.id_empresa}`);
        this.categorias = await this.getAsync(`${URL.CATALOGO_CATEGORIA}/${this.usuarioSesion.id_empresa}`);
        this.marcas = await this.getAsync(`${URL.MARCA_ARTICULO}/${this.usuarioSesion.id_empresa}`);
        this.unidadMedidas = await this.getAsync(`${URL.UNIDAD_MEDIDA}/${this.usuarioSesion.id_empresa}`);
    },
    async iniciarNuevo(){
        this.articulo = new CatArticuloSucursal();
        
        await this.cargarCatalogosAlta();
        
        $("#popup_agregar").modal("show");
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

        const results =  await this.postAsync(`${URL.ARTICULO}`,data);

        if(results && results.error){              
          
          this.$notificacion.error(results.mensaje,"");
          
        }else{          
          $("#popup_agregar").modal("hide");
          await this.cargarCatalogo();
        }
        this.loaderGuardar=false;

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

      if(!this.articulo.cat_unidad_medida){
          this.$notificacion.warn("Seleccionar una Medida","");
          this.$refs.input_unidad.focus();          
          return false;
      }

      if(!this.articulo.precio){
          this.$notificacion.warn("Escribe el precio","");
          this.$refs.input_precio.focus();          
          return false;
      }
     
      if(!this.articulo.costo_base){
          this.$notificacion.warn("Escribe el costo","");
          this.$refs.input_costo_base.focus();          
          return false;
      }

      if(!this.articulo.cantidad_existencia){
          this.$notificacion.warn("Escribe la cantidad en existencia","");
          this.$refs.input_cantidad_existencia.focus();          
          return false;
      }

      if(!this.articulo.stock_minimo){
          this.$notificacion.warn("Escribe la cantidad en stock","");
          this.$refs.input_stock_minimo.focus();          
          return false;
      }

      return true;     

    },
    async iniciarNuevaCategoria(){
      this.categorias = await this.getAsync(`${URL.CATALOGO_CATEGORIA}/${this.usuarioSesion.id_empresa}`);
      $("#popup_categoria").modal("show");
    }
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
