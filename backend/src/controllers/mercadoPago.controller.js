/* eslint-disable max-len */
/* eslint-disable require-jsdoc */

import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js";
import MercadoPagoServices from "../services/mercadoPago.services.js"; 

async function crearMercadoPagoAcc(req, res) {
    try {
        const { idMicroempresa } = req.body;
        if (!idMicroempresa) return respondError(res, 400, "No se ha proporcionado el id de la microempresa.");
        const [newMercadoPagoAcc, error] = await MercadoPagoServices.crearMercadoPagoAcc(idMicroempresa);
        if (error) {
            return respondError(res, 400, error);
        }
        return respondSuccess(res, 200, newMercadoPagoAcc);
    } catch (error) {
        handleError(error, "mercadoPago.controller -> crearMercadoPagoAcc");
        return respondError(res, 400, error);
    }
} 
async function getMercadoPagoAcc(req, res) {
    try {
        const { idMicroempresa } = req.params;
        if (!idMicroempresa) return respondError(res, 400, "No se ha proporcionado el id de la microempresa.");
        const [mercadoPagoAcc, error] = await MercadoPagoServices.getMercadoPagoAcc(idMicroempresa);
        if (error) {
            return respondError(res, 400, error);
        }
        return respondSuccess(res, 200, mercadoPagoAcc);
    } catch (error) {
        handleError(error, "mercadoPago.controller -> getMercadoPagoAcc");
        return respondError(res, 400, error);
    }
} 
async function updateMercadoPagoAcc(req, res) {
    try {
        const { idMicroempresa } = req.params; 
        if (!idMicroempresa) return respondError(res, 400, "No se ha proporcionado el id de la microempresa.");
        const data = req.body;
        const [mercadoPagoAcc, error] = await MercadoPagoServices.updateMercadoPagoAcc(idMicroempresa, data);
        if (error) {
            return respondError(res, 400, error);
        }
        return respondSuccess(res, 200, mercadoPagoAcc);
    } catch (error) {
        handleError(error, "mercadoPago.controller -> updateMercadoPagoAcc");
        return respondError(res, 400, error);
    }
}
async function deleteMercadoPagoAcc(req, res) {
    try {
        const { idMicroempresa } = req.params;
        if (!idMicroempresa) return respondError(res, 400, "No se ha proporcionado el id de la microempresa.");
        const [mercadoPagoAcc, error] = await MercadoPagoServices.deleteMercadoPagoAcc(idMicroempresa);
        if (error) {
            return respondError(res, 400, error);
        }
        return respondSuccess(res, 200, mercadoPagoAcc);
    } catch (error) {
        handleError(error, "mercadoPago.controller -> deleteMercadoPagoAcc");
        return respondError(res, 400, error);
    }
}
async function getMercadoPagoAccs(req, res) {
    try {
        const [mercadoPagoAccs, error] = await MercadoPagoServices.getMercadoPagoAccs();
        if (error) {
            return respondError(res, 400, error);
        }
        return respondSuccess(res, 200, mercadoPagoAccs);
    } catch (error) {
        handleError(error, "mercadoPago.controller -> getMercadoPagoAccs");
        return respondError(res, 400, error);
    }
} 
async function onBoarding(req, res) {
    try {
        const { code, idMicroempresa } = req.body;
        if (!code || !idMicroempresa) return respondError(res, 400, "No se han proporcionado los datos necesarios.");
        const [response, error] = await MercadoPagoServices.onBoarding(code, idMicroempresa);
        if (error) {
            return respondError(res, 400, error);
        }
        console.log("MP: Controller OnBoarding", response);
        return respondSuccess(res, 200, response);
    } catch (error) {
        handleError(error, "mercadoPago.controller -> onBoarding");
        return respondError(res, 400, error);
    }
} 
async function generarUrlOnBoarding(req, res) { 
    try {
        const { idMicroempresa } = req.params;
        if (!idMicroempresa) return respondError(res, 400, "No se ha proporcionado el id de la microempresa.");
        const [url, error] = await MercadoPagoServices.generarUrlOnBoarding(idMicroempresa);
        if (error) {
            return respondError(res, 400, error);
        }
        console.log("MP: Controller GenerarUrl", url);
        return respondSuccess(res, 200, url);
    } catch (error) {
        handleError(error, "mercadoPago.controller -> generarUrlOnBoarding");
        return respondError(res, 400, error);
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
};
