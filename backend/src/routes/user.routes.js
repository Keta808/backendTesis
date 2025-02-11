"use strict";
// Importa el modulo 'express' para crear las rutas
import { Router } from "express";

/** Controlador de usuarios */
import usuarioController from "../controllers/user.controller.js";

/** Middlewares de autorización */
import { isAdmin, isTrabajador, isCliente } from "../middlewares/authorization.middleware.js";

/** Middleware de autenticación */
import authenticationMiddleware from "../middlewares/authentication.middleware.js";

/** Instancia del enrutador */
const router = Router();

// Define el middleware de autenticación para todas las rutas
router.use(authenticationMiddleware);
// Define las rutas para los usuarios
router.get("/", isAdmin, usuarioController.getUsers);
router.post("/createuser", isAdmin, usuarioController.createUser);
router.post("/createtrabajador", isAdmin, usuarioController.createTrabajador);
router.post("/createcliente", isAdmin, usuarioController.createCliente);
router.post("/", isAdmin, usuarioController.createAdministrador);
router.get("/:id", isAdmin, usuarioController.getUserById);
router.delete("/:id", isAdmin, usuarioController.deleteUser); 
router.get("/trabajador/:id", usuarioController.getTrabajadorById);
router.post("/trabajador/:id", usuarioController.updateTrabajador);

// Exporta el enrutador
export default router;
