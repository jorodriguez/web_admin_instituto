import { getToken } from "../helpers/Sesion";

import axios from "axios";

/*
  Responsabilidad: solo de este punto se comunicara al Backend por si axios se depreca o si se desea ocupar otra lib como fetch nativa.
*/ 

const getAsync = async url => {
    try {
        const response = await axios.get(url, {
            headers: { "x-access-token": getToken() }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        console.log("Revisando la sesion " + JSON.stringify(error));
        lanzarAvisoExpiracionSesion(error);
    }
};

const postAsync = async(url, params) => {
    try {
        const response = await axios.post(url, params, {
            headers: { "x-access-token": getToken() }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        console.log("Revisando la sesion " + JSON.stringify(error));
        lanzarAvisoExpiracionSesion(error);
    }
};

const putAsync = async(url, params) => {
    try {
        const response = await axios.put(url, params, {
            headers: { "x-access-token": getToken() }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        console.log("Revisando la sesion " + JSON.stringify(error));
        lanzarAvisoExpiracionSesion(error);
    }
};

const removeAsync = async(url) => {
    try {
        const response = await axios.delete(url, {
            headers: { "x-access-token": getToken() }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        console.log("Revisando la sesion " + JSON.stringify(error));
        lanzarAvisoExpiracionSesion(error);
    }
};

const patchAsync = async(url, params) => {
    try {
        const response = await axios.patch(url, params, {
            headers: { "x-access-token": getToken() }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        console.log("Revisando la sesion " + JSON.stringify(error));
        lanzarAvisoExpiracionSesion(error);
    }
};



const lanzarAvisoExpiracionSesion = function(error) {
    console.log("lanzar aviso");
    let mensaje = "";
    let sesionExpirada = false;
    let data = error.response.data;
    console.log("error " + JSON.stringify(data));

    const isExpiredToken = data.tokenExpired;

    if (isExpiredToken) {
        console.log("@Sesion expirada ");
        mensaje = "Su sesión ha expirado, por razones de seguridas es necesario que vuelva a iniciar sesión.";
        $("#id_header_popup_expiracion_sesion").text("Sesión");
        $("#id_icono_popup_expiracion_sesion").attr(
            "class", "fas fa-user-clock fa-5x"
        );
    } else {
        mensaje = "Ocurrió un error.";
        $("#id_header_popup_expiracion_sesion").text("Ups");
        $("#id_icono_popup_expiracion_sesion").attr(
            "class", "fas fa-error fa-5x"
        );
    }

    $("#id_mensaje_popup_expiracion_sesion").text(mensaje);
    $("#id_mensaje_secundario_popup_expiracion_sesion").empty();
    $("#popup_expiracion_sesion").modal("show");
};

const operacionesApi = {
    methods: {
        getAsync,
        postAsync,
        putAsync,
        removeAsync,
        patchAsync
    }

};

export { operacionesApi };