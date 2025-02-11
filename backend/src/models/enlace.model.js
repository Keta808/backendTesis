"use strict";
import mongoose from "mongoose";

const enlaceSchema = new mongoose.Schema(
    {
        id_trabajador: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // modificar el modelo de role.model.js
        id_role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },
        id_microempresa: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Microempresa",
            required: true,
        },
        fecha_inicio: {
            type: Date,
            required: true,
        },
        fecha_termino: {
            type: Date,
            required: false,
        },
        estado: {
            type: Boolean,
            required: true,
        },
    },
);

// Middleware para asignar la fecha de término automáticamente cuando el estado cambia a false
enlaceSchema.pre("save", function (next) {
    // Verifica si el estado fue modificado
    if (!this.isModified("estado")) return next();

    // Asigna la fecha actual si el estado cambia a false y no tiene fecha_termino
    if (this.estado === false && !this.fecha_termino) {
        this.fecha_termino = new Date();
    }
    next();
});

// Middleware adicional para actualizaciones directas con métodos como findOneAndUpdate
enlaceSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();

    // Si el estado cambia a false, asigna la fecha actual a fecha_termino
    if (update.estado === false && !update.fecha_termino) {
        this.setUpdate({
            ...update,
            fecha_termino: new Date(),
        });
    }
    next();
});

const Enlace = mongoose.model("Enlace", enlaceSchema);

export default Enlace;


