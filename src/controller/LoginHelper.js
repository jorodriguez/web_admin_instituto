
import Vue from 'vue';


import { setSession, setToken } from '../helpers/Sesion';
import CONSTANTES from "../helpers/Constantes";

const cargarSesion = (loginRespuesta) => {
    return new Promise((resolve, reject) => {
        try {
            let paginaPrincipal = loginRespuesta.pago_pendiente ? "/PagoPendiente" : "/principal";
            
            loginRespuesta.paginaPrincipal = paginaPrincipal;
            
            setSession(loginRespuesta);
            setToken(loginRespuesta.token);

            resolve(paginaPrincipal);

        } catch (error) {
            reject(error);
        }
    });

};


export { cargarSesion };