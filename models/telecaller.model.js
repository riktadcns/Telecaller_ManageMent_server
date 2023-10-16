import mongoose from "mongoose";

export const Telecaller = new mongoose.model("Telecaller", new mongoose.Schema({
  userName: { type: String, required: true },
  password: { type: String, required: true },
  assignedNumbers: [{
    newNumbers: [
      {
        freshNewNum: [{ type: Number, ref: "Number" }],
        callHistory: [
          {
            callTime: { type: String },
            isInterested: { type: Boolean, default: false },
            purchase: { type: String, default: "N/A" },
            remarks: { type: String },
          },
        ],
      },
    ],
    oldNumbers: [
      {
        freshOldNum: [{ type: Number, ref: "Number" }],
        callHistory: [
          {
            callTime: { type: String },
            isInterested: { type: Boolean, default: false },
            purchase: { type: String, default: "N/A" },
            remarks: { type: String },
          },
        ],
      },
    ],
  }],
}), 'telecaller');