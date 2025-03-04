import { Router } from 'express';

import horarioController from '../controllers/horario.controller.js';

import authenticationMiddleware from '../middlewares/authentication.middleware.js';

const router = Router();

router.use(authenticationMiddleware);

// Actualiza los bloques de un día
router.put("/actualizar-bloques", horarioController.updateBloquesByDia);

// Obtener horarios por ID de trabajador
router.get('/trabajador/:trabajadorId', horarioController.getHorariosByTrabajador);

// Obtener días sin horarios del trabajador
router.get('/trabajador/:trabajadorId/dias-sin-horario', horarioController.getDiasSinHorario);

// Obtener horas disponibles del trabajador
router.get('/trabajador/:trabajadorId/horas-disponibles', horarioController.getHorasDisponibles);

// Obtener horarios por ID de microempresa
router.get('/disponibilidad-microempresa', horarioController.getDisponibilidadMicroEmpresa);


// Crear un nuevo horario
router.post('/', horarioController.createHorario);

// Eliminar un horario por ID
router.delete('/:horarioId', horarioController.deleteHorarioById);




export default router;