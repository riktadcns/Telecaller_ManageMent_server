import { SubAdmin } from "../models/subadmin.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

export const SubadminController = {
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
       const existingSubAdmin = await SubAdmin.findOne({ userName: userName}).exec();
       if(!existingSubAdmin)
       {
         throw{code:400, message:'Invalid userName or Password'}
       }
       const isPasswordValid = await bcrypt.compare(password, existingSubAdmin.password);

  if (!isPasswordValid) {
    throw { code: 401, message: 'Invalid userName or Password' };
  }
       const accessTokenResponse = {
         id: existingSubAdmin._id,
         userName: existingSubAdmin.userName,
        
       };
   
       const accessToken = jwt.sign(
         accessTokenResponse,
         process.env.JWT_SECRET_KEY,
         {
           expiresIn:  "1d" 
         }
       );
       return {
         userName: existingSubAdmin.userName,
         accessToken: accessToken,

     }
},
}