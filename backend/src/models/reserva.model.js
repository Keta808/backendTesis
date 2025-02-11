"use strict";

import mongoose from "mongoose";

const ReservaSchema = new mongoose.Schema({
    hora_inicio: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date, // Campo para la fecha de la reserva
        required: true,
    },
    cliente: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    trabajador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    servicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Servicio", // Referencia al modelo de servicio
        required: true,
    },
    duracion: {
        type: Number,
        required: true,
    },
    estado: {
        type: String,
        enum: ['Activa', 'Cancelada', 'Finalizada'],
        required: true,
    },
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    versionKey: false,
});



const Reserva = mongoose.model("Reserva", ReservaSchema);
export default Reserva; 
