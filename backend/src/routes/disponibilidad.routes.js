
import { Router } from "express";

import disponibilidadController from "../controllers/disponibilidad.controller.js";

import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

router.use(authenticationMiddleware);

//get disponibilidad por id del trabajador
router.get("/:id", disponibilidadController.getDisponibilidadByTrabajador);
router.post("/", disponibilidadController.createDisponibilidad);
router.put("/:id", disponibilidadController.updateDisponibilidad);
router.delete("/:id", disponibilidadController.deleteDisponibilidad);
router.post('/horarios-disponibles', disponibilidadController.getHorariosDisponibles);
router.post('/horarios-microempresa', disponibilidadController.getHorariosDisponiblesMicroEmpresa);
router.post("/disponibilidad/por-hora", disponibilidadController.getTrabajadoresDisponiblesPorHora);
router.post("/disponibilidad/por-dia", disponibilidadController.getDiasSinHorario);
export default router;