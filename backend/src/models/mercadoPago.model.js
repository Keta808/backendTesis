import mongoose from "mongoose"; 

const MercadoPagoAccSchema = new mongoose.Schema({
    idMicroempresa: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Microempresa",
        required: true,
    },
    accessToken: {
      type: String,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    mercadopagoUserId: {
      type: String,
      default: null,
    },
    public_key: {
      type: String,
      default: null,
    },
    mercadopagoAccountStatus: {
      type: String,
      enum: ["pending", "active", "rejected"],
      default: "active",
    },
    fechaExpiracion: {
      type: Date,
      default: null,
    },
  }); 

const MercadoPagoAcc = mongoose.model("MercadoPagoAcc", MercadoPagoAccSchema);
export default MercadoPagoAcc;  

