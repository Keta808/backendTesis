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
      lowercase: true,
      trim: true,
    },
    codigoInvitacion: {
      type: String,
      required: true,
      unique: true, // Asegura que cada código sea único
    },
    estado: {
      type: String,
      enum: ["pendiente", "aceptada", "expirada", "rechazada"],
      default: "pendiente",
    },
    fechaExpiracion: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
    },
  },
  { timestamps: true } // Agrega createdAt y updatedAt automáticamente
);

export default mongoose.model("Invitacion", invitacionSchema);
