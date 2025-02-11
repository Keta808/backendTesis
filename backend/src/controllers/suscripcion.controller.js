/* eslint-disable camelcase */
/* eslint-disable object-curly-spacing */
/* eslint-disable space-before-blocks */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable quotes */
/* eslint-disable require-jsdoc */
import suscripcionService from '../services/suscripcion.service.js';    
import { respondSuccess, respondError } from "../utils/resHandler.js";
import { handleError } from "../utils/errorHandler.js"; 
import { suscripcionBodySchema, suscripcionIdSchema } from "../schema/suscripcion.schema.js";

async function getSuscripciones(req, res) {
    try {
        const [suscripciones, error] = await suscripcionService.getSuscripciones();
        if (error) return respondError(req, res, 400, error);
        suscripciones.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, suscripciones);
    } catch (error) {
        handleError(error, "suscripcion.controller -> getSuscripciones");
        return respondError(req, res, 400, error.message);
    }
}

async function getSuscripcion(req, res) {
    try {
        // Validar el ID de la suscripción
        const { error } = suscripcionIdSchema.validate(req.params);

        if (error) { 
            console.log("Error en getSuscripcion:", error.message);
            return respondError(req, res, 400, error);
        } 

        const [suscripcion, errorSuscripcion] = await suscripcionService.getSuscripcion(req.params.id);
        if (errorSuscripcion) return respondError(req, res, 404, errorSuscripcion);

        return respondSuccess(req, res, 200, suscripcion);
    } catch (error) {
        handleError(error, "suscripcion.controller -> getSuscripcion");
        return respondError(req, res, 400, "Error al obtener la suscripción.");
    }
}

async function deleteSuscripcion(req, res) {
    try {
        // Validar el ID de la suscripción
        const { error } = suscripcionIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error);

        const [suscripcion, errorSuscripcion] = await suscripcionService.deleteSuscripcion(req.params.id);
        if (errorSuscripcion) return respondError(req, res, 404, errorSuscripcion);

        return respondSuccess(req, res, 200, suscripcion);
    } catch (error) {
        handleError(error, "suscripcion.controller -> deleteSuscripcion");
        return respondError(req, res, 400, "Error al eliminar la suscripción.");
    }
}

async function updateSuscripcion(req, res) {
    try {
        // Validar el ID de la suscripción
        const { error } = suscripcionIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error);

        // Validar el cuerpo de la solicitud
        const { error: bodyError } = suscripcionBodySchema.validate(req.body);
        if (bodyError) return respondError(req, res, 400, bodyError);

        const [suscripcion, errorSuscripcion] = await suscripcionService.updateSuscripcion(req.params.id, req.body);
        if (errorSuscripcion) return respondError(req, res, 404, errorSuscripcion);

        return respondSuccess(req, res, 200, suscripcion);
    } catch (error) {
        handleError(error, "suscripcion.controller -> updateSuscripcion");
        return respondError(req, res, 400, "Error al actualizar la suscripción.");
    }
}
// eslint-disable-next-line no-unused-vars
async function sincronizarEstados(){
    try {
        await suscripcionService.sincronizarEstados();
    // eslint-disable-next-line keyword-spacing
    }catch(error){
        handleError(error, "suscripcion.controller -> sincronizarEstados");
    }
} 

async function getIssuers(req, res) {
    try {
        const paymentMethodId = "visa";  
        // Llamada al servicio para obtener emisores
        const emisores = await suscripcionService.getIssuers(paymentMethodId);
        if (!emisores || emisores.length === 0) {
            return res.status(404).json({ error: "No se encontraron emisores disponibles" });
        } 
        return res.status(200).json(emisores); 
    } catch (error) {
        console.error(`Error en obtenerEmisores:`, error.message);
        return res.status(500).json({ error: "Error al obtener emisores" });
    }
}
async function getIdentificationTypes(req, res) {
    try {
        // Llamada al servicio para obtener tipos de identificación
        const identificationTypes = await suscripcionService.getIdentificationTypes();
        if (!identificationTypes || identificationTypes.length === 0) {
            return res.status(404).json({ error: "No se encontraron tipos de identificación disponibles" });
        } 
        return res.status(200).json(identificationTypes); 
    } catch (error) {
        console.error(`Error en obtenerTiposIdentificacion:`, error.message);
        return res.status(500).json({ error: "Error al obtener tipos de identificación" });
    }
} 

