import { NumberBoy } from "../models/numberBoy.model.js";
import { NumberSchema } from "../models/number.model.js";
import bcrypt from "bcryptjs"
import  jwt  from "jsonwebtoken";
import date from 'date-and-time';

export const NumberBoyController = {

    GenerateAccessToken: async (userName, password) =>
    {      
       if (!userName)
        {
            throw { code: 400, message: 'Invalid userName' }; 
        }
      if (!password)
       { 
        
           throw { code: 400, message: 'Invalid password' };
       }
       const existingNumberBoy = await NumberBoy.findOne({ userName: userName}).exec();
       if(!existingNumberBoy)
       {
         throw{code:400, message:'Invalid userName or Password'}
       }
       const isPasswordValid = await bcrypt.compare(password, existingNumberBoy.password);

       if (!isPasswordValid) {
         throw { code: 401, message: 'Invalid userName or Password' };
       }

       const accessTokenResponse = {
         id: existingNumberBoy._id,
         userName: existingNumberBoy.userName,
        
       };
   
       const accessToken = jwt.sign(
         accessTokenResponse,
         process.env.JWT_SECRET_KEY,
         {
           expiresIn:  "1d" 
         }
       );
       return {
         userName: existingNumberBoy.userName,
         accessToken: accessToken,

     }
},
createNewNum: async (freshNewNum, freshOldNum, remarksOld, remarksNew) => {
  try {
      const phoneNumberPattern = /^\d{10,}$/;
  
      if (!phoneNumberPattern.test(freshNewNum)) {
        throw { code: 400, message: "freshNewNum must be a valid phone number (including country code)" };
      }
  
      if (!phoneNumberPattern.test(freshOldNum)) {
        throw { code: 400, message: "freshOldNum must be a valid phone number (including country code)" };
      }

    const existingNumber = await NumberSchema.findOne({ newNumber: freshNewNum, oldNumber: freshOldNum });
    if (existingNumber) {
      throw { code: 409, message: "New Number Is Already Exist" };
    }

    if (!remarksOld || !remarksNew) {
      throw { code: 400, message: "Required fields are missing" };
    }

    
     function formatEntryDate(dateTime) {
      const date = new Date(dateTime);
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    }

    const number = new NumberSchema({
      newNumber: {
        freshNewNum,
        remarksNew,
        entryDate: formatEntryDate(new Date()),
      },
      oldNumber: {
        freshOldNum,
        remarksOld,
        entryDate: formatEntryDate(new Date()),
      },
    });

    await number.save();
    return number;
  } catch (error) {
    console.error(error);
    throw error;
  }
}


};
