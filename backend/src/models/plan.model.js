"use strict"; 

import mongoose from "mongoose"; 


const PlanSchema = new mongoose.Schema({
    tipo_plan: {
        type: String, 
        required: true, 
    },
    precio: {
        type: Number, 
        required: true, 
    },
    mercadoPagoId: {
        type: String, // ID del plan de suscripción en Mercado Pago
        required: true,
        unique: true,
    }, 
    estado: {
        type: String,
        required: true,
    },
    fecha_creacion: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Plan = mongoose.model("Plan", PlanSchema);
export default Plan;
