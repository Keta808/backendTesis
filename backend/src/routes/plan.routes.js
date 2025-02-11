"use strict";

import express from "express";
import planController from "../controllers/plan.controller.js";
// import { verifyJWT } from "../middlewares/authentication.middleware.js";
// import { isTrabajador } from "../middlewares/authorization.middleware.js";
// import {verificarPlan} from "../middlewares/verificarplan.middleware.js";
import { isAdmin } from "../middlewares/authorization.middleware.js";
const router = express.Router();

// Rutas de planes
router.get("/", planController.getPlanes);
router.post("/", isAdmin, planController.createPlan);
router.delete("/:id", isAdmin, planController.deletePlan);
router.put("/:id", isAdmin, planController.updatePlan); 

router.post("/crear-plan-basico", isAdmin, planController.crearPlanBasico);
router.post("/crear-plan-premium", isAdmin, planController.crearPlanPremium);
router.post("/crear-plan-gratuito", isAdmin, planController.crearPlanGratuito); 

// Funciones MP 
router.post("/buscar-plan-suscripcion", planController.buscarPlanDeSuscripcion); 
router.get("/obtener-plan-suscripcion/:id", isAdmin, planController.obtenerPlanDeSuscripcion);
router.put("/actualizar-plan-suscripcion/:id", isAdmin, planController.actualizarPlanDeSuscripcion);
export default router;
