"use strict";

import mongoose from 'mongoose';

const ValoracionSchema = new mongoose.Schema({
  microempresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Microempresa',
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  trabajador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trabajador',
    required: true
  },
  reserva: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reserva',
    required: true
  },
  puntuacion: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comentario: {
    type: String,
    maxlength: 500
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  }
});

const Valoracion = mongoose.model('Valoracion', ValoracionSchema);
export default Valoracion;
