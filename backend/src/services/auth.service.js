"use strict";

/** Modelo de datos 'User' */
import UserModels from "../models/user.model.js";
const { User, Trabajador, Cliente, Administrador } = UserModels; 

/** Modulo 'jsonwebtoken' para crear tokens */
import jwt from "jsonwebtoken";

import { ACCESS_JWT_SECRET, REFRESH_JWT_SECRET } from "../config/configEnv.js";

import { handleError } from "../utils/errorHandler.js";

/**
 * Inicia sesión con un usuario.
 * @async
 * @function login
 * @param {Object} user - Objeto de usuario
 */
async function login(user) {
  try {
    const { email, password } = user;
      //  Buscar en la misma colección `User` con filtro explícito de `kind`
    const userFoundTrabajador = await User.findOne({ email, kind: "Trabajador" }).exec(); 
    

    // Buscar también en Cliente
    const userFoundCliente = await User.findOne({ email, kind: "Cliente" }).exec(); 
    

    let kind = "Cliente"; 
    let userFound = userFoundCliente; // Por defecto, el usuario es Cliente

    if (userFoundTrabajador) {
      kind = "Trabajador"; // Si existe en Trabajador, es Trabajador
      userFound = userFoundTrabajador;
    } 

    if (!userFound) {
      userFound = await User.findOne({ email, kind: "Administrador" }).exec();
      kind = "Administrador";
    }

    if (!userFound) {
      return [null, null, "El usuario y/o contraseña son incorrectos"];
    }


    const matchPassword = await User.comparePassword(
      password,
      userFound.password,
    );

    if (!matchPassword) {
      return [null, null, "El usuario y/o contraseña son incorrectos"];
    }

    const accessToken = jwt.sign(
      { email: userFound.email, kind, id: userFound._id },
      ACCESS_JWT_SECRET,
      {
        expiresIn: "1d",
      },
      // console.log( email + " ha iniciado sesión" ),
      // console.log( "kind: " + userFound.kind ),

    );

    const refreshToken = jwt.sign(
      { email: userFound.email },
      REFRESH_JWT_SECRET,
      {
        expiresIn: "7d", // 7 días
      },
    );
    
    return [accessToken, refreshToken, null, kind, userFound];
  } catch (error) {
    handleError(error, "auth.service -> signIn");
  }
}

/**
 * Refresca el token de acceso
 * @async
 * @function refresh
 * @param {Object} cookies - Objeto de cookies
 */
async function refresh(cookies) {
  try {
    if (!cookies.jwt) return [null, "No hay autorización"];
    const refreshToken = cookies.jwt;

    const accessToken = await jwt.verify(
      refreshToken,
      REFRESH_JWT_SECRET,
      async (err, user) => {
        if (err) return [null, "La sesion a caducado, vuelva a iniciar sesion"];

        const userFound = await User.findOne({
          email: user.email,
        })
          .populate("roles")
          .exec();

        if (!userFound) return [null, "No usuario no autorizado"];

        const accessToken = jwt.sign(
          { email: userFound.email, roles: userFound.roles },
          ACCESS_JWT_SECRET,
          {
            expiresIn: "1d",
          },
        );

        return [accessToken, null];
      },
    );

    return accessToken;
  } catch (error) {
    handleError(error, "auth.service -> refresh");
  }
}

export default { login, refresh };
