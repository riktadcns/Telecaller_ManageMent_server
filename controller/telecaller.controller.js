import { Telecaller } from "../models/telecaller.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

export const TelecallerController = {
  GenerateAccessToken: async (userName, password) => {
    if (!userName || !password) {
        throw { code: 400, message: 'Invalid credentials' };
    }

    const existingTeleCaller = await Telecaller.findOne({ userName: userName }).exec();

    if (!existingTeleCaller) {
        throw { code: 400, message: 'Invalid credentials' };
    }
    const isPasswordValid = await bcrypt.compare(password, existingTeleCaller.password);

  if (!isPasswordValid) {
    throw { code: 401, message: 'Invalid userName or Password' };
  }

    const accessToken = jwt.sign(
        { id: existingTeleCaller._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1d' }
    );

    return {
        userName: existingTeleCaller.userName,
        accessToken: accessToken,
    };
},
updateNumberAfterCall: async (telecallerUserName, phoneNumber, isInterested, purchase, remarks) => {
  try {
    const telecaller = await Telecaller.findOne({ userName: telecallerUserName }).exec();
    if (!telecaller) {
      throw { code: 404, message: "Telecaller not found" };
    }

    if (!remarks) {
      throw { code: 400, message: "Remarks field is required" };
    }

    if (typeof isInterested !== 'boolean') {
      throw { code: 400, message: "isInterested field must be a boolean" };
    }

    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString();
    let numberToUpdateContainer = null;

    for (const numberSet of telecaller.assignedNumbers) {
      for (const numberContainer of numberSet.newNumbers) {
        for (const number of numberContainer.freshNewNum) {
          if (number == phoneNumber) {
            numberToUpdateContainer = numberContainer;
            break;
          }
        }
      }
    }

    if (!numberToUpdateContainer) {
      for (const numberSet of telecaller.assignedNumbers) {
        for (const numberContainer of numberSet.oldNumbers) {
          for (const number of numberContainer.freshOldNum) {
            if (number == phoneNumber) {
              numberToUpdateContainer = numberContainer;
              break;
            }
          }
        }
      }
    }

    if (!numberToUpdateContainer) {
      throw { code: 404, message: "Number not found" };
    }
    
    if (!numberToUpdateContainer.callHistory) {
      numberToUpdateContainer.callHistory = [];
    }

    numberToUpdateContainer.callHistory.push({
      callTime: formattedTime,
      isInterested,
      purchase,
      remarks
    });

    await telecaller.save();

    const purchaseStatus = purchase ? "Purchased" : "Not Purchased";

    return `Number record updated after the call. Purchase Status: ${purchaseStatus}`;
  } catch (error) {
    console.error(error);
    throw error;
  }
}



}