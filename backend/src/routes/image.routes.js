"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Controlador de imagenes */
import imageController from "../controllers/image.controller.js";

/** Middleware de imagenes */
import upload from "../middlewares/upload.middleware.js";

/** Middleware de autorización */
import { isAdmin, isTrabajador, isCliente } from "../middlewares/authorization.middleware.js";

/** Middleware de autentificacion */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);
// Define las rutas para las imagenes
router.post("/fotoPerfil", upload.single("fotoPerfil"), imageController.uploadFotoPerfil);
router.post("/portafolio", upload.array("imagenes", 5), imageController.uploadImagenes);
router.post("/eliminar", imageController.eliminarImagen);
router.post("/eliminarFotoPerfil", imageController.deleteFotoPerfil);

// router.delete("eliminar", isAdmin, imageController.eliminarImagen);

// Exporta el enrutador
export default router;
