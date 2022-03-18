import configEnv from '../../config/configEnv';


const BASE = configEnv.BASE || "http://localhost:5000";
//const BASE = process.env.URL_API || 'https://instituto-api-dev.herokuapp.com'
//const BASE = process.env.URL_API || 'https://api-admin-paris.herokuapp.com';
export const BRANCH = "2203-productos";

const CURSO = BASE + '/curso';
const ALUMNOS_BASE = BASE + '/alumnos';
const INSCRIPCION_BASE = BASE + '/inscripcion';
const ESPECIALIDADES_BASE = BASE + '/especialidad';
const DIAS_BASE = BASE + '/dias';
const HORARIOS_BASE = BASE + '/horarios';
const ESCOLARIDAD_BASE = BASE+'/escolaridad';
const PERIODOS_CURSO = BASE + '/periodos-curso';
const MATERIAS_ESPECIALIDAD = BASE + '/materias';
const COBRANZA = BASE + '/cobranza';
const VENTA = BASE + '/venta';
const ARTICULO = BASE + '/articulo';
const CATEGORIA_ARTICULO = BASE + '/categoria-articulo';
const MARCA_ARTICULO = BASE + '/marca-articulo';
const UNIDAD_MEDIDA = BASE + '/unidad-medida-articulo';
const ESTATUS= BASE + '/estatus';

const ASISTENCIA_BASE =  BASE + '/asistencia';
const ASISTENCIA_USUARIO_BASE =  BASE + '/asistencia_usuarios';
const BALANCE_BASE = BASE +'/balance';
const SUCURSAL_BASE = BASE +'/sucursal';
const CAMBIO_SUCURSAL_BASE = BASE +'/cambio_sucursal';
const PAGOS_BASE = BASE +'/pagos';
const CARGOS_BASE = BASE +'/cargos';
const FORMAS_PAGO_BASE = BASE +'/formas_pagos';
const GASTOS_BASE = BASE + '/gastos';
const USUARIO_BASE = BASE+'/usuario';
const REPORTES_BASE =  BASE + '/reportes';

const HISTORICO_GASTOS  = BASE +'/historico_gastos';
const TIPOS_GASTO = BASE + '/tipos_gasto';

const FAMILIAR_BASE = BASE + '/familiar';
const PARENTESCO_BASE = BASE + '/parentesco';
const SERVICIOS_BASE = BASE + '/servicios';
const VALORES_ESPERADOS = BASE + '/valores_esperados';
const DATOS_FACTURADOS = BASE +'/datos_facturacion';

const RESET_PASSWORD = BASE + '/reset_password';
const ACTIVIDAD_BASE = BASE + '/actividad';
const CATALOGO_ACTIVIDAD = BASE + '/catalogo_actividad';

const BALANCE_CRECIMIENTO_GLOBAL = BASE + '/balance_crecimiento_global';
const ALUMNOS_CRECIMIENTO_MES = BASE + '/alumnos_crecimiento_mes';

const BALANCE_SUCURSAL = BASE + '/balance_sucursal';
const BALANCE_ALUMNO_SUCURSAL = BASE + '/balance_alumnos_sucursal';
const BALANCE_CRECIMIENTO = BASE +'/balance_crecimiento';
const BALANCE_CRECIMIENTO_MENSUAL = BASE +'/balance_crecimiento_mensual';
const BALANCE_CRECIMIENTO_ALUMNOS = BASE +'/balance_crecimiento_alumnos';
const MESES_ACTIVOS = BASE + '/meses_activos';

const ALUMNOS_BALANCE_CRECIMIENTO_MENSUAL_SUCURSAL =  BASE +'/alumnos_balance_crecimiento_mensual_sucursal';
const REPORTE_GASTO_MES_ACTUAL = BASE + '/reporte_gastos_mes_actual';
const REPORTE_INGRESO_MENOS_GASTO_MENSUAL = BASE + '/reporte_ingreso_menos_gasto_mensual';

