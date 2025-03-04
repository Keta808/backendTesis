/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable padded-blocks */
/* eslint-disable keyword-spacing */
/* eslint-disable require-jsdoc */
"use strict";
// Importa el objeto por defecto que contiene todos los modelos
import UserModels from "../models/user.model.js"; 

import bcrypt from "bcrypt";

// Extrae el modelo 'User'
const { User, Trabajador, Cliente, Administrador } = UserModels;


import { handleError } from "../utils/errorHandler.js";
import State from "../models/state.model.js";
/**
 * Obtiene todos los usuarios de la base de datos
 * @returns {Promise} Promesa con el objeto de los usuarios
 */
async function getUsers() {
  try {
    const users = await User.find()
      .select("-password")
      .exec();
    if (!users) return [null, "No hay usuarios"];

    return [users, null];
  } catch (error) {
    handleError(error, "user.service -> getUsers");
  }
}

/**
 * Crea un nuevo usuario en la base de datos
 * @param {Object} user Objeto de usuario
 * @returns {Promise} Promesa con el objeto de usuario creado
 */
async function createUser(user) {
  try {
    const { username, email, password, state } = user;

    const userFound = await User.findOne({ email: user.email });
    if (userFound) return [null, "El usuario ya existe"];

    const stateFound = await State.find({ name: { $in: state } });
    if (stateFound.length === 0) return [null, "El estado no existe"];
    const myState = stateFound.map((state) => state._id);

    const newUser = new User({
      username,
      email,
      password: await User.encryptPassword(password),
      state: myState,
    });
    await newUser.save();

    return [newUser, null];
  } catch (error) {
    handleError(error, "user.service -> createUser");
  }
}

/**
 * Cambia la contraseña de un usuario
 * @param {Object} email Correo del usuario
 * @param {Object} oldPassword Antigua contraseña del usuario
 * @param {Object} newPassword Nueva contraseña del usuario
 * @returns {Promise} Promesa con el objeto de usuario actualizado
 */
async function changePassword(userId, oldPassword, newPassword) {
  try {

    const userFound = await User.findById(userId);
    if (!userFound) {
      return [null, "Usuario no encontrado"];
    }

    // Verificar si la contraseña antigua es correcta
    const matchPassword = await User.comparePassword(oldPassword, userFound.password);
    if (!matchPassword) {
      return [null, "La contraseña actual no es correcta"];
    }

    // Hash de la nueva contraseña y actualización
    const salt = await bcrypt.genSalt(10);
    userFound.password = await bcrypt.hash(newPassword, salt);
    
    await userFound.save();
    
    return ["Contraseña actualizada con éxito", null];
  } catch (error) {
    handleError(error, "user.service -> changePassword");
    return [null, "Error al cambiar la contraseña"];
  }
}

/**
 * Crea un nuevo trabajador en la base de datos
 * 
 *
 */
async function createTrabajador(trabajador) {
  try {
    const { nombre, apellido, telefono, email, password, state } = trabajador;

    const userFound = await User.findOne({ email: trabajador.email });
    if (userFound) return [null, "El usuario ya existe"];

    const stateFound = await State.find({ name: { $in: state } });
    if (stateFound.length === 0) return [null, "El estado no existe"];
    const myState = stateFound.map((state) => state._id);

    // Crear el nuevo Trabajador
    const newTrabajador = new Trabajador({
      nombre,
      apellido,
      telefono,
      email,
      password: await User.encryptPassword(password),
      state: myState,
      isAdmin: false,    
    });

    // Guardar el nuevo Trabajador en la base de datos
    await newTrabajador.save();

    return [newTrabajador, null];
  } catch (error) {
    handleError(error, "user.service -> createTrabajador");
  }
}
async function getTrabajadorById(id) { 
  try {
    const trabajador = await Trabajador.findById({ _id: id })
      .select("-password")
      .populate("state")
      .exec();

    if (!trabajador) return [null, "El trabajador no existe"];
    console.log("SERVICES TRAB:", trabajador);
    return [trabajador, null];
  } catch (error) {
    handleError(error, "user.service -> getTrabajadorById");
  }
} 

async function getClienteById(id) {
  try {
    const cliente = await Cliente.findById({ _id: id })
      .select("-password")
      .populate("state")
      .exec();
    if (!cliente) return [null, "El cliente no existe"];
    return [cliente, null];
  }catch (error) {
    handleError(error, "user.service -> getClienteById");
  }
}
/**
 * Crea un nuevo administrador en la base de datos
 * 
 *
 */
async function createAdministrador(administrador) {
  try {
    const { nickname, email, password, state } = administrador;

    const userFound = await User.findOne({ email: administrador.email });
    if (userFound) return [null, "El usuario ya existe"];

    const stateFound = await State.find({ name: { $in: state } });
    if (stateFound.length === 0) return [null, "El estado no existe"];
    const myState = stateFound.map((state) => state._id);

    const newAdministrador = new Administrador({
      nickname,
      email,
      password: await User.encryptPassword(password),
      state: myState,
    });
    await newAdministrador.save();

    return [newAdministrador, null];
  }catch (error) {
    handleError(error, "user.service -> createAdministrador");
  }
}

