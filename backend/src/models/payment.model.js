import { mongoose } from "mongoose";

const paymentSchema = new mongoose.Schema({
    idServicio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Servicio",
        required: true,
    }, 
    idCliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    payer_email: {
        type: String,
        required: true,
    },
    payer_id: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
        unique: true,
        required: true,
    }, 
    monto: 
    {
        type: Number,
        required: true,
    }, 
    state: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
        required: true,
    },
}); 
const Payment = mongoose.model("Payment", paymentSchema); 
export default Payment;