const REPORTE_GASTOS = BASE + '/reporte_gastos';
const REPORTE_GASTOS_SUCURSALES = BASE + '/reporte_gastos_sucursales';
const REPORTE_GASTOS_GLOBAL = BASE + '/reporte_gastos_global';

const REPORTE_MENSUALIDADES = BASE + '/reporte_mensualidades';
const REPORTE_MENSUALIDADES_MES_ACTUAL = BASE + '/reporte_mensualidades_mes_actual';

//-recordatorio
const INFO_CORREO_ALUMNOS = BASE + '/getInfoCorreoAlumnos';

const INFO_CONFIGURACION = BASE + '/configuracion';
const ENVIAR_RECORDATORIO_PAGO_ALUMNO = BASE + '/enviar_recordatorio_pago';
const REPORTE_MENSUALIDAD_BASE =  BASE +'/mensualidad';

const SUCURSAL_USUARIO = BASE + '/sucursal_usuario';
const SUCURSAL_USUARIO_ASIGNADAS = SUCURSAL_USUARIO + '/sucursales_asignadas'; //todas las sucursales asignadas

const CAT_DESCUENTOS = BASE + '/descuento';

const REPORTE_CONBRANZA = BASE + '/reporte_cobranza';
const GENERO_ALUMNO = BASE + '/genero_alumno';
const IMAGEN_PERFIL = BASE + '/foto_perfil';
const ESTADO_CUENTA = BASE + '/estado_cuenta/'; // /estado_cuenta/:id_alumno
const ESTADO_CUENTA_PREVIEW = BASE + '/estado_cuenta/preview/'; // /estado_cuenta/preview/:id_alumno
const ESTADO_CUENTA_ENVIAR = BASE + '/estado_cuenta/enviar/'; // /estado_cuenta/preview/:id_alumno
const USUARIOS_RH = BASE + '/usuarios_rh'; // /usuarios_rh/id_sucursal
const AVISOS = BASE + '/aviso'; // /aviso/:

