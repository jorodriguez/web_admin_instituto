import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Principal from '@/components/Principal'
import CatAlumno from '@/components/CatAlumno'
import PerfilAlumno from '@/components/PerfilAlumno'
import RegistroActividad from '@/actividad/RegistroActividad'
import ReporteDeudas from '@/components_admin/ReporteDeudas'
import CrecimientoGlobal from '@/components_admin/CrecimientoGlobal'
import ReporteGastos from '@/components_admin/ReporteGastos'
import Gastos from '@/components/Gastos'
import CambiarSucursal from '@/components/CambiarSucursal'
import ReporteAsistencia from '@/components/ReporteAsistencia'
import ReporteAsistenciasFaltasSucursalMes from '@/components/ReporteAsistenciasFaltasSucursalMes'
import AsistenciasUsuarios from '@/components/AsistenciaUsuarios'
import ReporteAsistenciaRangoFechasSuc from '@/asistencia_usuario/ReporteAsistenciaRangoFechasSuc'
import Bienvenido from '@/components/Bienvenido'
import CatUsuario from '../administracion/usuarios/CatUsuario'
import Administracion from '../administracion/Administracion'
import { getUsuarioSesion, getSesion, getToken } from '../helpers/Sesion';
import SubirFotoAlumno from '@/components/SubirFotoAlumno'
import InscripcionAlumno from '@/components/InscripcionAlumno';
import CatCursos from '@/components/CatCursos';
import DetalleCurso from '@/components/DetalleCurso';
import ReciboPago from '@/components/ReciboPago';
import CorteDia from '@/components/reportes/CorteDia';
import Cobranza from '@/components/Cobranza';
import Venta from '@/components/venta/index';
import VentasSucursal from '@/components/venta/ventasSucursal';
import CatalogoProductos from '@/components/venta/catalogo_productos';
import CatEspecialidad from '../administracion/especialidades/CatEspecialidad'

import VueSession from 'vue-session'

Vue.use(Router);
Vue.use(VueSession);

const router = new Router({
  routes: [
    {
      path: '/',
      beforeEnter(to, from, next) {
        console.log("REVISNADO SESION ");
        console.log("llendo a "+to.fullPath);
        const sesion = getSesion();
        if (sesion != null && sesion.auth) {
          console.log("REDIRECCION A " + sesion.paginaPrincipal);
          next({ path: sesion.paginaPrincipal });
        } else {
          next({ name: 'Login' });
        }
      },
    },
    { path: '/login', name: 'Login', component: Login },    
    {       
      path: '/bienvenido', name: 'Bienvenido', component: Bienvenido, meta: { requiresAuth: true },
      children: [
        { path: '/principal', name: 'PaginaPrincipal', component: Principal, meta: { requiresAuth: true, validar: false } },        
        { path: '/CatAlumno', name: 'CatAlumno', component: CatAlumno, meta: { requiresAuth: true, validar: false } },
        { path: '/CatCurso', name: 'CatCurso', component: CatCursos, meta: { requiresAuth: true, validar: false } },
        { path: '/Inscripcion', name: 'Inscripcion', component: InscripcionAlumno, meta: { requiresAuth: true, validar: false } },     
        { path: '/DetalleCurso/:uidCurso', name: 'DetalleCurso', component: DetalleCurso, meta: { requiresAuth: true, validar: false } },
        { path: '/PerfilAlumno/:uid', name: 'PerfilAlumno', component: PerfilAlumno, meta: { requiresAuth: true, validar: false } },
        { path: '/ReciboPago/:id_pago', name: 'ReciboPago', component: ReciboPago, meta: { requiresAuth: true, validar: false } },
        { path: '/Corte', name: 'Corte', component: CorteDia, meta: { requiresAuth: true, validar: false } },
        { path: '/SubirFotoAlumno/:uid', name: 'SubirFotoAlumno', component: SubirFotoAlumno, meta: { requiresAuth: true, validar: false } },                
        { path: '/Gastos', name: 'Gastos', component: Gastos, meta: { requiresAuth: true, validar: false } },
        { path: '/Cobranza', name: 'Cobranza', component: Cobranza, meta: { requiresAuth: true, validar: true } },   
        { path: '/Venta', name: 'Venta', component: Venta, meta: { requiresAuth: true, validar: false } },
        { path: '/ConsultaVentas', name: 'ConsultaVentas', component: VentasSucursal, meta: { requiresAuth: true, validar: false } },
        { path: '/Productos', name: 'Productos', component: CatalogoProductos, meta: { requiresAuth: true, validar: false } },
        { path: '/CambioSucursal/:id_alumno', name: 'CambioSucursal', component: CambiarSucursal, meta: { requiresAuth: true, validar: false } },        
        { path: '/CatalogoUsuario', name: 'CatalogoUsuario', component: CatUsuario, meta: { requiresAuth: true, validar: true } },
        { path: '/Administracion', name: 'Administracion', component: Administracion, meta: { requiresAuth: true, validar: false } },
        { path: '/Especialidades', name: 'Especialidades', component: CatEspecialidad, meta: { requiresAuth: true, validar: true } },
      ]
    },
    /*{ si se activa no se ve el menu
      path: '/ReporteAdmin', name: 'ReporteDeudas', component: ReporteDeudas, meta: { requiresAuth: true , is_admin: true },
      children: [
        { path: '/CrecimientoGlobal', name: 'CrecimientoGlobal', component: CrecimientoGlobal, meta: { requiresAuth: true, is_admin: true } },
        { path: '/ReporteGastos', name: 'ReporteGastos', component: ReporteGastos, meta: { requiresAuth: true, is_admin: true  } },
      ]
    },*/
    { path: '*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {
  console.log("@beforeEach");

  if (to.matched.some(record => record.meta.requiresAuth)) {
    console.log("@Requiere auth");
    if (getToken() == null) {
      console.log("no tiene sesion pasa a login");
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      console.log("Revisando Sesion");
      let user = getUsuarioSesion();
      //console.log(" SESION "+JSON.stringify(user));
      console.log("USUARIO " + (user != null) + " admin " + user.permiso_gerente);
      if (to.matched.some(record => record.meta.is_admin)) {
        if (user.permiso_gerente) {
          console.log("Es Admin");
          next();
        } else {
          console.log("redireccion a home de admin");
          next({ name: 'ReporteAdmin' })
        }
      } else {
        if (to.matched.some(record => record.meta.validar)) {
          console.log("#### VALIDAR PERMISO-ROL### " + JSON.stringify(to.name));
          let roles = user.opciones_acceso || [];
          let pasaValidacion = false;
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].ruta == to.name) {
              pasaValidacion = true;
            }
          }
          if (pasaValidacion) {
            next();
          } else {
            next({ name: 'PaginaPrincipal' });
          }
        } else {
          console.log("PASA a URL "+to.fullPath);
          next();
        }
      }
    }
  } else {
    console.log("No requiere AUTH");
    next();
  } 
});

router.beforeResolve((to, from, next) => {
  // If this isn't an initial page load.
  if (to.name) {
    // Start the route progress bar.
    NProgress.start()
  }
  next()
})

router.afterEach((to, from) => {
  // Complete the animation of the route progress bar.
  NProgress.done()
})

export default router;