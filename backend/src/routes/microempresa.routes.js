"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Controlador de microempresas */
import microempresaController from "../controllers/microempresa.controller.js";

/** Middleware de autorización */
import { isAdmin, isTrabajador, isCliente } from "../middlewares/authorization.middleware.js";

/** Middleware de autentificacion */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);
// Define las rutas para las microempresas
router.get("/", microempresaController.getMicroempresas);
router.get("/fotoPerfil/:id", microempresaController.getMicroempresaFotoPerfil);
router.get("/page/:page/limit/:limit", isTrabajador, microempresaController.getMicroempresasForPage);
router.get("/:id", microempresaController.getMicroempresaById);
// router.get("/nombre/:nombre", isAdmin, microempresaController.getMicroempresaByNombre);
router.post("/", microempresaController.createMicroempresa);
router.put("/:id", microempresaController.updateMicroempresaById);
router.delete("/:id", microempresaController.deleteMicroempresaById);
router.get("/categoria/:categoria", microempresaController.getMicroempresasPorCategoria);
router.get("/user/:trabajadorId", microempresaController.getMicroempresasByUser);
router.get("/user/:trabajadorId/id", microempresaController.getMicroempresaIdByTrabajadorId);

// Exporta el enrutador
export default router;
