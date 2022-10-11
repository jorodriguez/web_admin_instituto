<template>
  <div class="row">
     <table class="table table-sm text-left">          
            <tr>
                <th></th>                
                <th>Matricula/Alumno</th>                
                <th>Teléfono</th>                
                <th>Inscripción</th>                
                <th></th>
            </tr>
            <tbody 
              v-for="row in listaInscripciones"
              :key="row.id">
                <tr>                
                  <td style="width:40px">
                    <img
            :src="row.foto"
            class="rounded-circle "
            width="40"
            height="40"
            style="cursor:pointer"
            title="Actualizar foto de perfil"
            @click="verPerfil(row)"
          />               
              
                     </td>
                  <td>                   
                    <span class="pointer " @click="verPerfil(row)"> 
                      {{row.matricula}} 
                    </span>                                            
                    <p class="pointer text-sm " @click="verPerfil(row)"> 
                      {{row.alumno}} {{row.apellidos}} 
                    </p>                                            
                  </td>
                  <td class="font-weight-normal">{{row.telefono}}</td>
                  <!--<td class="font-weight-normal">{{row.direccion}}</td>-->
                  <td>
                      <small class="text-gray small ">{{row.inscribio ? row.inscribio:'-'}} </small>                      
                      <p class="text-gray small">{{row.fecha_inscripcion_format}} </p>                      
                      <small class="text-gray small text-wrap" style="width: 10rem;">{{row.nota_inscripcion}}</small>
                  </td>

                  <td class="text-right ">                     
                    <slot :alumnoRow="row" />
                    <slot name="acciones">                    
                        
                    </slot> 
                  </td>                  
                </tr>                
            </tbody>
          </table>            

        
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
  name: "tabla-alumnos",
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
    console.log("##### INCIAR TABLA ALUMNOS  ####");
    this.usuarioSesion = getUsuarioSesion();        
    //this.init();
  },

  methods: {    
     verPerfil(rowSelect) {
      console.log("fila seleccionada " + rowSelect.uid);
      this.$router.push({ name: "PerfilAlumno", params: { uid: rowSelect.uid } });
    },    
  },
};
</script>

<style scoped></style>
