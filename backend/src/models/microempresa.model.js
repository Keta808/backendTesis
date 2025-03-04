"use strict";
import CATEGORIA from "../constants/categoria.constants.js";
import mongoose from "mongoose";

const MicroempresaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,  
    },
    telefono: {
        type: String,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    categoria: {
        type: String,
        enum: CATEGORIA,
        required: true,
    },
    idSuscripcion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Suscripcion",
        required: false, // Cambiar a true (cuando este listo)
    },
    idTrabajador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        Unique: true,
    },
    trabajadores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
    ],
    fotoPerfil: {
        url: {
            type: String,
            required: false,
        },
        public_id: {
            type: String,
            required: false,
        },
    },
    imagenes: [
        {
            url: {
                type: String,
                required: false,
            },
            public_id: {
                type: String,
                required: false,
            },
        },
    ],
});

const Microempresa = mongoose.model("Microempresa", MicroempresaSchema);
export default Microempresa;
