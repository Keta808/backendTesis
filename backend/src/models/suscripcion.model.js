import mongoose from "mongoose";

const suscripcionSchema = new mongoose.Schema({
    idUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
    idPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true,
    },
    estado: {
        type: String,
        enum: ["authorized", "paused", "cancelled", "pending", "expired"],
        default: "pending",
    },
    preapproval_id: {
        type: String,
        required: true,
    },
    cardTokenId: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Suscripcion = mongoose.model("Suscripcion", suscripcionSchema);
export default Suscripcion; 
