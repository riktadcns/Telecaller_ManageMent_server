import mongoose from "mongoose";

export const Admin = new mongoose.model("SuperAdmin", new mongoose.Schema({
    userName:  { type: String, required: true },
    password:   { type: String, required: true },
    email: {type:String, require: true},
    tokens: {
        ResetPassword: { type: String },
      },
}), 'SuperAdmin');