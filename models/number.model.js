    import mongoose from "mongoose";

    export const NumberSchema = new mongoose.model("Number", new mongoose.Schema({
        newNumber: {
            freshNewNum: { type: Number, required: true, unique: true },
            remarksNew: { type: String, required: true },
            entryDate: {  type: String},
        },
        oldNumber: {
            freshOldNum: { type: Number, required: true, unique: true }, 
            remarksOld: { type: String, required: true },
            entryDate: { type: String,  },
        },
    }), 'numbers');