async function cardForm(req, res) {
    try {
        const paymentData = req.body; 
        console.log("CONTROLLER CARDFORM: Datos recibidos en el controller:", paymentData);
        // Llamada al servicio para generar cardTokenId
        const cardTokenId = await suscripcionService.cardForm(paymentData);
        return res.status(200).json({ cardTokenId }); 
    } catch (error) {
        console.error(`Error en generarCardTokenId:`, error.message);
        return res.status(500).json({ error: "Error al generar cardTokenId" });
    }
} 
async function crearSuscripcion(req, res) { 
    try {
        const suscripcionData = req.body; 
        console.log("CONTROLLER CREAR SUS: Datos recibidos en el controller:", suscripcionData);
        // Llamada al servicio para crear suscripción
        const suscripcion = await suscripcionService.crearSuscripcion(suscripcionData);
        return res.status(200).json(suscripcion); 
    } catch (error) {
        console.error(`Error en crearSuscripcion:`, error.message);
        return res.status(500).json({ error: "Error al crear suscripción" });
    }
} 

async function obtenerSuscripcion(req, res) {  
    try {
        const { plan, user, cardTokenId, payer_email } = req.body;
        if (!plan|| !user || !cardTokenId || !payer_email) {
            return respondError(req, res, 400, "Faltan datos para crear la suscripción");
        }
        console.log("CONTROLLER OBTENER SUS: Datos recibidos en el controller:", plan, user, cardTokenId, payer_email); 
        const [suscripcion, error] = await suscripcionService.obtenerSuscripcion(plan, user, cardTokenId, payer_email);
        if (error) return respondError(req, res, 400, error.message); 
       
        return respondSuccess(req, res, 200, suscripcion);
    } catch (error){
        handleError(error, "suscripcion.controller -> obtenerSuscripcion");
        return respondError(req, res, 400, error.message);
    }
} 

async function searchSuscripcionMP(req, res) {
    try {
        const { params } = req.query;
        console.log("CONTROLLER SEARCH SUS: Datos recibidos en el controller:", params);
        const [suscripcion, error] = await suscripcionService.searchSuscripcionMP(params);
        if (error) return respondError(req, res, 500, "Error al buscar la suscripción"); 
        return respondSuccess(req, res, 200, suscripcion);
    } catch (error){
        handleError(error, "suscripcion.controller -> searchSuscripcionMP");
        return respondError(req, res, 500, "Error al buscar la suscripción", error);
    }
}  
async function getSuscripcionById(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return respondError(req, res, 400, "ID de suscripción no proporcionado.");
        }

        console.log("CONTROLLER GET SUSCRIPCIÓN BY ID: ID recibido:", id);

        const [suscripcion, error] = await suscripcionService.getSuscripcionById(id);

        if (error) {
            return respondError(req, res, 400, "Error al obtener la suscripción");
        }

        return respondSuccess(req, res, 200, suscripcion);
    } catch (error) {
        handleError(error, "suscripcion.controller -> getSuscripcionById");
        return respondError(req, res, 400, "Error interno al obtener la suscripción");
    }
}
async function updateSuscripcionMP(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;

        if (!id) {
            return respondError(req, res, 400, "ID de suscripción no proporcionado.");
        }

        if (!data || Object.keys(data).length === 0) {
            return respondError(req, res, 400, "No se proporcionaron datos para actualizar.");
        }

        console.log("CONTROLLER UPDATE SUSCRIPCIÓN: ID recibido:", id);
        console.log("Datos para actualizar:", data);

        const [suscripcionActualizada, error] = await suscripcionService.updateSuscripcionMP(id, data);

        if (error) {
            return respondError(req, res, 400, "Error al actualizar la suscripción", error);
        }

        return respondSuccess(req, res, 200, suscripcionActualizada);
    } catch (error) {
        handleError(error, "suscripcion.controller -> updateSuscripcionMP");
        return respondError(req, res, 500, "Error interno al actualizar la suscripción", error);
    }
} 
async function updateSuscripcionCard(req, res) { 
    try {
        const { preapprovalId } = req.params;
        const { newCardTokenId, idUser } = req.body;
        if (!preapprovalId || !newCardTokenId || !idUser) {
            return respondError(req, res, 400, "Faltan datos para actualizar la suscripción");
        }
        console.log("CONTROLLER UPDATE SUS CARD: Datos recibidos en el controller:", preapprovalId, newCardTokenId, idUser);
        const [suscripcion, error] = await suscripcionService.updateSuscripcionCard(preapprovalId, newCardTokenId, idUser);
        if (error) return respondError(req, res, 400, error.message); 
        return respondSuccess(req, res, 200, suscripcion);
    } catch (error){
        handleError(error, "suscripcion.controller -> updateSuscripcionCard");
        return respondError(req, res, 400, error.message);
    }
}

