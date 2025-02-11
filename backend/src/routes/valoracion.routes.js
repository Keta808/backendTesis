import { Router } from "express";
import valoracionController from "../controllers/valoracion.controller.js";
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

const router = Router();

// Aplica middleware de autenticación a todas las rutas
router.use(authenticationMiddleware);

// Obtener valoraciones por microempresa
router.get("/microempresa/:microempresaId", valoracionController.getValoracionesPorMicroempresa);

// Obtener valoraciones por trabajador
router.get("/trabajador/:trabajadorId", valoracionController.getValoracionesPorTrabajador);

// Crear una nueva valoración
router.post("/", valoracionController.crearValoracion);

// Eliminar una valoración por ID
router.delete("/:valoracionId", valoracionController.eliminarValoracion);

// Obtener valoración promedio de una microempresa
router.get("/microempresa/:microempresaId/promedio", valoracionController.getValoracionPromedioPorMicroempresa);

// verificar si existe una valoracion para una reserva
router.get("/reserva/:reservaId", valoracionController.existeValoracionPorReserva);

export default router;
