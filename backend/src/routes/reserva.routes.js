"use strict";

import { Router } from "express";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Middlewares de autorización */
import { isAdmin, isTrabajador, isCliente } from "../middlewares/authorization.middleware.js";

/** Controlador de reservas */
import reservaController from "../controllers/reserva.controller.js";


const router = Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);

// Define las rutas para las reservas
//router.get("/", isAdmin, reservaController.getReservas);
router.get("/trabajador/:id", reservaController.getReservasByTrabajador);
router.post("/", reservaController.createReserva);
router.delete("/:id", reservaController.deleteReserva);
router.put("/:id", reservaController.updateReserva);
router.put("/cancelar/:id", reservaController.cancelReserva);
router.get("/cliente/:id", reservaController.getReservasByCliente);
router.put("/finalizar/:id", reservaController.finalizarReserva);   // Actualiza el estado de la reserva a finalizada

router.get("/horas/trabajador/:workerId/:date", reservaController.getReservasPorFechaTrabajador);  // Obtiene las reservas activas de un trabajador en una fecha determinada
router.get("/horas/microempresa/:serviceId/:date", reservaController.getReservasPorFechaMicroempresa);  // Obtiene las reservas activas de la microempresa en una fecha determinada
// Exporta el enrutador

export default router;
