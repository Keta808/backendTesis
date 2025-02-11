/* eslint-disable quotes */
import suscripcionController from '../controllers/suscripcion.controller.js'; 
// AGREGAR MIDDLEWARES

import express from 'express'; 

const router = express.Router(); 
// rutas para suscripciones - BD
router.post('/crear-suscripcion', suscripcionController.crearSuscripcion);
router.get('/suscripciones', suscripcionController.getSuscripciones);
router.get('/suscripcion/:id', suscripcionController.getSuscripcion);
router.delete('/:id', suscripcionController.deleteSuscripcion);
router.put('/:id', suscripcionController.updateSuscripcion);

router.put('/update-suscripcionCard/:id', suscripcionController.updateCardTokenByUserId); 

// rutas para mercadopago
router.get('/emisoras', suscripcionController.getIssuers);
router.get('/Id-Types', suscripcionController.getIdentificationTypes); 
router.post('/cardForm', suscripcionController.cardForm);
router.post('/obtenerSuscripcion', suscripcionController.obtenerSuscripcion);
router.get('/buscar-suscripcion', suscripcionController.searchSuscripcionMP);
router.get('/buscar-suscripcion/:id', suscripcionController.getSuscripcionById);

router.put('/update-suscripcion/:id', suscripcionController.updateSuscripcionMP);
router.get('/datos-suscripcion/:idUser', suscripcionController.getUserSubscription);

router.post('/new-suscripcionCard/:preapprovalId', suscripcionController.updateSuscripcionCard);
router.post('/cancelar-suscripcion', suscripcionController.cancelarSuscripcion);
// Sincronizar estados con Job
router.get('/sincronizar-estados', suscripcionController.sincronizarEstados); 
router.put('/userChange/:id', suscripcionController.userChange);

export default router; 
