import mongoose from "mongoose";

export const NumberBoy = new mongoose.model("NumberBoy", new mongoose.Schema({
    userName: { type: String, required: true },
    password: {type: String, required: true },
   
}), 'numberBoy');