/**
 * Crea un nuevo cliente en la base de datos
 * 
 * 
 */
async function createCliente(cliente) {
  try {
    const { nombre, apellido, email, password, state, telefono } = cliente;

    const userFound = await User .findOne({ email: cliente.email });
    if (userFound) return [null, "El usuario ya existe"];

    const stateFound = await State.find({ name: { $in: state } });
    if (stateFound.length === 0) return [null, "El estado no existe"];
    const myState = stateFound.map((state) => state._id);

    const newCliente = new Cliente({
      nombre,
      apellido,
      email,
      telefono,
      password: await User.encryptPassword(password),
      state: myState,
    });

    await newCliente.save();

    return [newCliente, null];
  }catch (error) {
    handleError(error, "user.service -> createCliente");
  }
}

/**
 * Obtiene un usuario por su id de la base de datos
 * @param {string} id Id del usuario
 * @returns {Promise} Promesa con el objeto de usuario
 */
async function getUserById(id) {
  try {
    const user = await User.findById({ _id: id })
      .select("-password")
      .populate("state")
      .exec();

    if (!user) return [null, "El usuario no existe"];

    return [user, null];
  } catch (error) {
    handleError(error, "user.service -> getUserById");
  }
}

async function deleteUser(id) {
  try {
    return await User.findByIdAndDelete(id);
  } catch (error) {
    handleError(error, "user.service -> deleteUser");
  }
} 

async function updateTrabajador(id, trabajador) {
  try {
    if(!id) return [null, "No se recibió el ID del trabajador"];
    const existingTrabajador = await Trabajador.findById(id).exec();
    if (!existingTrabajador) return [null, "El trabajador no existe"];

    // Reemplazar solo los datos que se envían en la solicitud
    if (trabajador.nombre) existingTrabajador.nombre = trabajador.nombre;
    if (trabajador.apellido) existingTrabajador.apellido = trabajador.apellido;
    if (trabajador.telefono) existingTrabajador.telefono = trabajador.telefono;
    if (trabajador.email) existingTrabajador.email = trabajador.email;

    // Guardar cambios manualmente
    await existingTrabajador.save();

    return [existingTrabajador, null];
  } catch (error) {
    handleError(error, "user.service -> updateTrabajador");
  }
}
async function updateCliente(id, cliente) {
  try {
    if (!id) return [null, "No se recibió el ID del cliente"];  
    const existingCliente = await Cliente.findById(id).exec();  
    if (!existingCliente) return [null, "El cliente no existe"];
    if(cliente.nombre) existingCliente.nombre = cliente.nombre;
    if(cliente.apellido) existingCliente.apellido = cliente.apellido;
    if(cliente.telefono) existingCliente.telefono = cliente.telefono;
    if(cliente.email) existingCliente.email = cliente.email;
    await existingCliente.save();
    return [existingCliente, null];
  } catch (error) {
    handleError(error, "user.service -> updateCliente");
  }
}

/**
 * Convierte un Cliente en Trabajador, manteniendo los mismos datos.
 * @param {string} id - ID del usuario Cliente
 * @returns {Array} - [NuevoTrabajador, null] si tuvo éxito, [null, error] si falló.
 */
async function userChange(id) {
  try {
      if (!id) return [null, "ID de usuario no proporcionado."];

      const user = await UserModels.Cliente.findById(id);
      if (!user) return [null, "El usuario (cliente) no existe."];

      // 📌 Verificar si ya existe como Trabajador
      const existingTrabajador = await UserModels.Trabajador.findOne({ email: user.email });
      if (existingTrabajador) return [existingTrabajador, null]; // Si ya existe, lo reutilizamos

      const newTrabajador = new UserModels.Trabajador({
          nombre: user.nombre,
          apellido: user.apellido,
          telefono: user.telefono,
          email: user.email,
          password: user.password,
          state: user.state,
          isAdmin: user.isAdmin,
      });

      await newTrabajador.save();
      console.log("✅ Usuario cambiado a Trabajador:", newTrabajador);

      return [newTrabajador, null];
  } catch (error) {
      console.error("❌ Error al cambiar el usuario a Trabajador:", error.message);
      handleError(error, "user.service -> userChange");
      return [null, error.message];
  }
}

async function updateTrabajadorIsAdmin(id, isAdminValue = true) {
  try {
    // Actualiza el campo isAdmin del trabajador
    const updatedTrabajador = await Trabajador.findByIdAndUpdate(
      id,
      { isAdmin: isAdminValue },
      { new: true },
    ).exec();
    return [updatedTrabajador, null];
  } catch (error) {
    handleError(error, "user.service -> updateTrabajadorIsAdmin");
    return [null, error.message];
  }
}

export default {
  getUsers,
  createUser,
  changePassword,
  createTrabajador,
  createAdministrador,
  createCliente,
  getUserById,
  deleteUser,
  getTrabajadorById,
  updateTrabajador,
  userChange,
  getClienteById,
  updateCliente,
  updateTrabajadorIsAdmin,
};
