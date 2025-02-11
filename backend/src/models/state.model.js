"use strict";
import mongoose from "mongoose";

const stateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

const State = mongoose.model("State", stateSchema);

export default State;
