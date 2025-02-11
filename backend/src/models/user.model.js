/* eslint-disable comma-spacing */
/* eslint-disable no-multi-spaces */
/* eslint-disable quotes */
"use strict";
// Import the 'mongoose' module to create the database connection

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const options = { discriminatorKey: "kind",versionKey: false };


const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,      
    },
    password: {
      type: String,
      required: true,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,  // Asegúrate de que esto sea correcto
      ref: "State",  // Este es el nombre del modelo que has exportado
    }, 
    },
    options,
);

/** Encrypts the user's password */
userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/** Compares the user's password */
userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

/** 'User' data model */
const User = mongoose.model("User", userSchema);


const Trabajador = User.discriminator('Trabajador', new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },

}, options));

const Administrador = User.discriminator('Administrador', new mongoose.Schema({
  
  nickname: {
    type: String,
    required: true,
  },

}, options));

const Cliente = User.discriminator('Cliente', new mongoose.Schema({
  
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: true,
  },
}, options));


export default { User, Trabajador, Administrador, Cliente }; 
