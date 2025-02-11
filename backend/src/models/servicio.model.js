/* eslint-disable quotes */
"use strict";

import mongoose from "mongoose"; 

const ServicioSchema = new mongoose.Schema({ 
    idMicroempresa: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Microempresa", 
        required: true, 
    },
    nombre: {
        type: String,
        required: true,
    },
    precio: {
        type: Number,
        required: true,
    },
    duracion: {
        // en minutos
        type: Number,
        required: true,
        min: 1,
    },
    descripcion: {
        type: String,
        required: true,
    }, 
    porcentajeAbono: {
        type: Number,
        min: 0,
        max: 100,
    },
    },   
);
const Servicio = mongoose.model("Servicio", ServicioSchema); 
export default Servicio; 
