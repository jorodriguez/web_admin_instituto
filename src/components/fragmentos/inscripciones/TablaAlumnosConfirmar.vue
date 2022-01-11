<template>
  <div class="row">
     <table class="table text-left">          
            <tr>
                <th></th>                
                <th>Alumno</th>
                <th>Teléfono</th>
                <th></th>
            </tr>
            <tbody 
              v-for="row in listaInscripciones"
              :key="row.id">
                <tr>                
                  <td style="width:40px">
                    <img
            :src="row.foto"
            class="rounded-circle bg-gray"
            width="30"
            height="30"
            style="cursor:pointer"
            title="Actualizar foto de perfil"
            @click="verPerfil(row)"
          />               
              
                     </td>
                  <td> <span class="pointer" @click="verPerfil(row)"> {{row.alumno}} {{row.apellidos}} </span></td>
                  <td class="font-weight-bold">{{row.telefono}}</td>
                  <td class="text-right" v-if="mostrar_acciones" >                  

                    <span v-if="row.confirmado" class="btn btn-link btn-sm">
                        <i class="fa fa-check-circle text-success "></i>                    
                        <span class="text-success pointer" @click="seleccionar(row,'DETALLE')"> Confirmado</span>                         
                        <!--<span @click="seleccionar(row,'NO_CONFIRMAR')" class="text-danger pointer" title="Quitar confirmación"><i class="fa fa-times "></i></span>  -->
                    </span>
                    <span v-else >
                      <button class="btn btn-success " @click="seleccionar(row,'CONFIRMAR')">
                        Confirmar
                      </button>                      
                    </span>
                    <span v-if="row.confirmado == false" class="btn btn-link btn-sm">
                        <i class="fa fa-times text-dark "></i>                    
                        <span class="text-dark pointer" @click="seleccionar(row,'DETALLE')">Cancelado</span>                                                 
                    </span>
                    <span v-else >
                    <button  class="btn btn-light" @click="seleccionar(row,'NO_CONFIRMAR')" >
                        Cancelar
                    </button>
                    </span>
                  </td>                  
                </tr>                
            </tbody>
          </table>            

    <!-- confirmar inscripcion -->
    <Popup  id="popup_confirmar_inscripcion" :show_button_close="true">
      <div slot="header">
          <span v-if="operacion == 'CONFIRMAR'">Confirmar inscripción</span> 
          <span v-if="operacion == 'NO_CONFIRMAR'" class="text-danger">Cancelar inscripción</span>
      </div>
      <div slot="content">
        <div class="row text-left">
          <table class="table">
            <tr>  

              <td>Alumno</td>            
              <td>
                <span class="font-weight-bold">{{ inscripcion.alumno }} {{inscripcion.apellidos}}</span>
                <span v-if="inscripcion.confirmado" class="text-success">
                  <i class="fa fa-check-circle text-success"></i>                    
                    Confirmado el {{inscripcion.fecha_confirmado}}
                 </span>                                         
              </td>
            </tr>
            <tr>  
              <td>Teléfono</td>            
              <td>
                <span class="font-weight-bold">{{ inscripcion.telefono }}</span>
              </td>
            </tr>
            <tr>  
              <td>Taller</td>            
              <td>
                <span class="font-weight-bold">{{ inscripcion.especialidad }}</span>
              </td>
            </tr>
            <tr>
              <td>Inicia</td>
              <td>
                <span class="font-weight-bold">
                  {{
                    inscripcion.fecha_inicio_format
                      ? inscripcion.fecha_inicio_format
                      : ` previsto ${inscripcion.fecha_inicio_previsto_format}`
                  }}
                </span>
              </td>
            </tr>
            <tr>
            <td>Dias</td>
              <td>
                <span class="font-weight-bold">{{ inscripcion.dias }}</span>
                -<span class="font-weight-bold">{{ inscripcion.horario }}</span>
              </td>
            </tr>
            <tr>           
            
            <tr>
              <td>Nota</td>
              <td>
                <textarea v-model="inscripcion.nota" class="form-control" rows="2">
                </textarea>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div slot="footer">
        <button v-if="operacion == 'CONFIRMAR'" class="btn btn-success"  @click="confirmarInscripcion(true)">Confirmar</button>
        <button v-if="operacion == 'NO_CONFIRMAR'" class="btn btn-dark" @click="confirmarInscripcion(false)">Cancelar inscripción</button>
      </div>
    </Popup>

     <!-- detalle de confirmación -->
    <Popup  id="popup_detalle" :show_button_close="true">
      <div slot="header">
          Detalle de incripción
      </div>
      <div slot="content">
        <div class="row text-left">
          <table class="table">
            <tr>  
              <td colspan="2">
                <span v-if="inscripcion.confirmado" class="text-success h3 ">
                  <i class="fa fa-check-circle text-success "></i>                    
                       Inscripción Confirmada
                 </span>                                         
                 <span v-if="inscripcion.confirmado == false" class="text-danger h3">
                  <i class="fa fa-check-circle text-danger"></i>                    
                       Inscripción Cancelada
                 </span>                                                                                
                 <p class="text-sm text-muted">por {{inscripcion.usuario_confirmo}} el <strong>{{inscripcion.fecha_confirmado}}</strong></p>
              </td>
            </tr>
            <tr>  
              <td>Alumno</td>            
              <td>
                <span class="font-weight-bold">{{ inscripcion.inscripcion }} {{inscripcion.apellidos}}</span>                
              </td>
            </tr>            
            <tr>  
              <td>Teléfono</td>            
              <td>
                <span class="font-weight-bold">{{ inscripcion.telefono }}</span>
              </td>
            </tr>
            <tr>  
              <td>Taller</td>            
              <td>
                <span class="font-weight-bold">{{ inscripcion.especialidad }}</span>
              </td>
            </tr>
            <tr>
              <td>Inicia</td>
              <td>
                <span class="font-weight-bold">
                  {{
                    inscripcion.fecha_inicio_format
                      ? inscripcion.fecha_inicio_format
                      : ` previsto ${inscripcion.fecha_inicio_previsto_format}`
                  }}
                </span>
              </td>
            </tr>
            <tr>
            <td>Dias</td>
              <td>
                <span class="font-weight-bold">{{ inscripcion.dias }}</span>
                -<span class="font-weight-bold">{{ inscripcion.horario }}</span>
              </td>
            </tr>
            <tr>           
            
            <tr>
              <td>Nota</td>
              <td>
                <textarea v-model="inscripcion.nota" class="form-control" rows="2" disabled>
                </textarea>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div slot="footer">        
        
      </div>
    </Popup>
  </div>
