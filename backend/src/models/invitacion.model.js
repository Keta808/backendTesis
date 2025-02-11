import mongoose from "mongoose";

const invitacionSchema = new mongoose.Schema(
  {
    idMicroempresa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Microempresa",
      required: true,
    },
    idTrabajador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Puede ser nulo si el usuario aún no está registrado
    },
    id_role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Evita que la misma persona reciba múltiples invitaciones activas
      lowercase: true,
      trim: true,
    },
    token: {
      type: String,
      required: true,
      unique: true, // Token único para validar la invitación
    },
    estado: {
      type: String,
      enum: ["pendiente", "aceptada", "expirada", "rechazada"],
      default: "pendiente",
    },
    fechaExpiracion: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // Expira en 24 horas
    },
  },
  { timestamps: true }, // Agrega createdAt y updatedAt automáticamente
);

export default mongoose.model("Invitacion", invitacionSchema);
