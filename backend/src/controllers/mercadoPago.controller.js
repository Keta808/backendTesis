/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";
import MercadoPagoServices from "../services/mercadoPago.services.js"; 
import { MP_REDIRECT_URI } from "../config/configEnv.js";

async function crearMercadoPagoAcc(req, res) {
    try {
        const { idMicroempresa } = req.body;
        if (!idMicroempresa) return respondError(req, res, 500, "No se ha proporcionado el id de la microempresa.");
        const [newMercadoPagoAcc, error] = await MercadoPagoServices.crearMercadoPagoAcc(idMicroempresa);
        if (error) {
            return respondError(req, res, 500, error);
        }
        return respondSuccess(req, res, 200, newMercadoPagoAcc);
    } catch (error) {
        handleError(error, "mercadoPago.controller -> crearMercadoPagoAcc");
        return respondError(req, res, 500, error);
    }
} 
async function getMercadoPagoAcc(req, res) {
    try {
        const idMicroempresa = req.params.id;
        console.log("MP: Controller getMercadoPagoAcc", idMicroempresa);
        if (!idMicroempresa) return respondError(req, res, 500, "No se ha proporcionado el id de la microempresa.");
        const [mercadoPagoAcc, error] = await MercadoPagoServices.getMercadoPagoAcc(idMicroempresa);
        if (error) {
            return respondError(req, res, 500, error);
        }
        return respondSuccess(req, res, 200, mercadoPagoAcc);
    } catch (error) {
        handleError(error, "mercadoPago.controller -> getMercadoPagoAcc");
        return respondError(req, res, 500, error);
    }
} 
async function updateMercadoPagoAcc(req, res) {
    try {
        const { idMicroempresa } = req.params; 
        if (!idMicroempresa) return respondError(req, res, 400, "No se ha proporcionado el id de la microempresa.");
        const data = req.body;
        const [mercadoPagoAcc, error] = await MercadoPagoServices.updateMercadoPagoAcc(idMicroempresa, data);
        if (error) {
            return respondError(req, res, 400, error);
        }
        return respondSuccess(req, res, 200, mercadoPagoAcc);
    } catch (error) {
        handleError(error, "mercadoPago.controller -> updateMercadoPagoAcc");
        return respondError(req, res, 400, error);
    }
}
async function deleteMercadoPagoAcc(req, res) {
    try {
        const { idMicroempresa } = req.params;
        if (!idMicroempresa) return respondError(req, res, 400, "No se ha proporcionado el id de la microempresa.");
        const [mercadoPagoAcc, error] = await MercadoPagoServices.deleteMercadoPagoAcc(idMicroempresa);
        if (error) {
            return respondError(req, res, 400, error);
        }
        return respondSuccess(req, res, 200, mercadoPagoAcc);
    } catch (error) {
        handleError(error, "mercadoPago.controller -> deleteMercadoPagoAcc");
        return respondError(req, res, 400, error);
    }
}
async function getMercadoPagoAccs(req, res) {
    try {
        const [mercadoPagoAccs, error] = await MercadoPagoServices.getMercadoPagoAccs();
        if (error) {
            return respondError(req, res, 400, error);
        }
        return respondSuccess(req, res, 200, mercadoPagoAccs);
    } catch (error) {
        handleError(error, "mercadoPago.controller -> getMercadoPagoAccs");
        return respondError(req, res, 400, error);
    }
} 
async function onBoarding(req, res) {
    try {
        const { code, state } = req.query;
        if (!code || !state) return respondError(req, res, 400, "No se han proporcionado los datos necesarios.");
        console.log("Controller OnBoarding Code y state: ", code, state);
        const idMicroempresa = state;

        const [response, error] = await MercadoPagoServices.onBoarding(code, idMicroempresa);
        if (error) {
            return respondError(req, res, 400, error);
        }
        console.log("MP: Controller OnBoarding", response);
        return respondSuccess(req, res, 200, response);
    } catch (error) {
        handleError(error, "mercadoPago.controller -> onBoarding");
        return respondError(req, res, 400, error);
    }
} 
async function refreshToken(req, res) {
    try {
        const { idMicroempresa } = req.params; 
        if (!idMicroempresa) return respondError(req, res, 400, "No se ha proporcionado el id de la microempresa.");
        const [mercadoPagoAcc, error] = await MercadoPagoServices.refreshToken(idMicroempresa); 
        if (error) {
            return respondError(req, res, 400, error);
        }
        return respondSuccess(req, res, 200, mercadoPagoAcc);
    } catch (error) {
        handleError(error, "mercadoPago.controller -> refreshToken");
        return respondError(req, res, 400, error);
    }
}
async function generarUrlOnBoarding(req, res) { 
    try {
        const { idMicroempresa } = req.body; 
        
        if (!idMicroempresa) return respondError(req, res, 400, "No se ha proporcionado el id de la microempresa.");
        console.log("MP: Controller GenerarUrl", idMicroempresa);
        const [url, error] = await MercadoPagoServices.generarUrlOnBoarding(idMicroempresa);
        if (error) {
            return respondError(req, res, 400, error);
        }
        console.log("MP: Controller GenerarUrl", url);
        return respondSuccess(req, res, 200, url);
    } catch (error) {
        handleError(error, "mercadoPago.controller -> generarUrlOnBoarding");
        return respondError(req, res, 400, error);
    }
} 
async function crearPreferenciaServicio(req, res) {
    try {
        const { idServicio } = req.params;
        if (!idServicio) return respondError(req, res, 400, "No se ha proporcionado el id del servicio.");
        const [iniPoint, error] = await MercadoPagoServices.crearPreferenciaServicio(idServicio);
        if (error) return respondError(req, res, 400, error);
        return respondSuccess(req, res, 200, { urlPago: iniPoint });
    } catch (error) {
        handleError(error, "mercadoPago.controller -> crearPreferenciaServicio");
        return respondError(req, res, 400, error);
    }
}

async function obtenerRedirect(req, res) {
    try {
        return respondSuccess(req, res, 200, { MP_REDIRECT_URI });
    } catch (error) {
        handleError(error, "mercadoPago.controller -> obtenerRedirect");
        return respondError(req, res, 400, error);
    }
}
export default {
    crearMercadoPagoAcc,
    getMercadoPagoAcc,
    updateMercadoPagoAcc,
    deleteMercadoPagoAcc,
    getMercadoPagoAccs,
    onBoarding,
    generarUrlOnBoarding,
    refreshToken,
    crearPreferenciaServicio,
    obtenerRedirect,
};