const URL = {    
    LOGIN : BASE+'/auth/login',    
    CURSO:CURSO,
    INSCRIPCION_BASE:INSCRIPCION_BASE,
    ASISTENCIA_BASE : ASISTENCIA_BASE,
    ESPECIALIDADES_BASE:ESPECIALIDADES_BASE,
    DIAS_BASE:DIAS_BASE,
    HORARIOS_BASE:HORARIOS_BASE,
    ESCOLARIDAD:ESCOLARIDAD_BASE,
    PERIODOS_CURSO : PERIODOS_CURSO,
    MATERIAS_ESPECIALIDAD : MATERIAS_ESPECIALIDAD,
    REPORTES_BASE:REPORTES_BASE,
    COBRANZA:COBRANZA,
    VENTA:VENTA,
    ARTICULO:ARTICULO,
    CATEGORIA_ARTICULO:CATEGORIA_ARTICULO,
    MARCA_ARTICULO:MARCA_ARTICULO,
    UNIDAD_MEDIDA,
    ESTATUS:ESTATUS,

    USUARIO_BASE:  USUARIO_BASE,
    USUARIO_BUSCAR_ID:  USUARIO_BASE+'/buscar',//+id_usuario
        
    BALANCE_BASE : BALANCE_BASE,
    SUCURSAL_BASE : SUCURSAL_BASE,
    CAMBIO_SUCURSAL_BASE : CAMBIO_SUCURSAL_BASE,
    ALUMNOS_BASE : ALUMNOS_BASE ,

    PAGOS_BASE: PAGOS_BASE,
    PAGOS_REGISTRAR : PAGOS_BASE + '/registrar',
    CARGOS_BASE : CARGOS_BASE,
    CARGOS_ALUMNO : CARGOS_BASE+'/alumno',
    CARGO_REGISTRAR : CARGOS_BASE + '/registrar',
    MESES_ADEUDA : CARGOS_BASE + '_meses_adeuda/',  //id_alumno
    REENVIAR_COMPROBANTE: PAGOS_BASE+'/reenviar_comprobante',

    MENSUALIDAD_VENCE_SEMANA_ACTUAL : REPORTE_MENSUALIDAD_BASE + '/vence_semana_actual/',//id_sucursal
    
    FORMAS_PAGO_BASE : FORMAS_PAGO_BASE,
   
    GASTOS_BASE : GASTOS_BASE,
    HISTORICO_GASTOS:HISTORICO_GASTOS,
    TIPOS_GASTO : TIPOS_GASTO,
    GENERO_ALUMNO:GENERO_ALUMNO,

    FAMILIAR_BASE : FAMILIAR_BASE,
    PARENTESCO_BASE : PARENTESCO_BASE,
    SERVICIOS_BASE : SERVICIOS_BASE,
    VALORES_ESPERADOS : VALORES_ESPERADOS,
    DATOS_FACTURADOS : DATOS_FACTURADOS,
    RESET_PASSWORD : RESET_PASSWORD,
    ACTIVIDAD_BASE : ACTIVIDAD_BASE,
    CATALOGO_ACTIVIDAD : CATALOGO_ACTIVIDAD,
    BALANCE_CRECIMIENTO_GLOBAL : BALANCE_CRECIMIENTO_GLOBAL,
    ALUMNOS_CRECIMIENTO_MES : ALUMNOS_CRECIMIENTO_MES,
    BALANCE_SUCURSAL : BALANCE_SUCURSAL,
    BALANCE_ALUMNO_SUCURSAL : BALANCE_ALUMNO_SUCURSAL,
    BALANCE_CRECIMIENTO : BALANCE_CRECIMIENTO,
    BALANCE_CRECIMIENTO_ALUMNOS : BALANCE_CRECIMIENTO_ALUMNOS,
    BALANCE_CRECIMIENTO_MENSUAL : BALANCE_CRECIMIENTO_MENSUAL,

    MESES_ACTIVOS : MESES_ACTIVOS,
    ALUMNOS_BALANCE_CRECIMIENTO_MENSUAL_SUCURSAL : ALUMNOS_BALANCE_CRECIMIENTO_MENSUAL_SUCURSAL,
    REPORTE_GASTO_MES_ACTUAL : REPORTE_GASTO_MES_ACTUAL,
    REPORTE_INGRESO_MENOS_GASTO_MENSUAL : REPORTE_INGRESO_MENOS_GASTO_MENSUAL,

    REPORTE_GASTOS : REPORTE_GASTOS,
    REPORTE_GASTOS_SUCURSALES:REPORTE_GASTOS_SUCURSALES,
    REPORTE_GASTOS_GLOBAL : REPORTE_GASTOS_GLOBAL,

    REPORTE_MENSUALIDADES : REPORTE_MENSUALIDADES,    
    REPORTE_MENSUALIDADES_MES_ACTUAL : REPORTE_MENSUALIDADES_MES_ACTUAL,    
    
    INFO_CORREO_ALUMNOS: INFO_CORREO_ALUMNOS,
    
    INFO_CONFIGURACION:INFO_CONFIGURACION,

    ENVIAR_RECORDATORIO_PAGO_ALUMNO : ENVIAR_RECORDATORIO_PAGO_ALUMNO,

    SUCURSAL_USUARIO:SUCURSAL_USUARIO,
    REPORTE_MENSUALIDADES_MES_ACTUAL:REPORTE_MENSUALIDADES_MES_ACTUAL,

    SUCURSAL_USUARIO_ASIGNADAS :SUCURSAL_USUARIO_ASIGNADAS,

    CAT_DESCUENTOS:CAT_DESCUENTOS,
    
    REPORTE_CONBRANZA:REPORTE_CONBRANZA,
    
    IMAGEN_PERFIL:IMAGEN_PERFIL,
    ESTADO_CUENTA:ESTADO_CUENTA,
    ESTADO_CUENTA_ENVIAR:ESTADO_CUENTA_ENVIAR,
    ESTADO_CUENTA_PREVIEW:ESTADO_CUENTA_PREVIEW,
    USUARIOS_RH:USUARIOS_RH,
    REPORTE_ASISTECIAS_RH: ASISTENCIA_USUARIO_BASE +'/reporte_rh',
    AVISOS: AVISOS

}

export default URL;

