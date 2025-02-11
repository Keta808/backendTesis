"use strict";
// Importa el módulo 'express' para crear las rutas
import { Router } from "express";

/** Controlador de invitaciones */
import InvitacionController from "../controllers/invitacion.controller.js";

/** Middleware de autenticación */
import verifyJWT from "../middlewares/authentication.middleware.js";

/** Middleware de suscripción */
import suscripcionMiddleware from "../middlewares/verificarSuscripcion.middleware.js"; 

/** Instancia del enrutador */
const router = Router();

// Aplica el middleware de autenticación a todas las rutas
router.use(verifyJWT);

// 📌 Ruta para enviar una invitación (solo dueños con plan premium)
router.post(
    "/enviar",
    // suscripcionMiddleware.verificarSuscripcion,
    // suscripcionMiddleware.isPlanPremium,
    InvitacionController.enviarInvitacion, // <== Aquí está el cambio
);

// 📌 Ruta para aceptar una invitación

// router.post("/aceptar/:id", InvitacionController.aceptarInvitacion);
router.post("/aceptar-invitacion/:token", InvitacionController.aceptarInvitacion);
// 📌 Ruta para rechazar una invitación
router.post("/rechazar/:token", InvitacionController.rechazarInvitacion);
// 📌 Ruta para obtener invitaciones pendientes de una microempresa
router.get(
    "/pendientes/:idMicroempresa",
    InvitacionController.obtenerInvitaciones,
);

// Exporta el enrutador
export default router;

