/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
import Servicio from "../models/servicio.model.js"; 


import { handleError } from "../utils/errorHandler.js"; 


async function getServicios() { 
    try { 
        const servicios = await Servicio.find().exec(); 
        if (!servicios) return [null, "No hay servicios"]; 
        return [servicios, null]; 
    } catch (error) { 
        handleError(error, "servicio.service -> getServicios"); 
    } 
} 

async function createServicio(servicio) { 
    try { 
        const { idMicroempresa, nombre, precio, duracion, descripcion, porcentajeAbono } = servicio; 
       const servicioFound = await Servicio.findOne({ nombre: servicio.nombre });
           if (servicioFound) return [null, "El servicio ya existe"]; 
        const newServicio = new Servicio({
            idMicroempresa, 
            nombre, 
            precio, 
            duracion, 
            descripcion,
            porcentajeAbono: porcentajeAbono || 0, 
        }); 
        await newServicio.save(); 
        return [newServicio, null]; 
    } catch (error) { 
        handleError(error, "servicio.service -> createServicio"); 
    } 
} 

async function deleteServicio(id) { 
    try { 
        const servicio = await Servicio.findByIdAndDelete(id).exec(); 
        if (!servicio) return [null, "El servicio no existe"]; 
        return [servicio, null]; 
    } catch (error) { 
        handleError(error, "servicio.service -> deleteServicio"); 
    } 
} 

async function updateServicio(id, servicio) { 
    try { 
        const { idMicroempresa, nombre, precio, duracion, descripcion, porcentajeAbono } = servicio; 
        const updatedServicio = await Servicio.findByIdAndUpdate(id, { 
            idMicroempresa,
            nombre, 
            precio, 
            duracion, 
            descripcion,
            porcentajeAbono: porcentajeAbono || 0, 
        }, { new: true }).exec(); 
        if (!updatedServicio) return [null, "El servicio no existe"]; 
        return [updatedServicio, null]; 
    } catch (error) { 
        handleError(error, "servicio.service -> updateServicio"); 
    } 
} 

async function getServicioById(id) { 
    try { 
        const servicio = await Servicio.findById(id).exec();
        if (!servicio) return [null, "El servicio no existe"];
        return [servicio, null];
    } catch (error) {
        handleError(error, "servicio.service -> getServicioById");
    }
}

async function getServiciosByMicroempresaId(id) {
    try {
        const servicios = await Servicio.find({ idMicroempresa: id }).exec();
        if (!servicios) return [null, "No hay servicios"];
        return [servicios, null];
    } catch (error) {
        handleError(error, "servicio.service -> getServiciosByMicroempresaId");
    }
}

async function configurarPorcentajeAbono(id, porcentajeAbono) {
    try {
        const servicio = await Servicio.findById(id).exec();
        if (!servicio) return [null, "El servicio no existe"];
        servicio.porcentajeAbono = porcentajeAbono;
        await servicio.save();
        return [servicio, null];
    } catch (error) {
        handleError(error, "servicio.service -> configurarPorcentajeAbono");
    }
} 

async function calcularMontoAbono(id, precio, porcentajeAbono) {
    try {
        const servicio = await Servicio.findById(id).exec();
        if (!servicio) return [null, "El servicio no existe"];
        if (porcentajeAbono < 0 ) return [null, "Debes configurar el porcentaje de abono antes de realizar esta accion."];
        const porcentajeDecimal = porcentajeAbono / 100;
        const montoAbono = precio * porcentajeDecimal;
        return [montoAbono, null];
    } catch (error) {
        handleError(error, "servicio.service -> calcularMontoAbono");
    }
}
export default { getServicios, createServicio, deleteServicio, updateServicio, getServicioById, getServiciosByMicroempresaId, configurarPorcentajeAbono, calcularMontoAbono };
