/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import servicioService from "../services/servicio.service.js";
import { servicioBodySchema, servicioIdSchema } from "../schema/servicio.schema.js";
import { handleError } from "../utils/errorHandler.js";


async function getServicios(req, res) {
    try {
        const [servicios, errorServicios] = await servicioService.getServicios();
        if (errorServicios) return respondError(req, res, 404, errorServicios);

        servicios.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, servicios);
    } catch (error) {
        handleError(error, "servicio.controller -> getServicios");
        respondError(req, res, 400, error.message);
    }
}

async function createServicio(req, res) {
    try {
        const { error } = servicioBodySchema.validate(req.body);
        if (error) return respondError(req, res, 400, error.message);

        const [newServicio, errorServicio] = await servicioService.createServicio(req.body);
        if (errorServicio) return respondError(req, res, 400, errorServicio);

        respondSuccess(req, res, 201, newServicio);
    } catch (error) {
        handleError(error, "servicio.controller -> createServicio");
        respondError(req, res, 400, error.message);
    }
}

async function deleteServicio(req, res) {
    try {
        const { error } = servicioIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error.message);

        const [servicio, errorServicio] = await servicioService.deleteServicio(req.params.id);
        if (errorServicio) return respondError(req, res, 400, errorServicio);

        respondSuccess(req, res, 200, servicio);
    } catch (error) {
        handleError(error, "servicio.controller -> deleteServicio");
        respondError(req, res, 400, error.message);
    }
} 

async function updateServicio(req, res) { 
    try { 
        const { error } = servicioIdSchema.validate(req.params); 
        if (error) return respondError(req, res, 400, error.message); 
        const { error: errorBody } = servicioBodySchema.validate(req.body); 
        if (errorBody) return respondError(req, res, 400, errorBody.message); 
        const [updatedServicio, errorServicio] = await servicioService.updateServicio(req.params.id, req.body); 
        if (errorServicio) return respondError(req, res, 400, errorServicio); 
        respondSuccess(req, res, 200, updatedServicio); 
    } catch (error) { 
        handleError(error, "servicio.controller -> updateServicio"); 
        respondError(req, res, 400, error.message); 
    } 
} 

async function getServicioById(req, res) { 
    try { 
        const { error } = servicioIdSchema.validate(req.params); 
        if (error) return respondError(req, res, 400, error.message); 
        const [servicio, errorServicio] = await servicioService.getServicioById(req.params.id); 
        if (errorServicio) return respondError(req, res, 404, errorServicio); 
        respondSuccess(req, res, 200, servicio); 
    } catch (error) { 
        handleError(error, "servicio.controller -> getServicioById"); 
        respondError(req, res, 400, error.message); 
    } 
} 


async function getServiciosByMicroempresaId(req, res) {
    try {
        const { error } = servicioIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error.message);

        const [servicios, errorServicios] = await servicioService.getServiciosByMicroempresaId(req.params.id);
        if (errorServicios) return respondError(req, res, 404, errorServicios);

        servicios.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, servicios);
    } catch (error) {
        handleError(error, "servicio.controller -> getServiciosByMicroempresaId");
        respondError(req, res, 400, error.message);
    }
}
async function configurarPorcentajeAbono(req, res) {
    try {
        const { error } = servicioIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error.message);
        const { porcentajeAbono } = req.body;
        const [servicio, errorServicio] = await servicioService.configurarPorcentajeAbono(req.params.id, porcentajeAbono);
        if (errorServicio) return respondError(req, res, 404, errorServicio);
        respondSuccess(req, res, 200, servicio);
    } catch (error) {
        handleError(error, "servicio.controller -> configurarPorcentajeAbono");
        respondError(req, res, 400, error.message);
    }
}
async function calcularMontoAbono(req, res) { 
    try {
        const { error } = servicioIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error.message);
        const { precio, porcentajeAbono } = req.body;
        const [montoAbono, errorMontoAbono] = await servicioService.calcularMontoAbono(req.params.id, precio, porcentajeAbono);
        if (errorMontoAbono) return respondError(req, res, 404, errorMontoAbono);
        respondSuccess(req, res, 200, montoAbono);
    } catch (error) {
        handleError(error, "servicio.controller -> calcularMontoAbono");
        respondError(req, res, 400, error.message);
    }
}


//funcion para retornar el id de la microempresa por el id del servicio

async function getMicroempresaIdByServicioId(req, res) {
    try {
        const { error } = servicioIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error.message);
        const [idMicroempresa, errorMicroempresa] = await servicioService.getMicroempresaIdByServicioId(req.params.id);
        if (errorMicroempresa) return respondError(req, res, 404, errorMicroempresa);
        respondSuccess(req, res, 200, idMicroempresa);
    } catch (error) {
        handleError(error, "servicio.controller -> getMicroempresaIdByServicioId");
        respondError(req, res, 400, error.message);
    }
}


export default { 
    getServicios, 
    createServicio, 
    deleteServicio, 
    updateServicio, 
    getServicioById, 
    getServiciosByMicroempresaId, 
    configurarPorcentajeAbono, 
    calcularMontoAbono,
    getMicroempresaIdByServicioId

}; 