</template>
              

<script>
import { operacionesApi } from "../../../helpers/OperacionesApi";
import { getUsuarioSesion } from "../../../helpers/Sesion";
import AlumnoModel from "../../../models/AlumnoModel";
import URL from "../../../helpers/Urls";
import { en, es } from "vuejs-datepicker/dist/locale";
import moment from "moment";
import Popup from "../../../controller/Popup";

export default {
  name: "tabla-inscripcion-confirmar-inscripcion",
  components: {
    Popup
  },
  mixins: [operacionesApi],
  props:["listaInscripciones","reload","mostrar_acciones"],
  data() {
    return {
      uidCurso: "",
      usuarioSesion: {},            
      operacion:"",
      inscripcion:{id:0,nota:''},
      es: es,
      loader: false      
    };
  },
  mounted() {
    console.log("##### INCIAR TABLA ALUMNOS CONFIRMACION  ####");
    this.usuarioSesion = getUsuarioSesion();        
    //this.init();
  },

  methods: {
    seleccionar(row,operacion){
        console.log("iniciar confirmacion");
        this.inscripcion =  Object.assign({},row);
        this.operacion = operacion;        
        this.inscripcion.nota = '';
        console.log(JSON.stringify(this.inscripcion));
        if(operacion == 'DETALLE'){
          $("#popup_detalle").modal("show");        
        }else{
            $("#popup_confirmar_inscripcion").modal("show");        
        }
    },
     verPerfil(rowSelect) {
      console.log("fila seleccionada " + rowSelect.uid);
      this.$router.push({ name: "PerfilAlumno", params: { uid: rowSelect.uid } });
    },
    async confirmarInscripcion(confirmacion) {
      console.log("@confirmarInscripcion "+confirmacion+" inscripcion "+this.inscripcion.id_inscripcion);

      this.loader = true;
      const values ={
          confirmacion:confirmacion,
          nota:this.inscripcion.nota,
          genero:this.usuarioSesion.id
      };  

      const respuesta = await this.putAsync(`${URL.INSCRIPCION_BASE}/confirmar/${this.inscripcion.id_inscripcion}`, values);
      
      if (respuesta) {
        this.$notificacion.info(`Inscripción confirmada`,`${this.inscripcion.alumno} ${this.inscripcion.apellidos} fué confirmado para el taller ${this.inscripcion.especialidad} `);
        
        $("#popup_confirmar_inscripcion").modal("hide");        

        await this.reload();
                 
        //this.$root.$emit(Emit.ACTUALIZAR_ALUMNO, Emit.ACTUALIZAR_ALUMNO);
      } else {
        this.$notificacion.error("Ups!","Algo sucedió al intentar confirmar la inscripción, ponte en contacto con soporte técnico.");  
      }
      this.loader = false;
    },
  },
};
</script>

<style scoped></style>