async function cancelarSuscripcion(req, res){
    try { 
        console.log("Body recibido en cancelarSuscripcion:", req.body);

        const { idUser, preapprovalId } = req.body; 
        
        if (!idUser || !preapprovalId) {
            return respondError(req, res, 400, "Faltan datos para cancelar la suscripción");
          }
        console.log("CONTROLLER CANCELAR SUS: Datos recibidos en el controller:", idUser, preapprovalId);
        const [suscripcion, error] = await suscripcionService.cancelarSuscripcion(idUser, preapprovalId);
        if (error) {
            console.error("Error en cancelarSuscripcionService:", error);
            return respondError(req, res, 400, error);
        }
        return respondSuccess(req, res, 200, suscripcion);
    } catch (error) {
        handleError(error, "suscripcion.controller -> cancelarSuscripcion");
        return respondError(req, res, 400, error.message);
    }
} 

async function updateCardTokenByUserId(req, res) {
    try {
        const { userId } = req.params;
        const { cardTokenId } = req.body;
        if (!userId || !cardTokenId) {
            return respondError(req, res, 400, "Faltan datos para actualizar el token de la tarjeta");
        } 
        console.log("CONTROLLER UPDATE CARD TOKEN: Datos recibidos en el controller:", userId, cardTokenId);
        const [suscripcion, error] = await suscripcionService.updateCardTokenByUserId(userId, cardTokenId);
        if (error) return respondError(req, res, 400, error.message);
        return respondSuccess(req, res, 200, suscripcion);
    } catch (error) {
        handleError(error, "suscripcion.controller -> updateCardTokenByUserId");
        return respondError(req, res, 400, error.message);   
    }
} 

async function getUserSubscription(req, res) { 
    try {
        const idUser = req.params.idUser;
        if (!idUser) {
            return respondError(req, res, 400, "Faltan datos para obtener la suscripción");
        } 
        console.log("CONTROLLER GET USER SUBSCRIPTION: ID recibido:", idUser); 
        const [suscripcion, error] = await suscripcionService.getUserSubscription(idUser); 
        if (error) return respondError(req, res, 400, error);
        return respondSuccess(req, res, 200, suscripcion);        
    } catch (error) { 
        handleError(error, "suscripcion.controller -> getUserSubscription");
        return respondError(req, res, 400, error.message);
    }
}
async function userChange(req, res) {
    try {
        const { id } = req.params; 
        if (!id) {
            return respondError(req, res, 400, "Faltan datos para obtener la suscripción");
        }
        console.log("CONTROLLER USER CHANGE: ID recibido:", id); 
        const [trabajador, error ] = await suscripcionService.userChange(id); 
        if (error) return respondError(req, res, 400, error);
        return respondSuccess(req, res, 200, trabajador);
    } catch (error){
        handleError(error, "suscripcion.controller -> userChange");
        return respondError(req, res, 400, error.message);
    }
}
export default { 
    crearSuscripcion, 
    getSuscripciones, 
    getSuscripcion, 
    deleteSuscripcion, 
    updateSuscripcion, 
    sincronizarEstados,
    getIssuers,
    getIdentificationTypes,
    cardForm,
    obtenerSuscripcion,
    searchSuscripcionMP,
    getSuscripcionById,
    updateSuscripcionMP,
    updateSuscripcionCard,
    cancelarSuscripcion,
    updateCardTokenByUserId,
    getUserSubscription,
    userChange,

};
