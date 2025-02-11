/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable padded-blocks */
/* eslint-disable keyword-spacing */
/* eslint-disable require-jsdoc */
"use strict";
// Importa el objeto por defecto que contiene todos los modelos
import UserModels from "../models/user.model.js"; 

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
async function changePassword(email, oldPassword, newPassword) {
  try {
    const userFound = await User.findOne({ email: email });
    if (!userFound) {
      throw new Error('User not found');
    }
    const matchPassword = await User.comparePassword(
      oldPassword,
      userFound.password,
    );
    if (!matchPassword) {
      return [null, "La contraseña no coincide"];
    }
    // Hash the new password and update the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    userFound.password = hashedPassword;

    await userFound.save();

    return [userFound, null];
  } catch (error) {
    handleError(error, "user.service -> changePassword");
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
};
