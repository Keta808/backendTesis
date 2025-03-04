/* eslint-disable quotes */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
"use strict";

import { respondSuccess, respondError } from "../utils/resHandler.js";
import planService from "../services/plan.service.js";
import { planBodySchema, planIdSchema } from "../schema/plan.schema.js";
import { handleError } from "../utils/errorHandler.js";

async function getPlanes(req, res) {
    try {
        const [planes, errorPlanes] = await planService.getPlanes();
        if (errorPlanes) return respondError(req, res, 404, errorPlanes);

        planes.length === 0
            ? respondSuccess(req, res, 204)
            : respondSuccess(req, res, 200, planes);
    } catch (error) {
        handleError(error, "plan.controller -> getPlanes");
        respondError(req, res, 400, error.message);
    }
}
async function createPlan(req, res) {
    try {
        // Validar el cuerpo de la petición
        const { error } = planBodySchema.validate(req.body);
        if (error) return respondError(req, res, 400, error.message);

        // Crear el plan y pasar el usuario (trabajador) autenticado
        const [newPlan, errorPlan] = await planService.createPlan(req.body, req.user);
        if (errorPlan) return respondError(req, res, 400, errorPlan);

        respondSuccess(req, res, 201, newPlan);
    } catch (error) {
        handleError(error, "plan.controller -> createPlan");
        respondError(req, res, 400, error.message);
    }
}

async function deletePlan(req, res) {
    try {
        const { error } = planIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error.message);

        const [plan, errorPlan] = await planService.deletePlan(req.params.id);
        if (errorPlan) return respondError(req, res, 400, errorPlan);

        respondSuccess(req, res, 200, plan);
    } catch (error) {
        handleError(error, "plan.controller -> deletePlan");
        respondError(req, res, 400, error.message);
    }
}

async function updatePlan(req, res) {
    try {
        const { error } = planIdSchema.validate(req.params);
        if (error) return respondError(req, res, 400, error.message);
        const { error: errorBody } = planBodySchema.validate(req.body);
        if (errorBody) return respondError(req, res, 400, errorBody.message);
        const [updatedPlan, errorPlan] = await planService.updatePlan(req.params.id, req.body);
        if (errorPlan) return respondError(req, res, 400, errorPlan);
        respondSuccess(req, res, 200, updatedPlan);
    } catch (error) {
        handleError(error, "plan.controller -> updatePlan");
        respondError(req, res, 400, error.message);
    }
}

async function crearPlanBasico(req, res) {
    try {
        const response = await planService.crearPlanBasico();
        respondSuccess(req, res, 201, response);
    } catch (error) {
        handleError(error, "plan.controller -> crearPlanBasico");
        respondError(req, res, 500, "Error al crear plan básico.");
    }
}
async function crearPlanPremium(req, res) {
    try {
        const response = await planService.crearPlanPremium();
        respondSuccess(req, res, 201, response);
    } catch (error) {
        handleError(error, "plan.controller -> crearPlanPremium");
        respondError(req, res, 500, "Error al crear plan premium.");
    }
}

async function crearPlanGratuito(req, res) {
    try {
        const response = await planService.crearPlanGratuito();
        respondSuccess(req, res, 201, response);
    } catch (error) {
        handleError(error, "plan.controller -> crearPlanGratuito");
        respondError(req, res, 500, "Error al crear plan gratuito.");
    }
} 

async function buscarPlanDeSuscripcion(req, res) {
    try {
        const params = req.query;
        console.log("CONTROLLER BUSCAR PLAN: Datos recibidos en el controller:", params);
        // Llamada al servicio para buscar plan de suscripción
        const plan = await suscripcionService.buscarPlanDeSuscripcion(params);
        return respondSuccess(res, plan, 200);
    } catch (error) {
        console.error(`Error en buscarPlanDeSuscripcion:`, error.message);
        return respondError(req, res, 500, "Error al buscar plan de suscripción", error);
    }
}   
async function obtenerPlanDeSuscripcion(req, res) {
    try {
        const planId = req.params.id;
        console.log("CONTROLLER OBTENER PLAN: Datos recibidos en el controller:", planId);
        // Llamada al servicio para obtener plan de suscripción
        const plan = await suscripcionService.obtenerPlanDeSuscripcion(planId);
        return respondSuccess(res, plan, 200);
    } catch (error) {
        console.error(`Error en obtenerPlanDeSuscripcion:`, error.message);
        return respondError(req, res, 500, "Error al obtener plan de suscripción", error);
    }
} 
async function actualizarPlanDeSuscripcion(req, res) {
    try {
        const planId = req.params.id;
        const plan = req.body;
        console.log("CONTROLLER ACTUALIZAR PLAN: Datos recibidos en el controller:", planId, plan);
        // Llamada al servicio para actualizar plan de suscripción
        const updatedPlan = await suscripcionService.actualizarPlanDeSuscripcion(planId, plan);
        return respondSuccess(res, updatedPlan, 200);
    } catch (error) {
        console.error(`Error en actualizarPlanDeSuscripcion:`, error.message);
        return respondError(req, res, 500, "Error al actualizar plan de suscripción", error);
    }
}

export default { getPlanes, createPlan, deletePlan, updatePlan, crearPlanBasico, crearPlanPremium, crearPlanGratuito, buscarPlanDeSuscripcion, obtenerPlanDeSuscripcion, actualizarPlanDeSuscripcion };
