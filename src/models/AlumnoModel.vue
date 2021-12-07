import Vue from 'vue';
import FormatoModel from './FormatoModel';

var Alumno = new Vue({
    data : {
        id: 0,        
        padre:{},
        madre:{},        
        co_sucursal:-1,
        co_curso:-1,
        nombre: "",
        adeuda:false,        
        apellidos: "",
        nombre_carino:"",
        direccion:"",
        mostrar_nombre_carino:false,        
        cat_genero:-1,       
        nombre_curso:"",
        nombre_sucursal:"",
        fecha_nacimiento: null,        
        nota: "",
        hora_entrada: "",
        hora_salida: "",
        costo_inscripcion: "",
        costo_colegiatura: "",        
        minutos_gracia: 0,   
        cat_especialidad:-1,     
        fecha_reinscripcion: null,
        fecha_inicio: null,
        fecha_fin: null,
        foto: "",
        visible:false,
        genero: 1
    },
    methods: {
        
    },
});


        