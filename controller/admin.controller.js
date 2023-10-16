import { Admin } from "../models/admin.model.js";
import bcrypt from "bcryptjs"
import crypto from "crypto"
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { NumberBoy } from "../models/numberBoy.model.js";
import { Telecaller } from "../models/telecaller.model.js";
import { SubAdmin } from "../models/subadmin.models.js";
import { NumberSchema } from "../models/number.model.js";


export const AdminController = {
    // // admin create
    // createAdmin: async(data)=>{
    //     const existingAdmin = await Admin.findOne({userName: data.userName})
    //     console.log(existingAdmin)
    //     if(existingAdmin)
    //     {
    //         throw({code:409, message:"Admin Already Exist"})
    //     }
    //     if(!data.userName)
    //     {
    //         throw({message:"userName Is Required" })
    //     }
    //     if(!data.password)
    //     {
    //         throw({message:"Password Is Required"})
    //     }
    //      const Passwordsalt = await bcrypt.genSalt();
    //      const encryptedPassword = await bcrypt.hash(data.password, Passwordsalt);
    //      const newAdmin = new Admin({
    //             userName: data.userName,
    //             password: encryptedPassword,
                
    //         });
    //         console.log(newAdmin)
    //         newAdmin.save().catch((err) => {
    //             console.error(err);
    //             throw { code: 500, message: "Failed to save user" };
    //         });
    
    // },

    // admin login
    
GenerateAccessToken: async (userName, password) => {
  if (!userName) {
    throw { code: 400, message: 'Invalid userName' };
  }
  if (!password) {
    throw { code: 400, message: 'Invalid password' };
  }
  const existingAdmin = await Admin.findOne({ userName: userName });

  if (!existingAdmin) {
    throw { code: 400, message: 'Invalid userName or Password' };
  }
  const isPasswordValid = await bcrypt.compare(password, existingAdmin.password);

  if (!isPasswordValid) {
    throw { code: 401, message: 'Invalid userName or Password' };
  }
  const accessTokenResponse = {
    id: existingAdmin._id,
    userName: existingAdmin.userName,
  };
  const accessToken = jwt.sign(accessTokenResponse, process.env.JWT_SECRET_KEY, {
    expiresIn: '1d',
  });
  return {
    userName: existingAdmin.userName,
    accessToken: accessToken,
  };
},
  //send reset password to email

  SendresetPassword: async(email) =>{

    const checkEmail = await Admin.findOne({email: email}).exec();

    if(!checkEmail)
    {
      throw({code:400, message: "Email Does Not Match"})
    }
          const resetCode = await crypto.randomBytes(4).toString("hex");
          checkEmail.tokens.ResetPassword = resetCode;
          checkEmail.save().catch((err) => {
          console.error(err);
          throw { code: 500, message: "Failed to save new password" };
      });
    
      const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
          user: process.env.SMTP_CLIENTID,
          pass: process.env.SMTP_CLIENTSECRET,
      },
  });
  try {
          await transporter.sendMail({
          from: `'Codenet Softwares' <${process.env.SMTP_SENDER}>`,
          to: email,
          subject: "Reset Your Password",
          text: `Your Reset Password Code Is ${resetCode}`,
      });
       console.log('Email Sent Successfully');
      } catch (err) {
      console.error(err); 
      throw { code: 500 || err.code, message: "Failed To Send Reset Password Code" || err.code };
  }
  
    return checkEmail;
  },


  // save reset password
SaveResetPassword: async(email,code,password) =>{
try {

const checkAdmin = await Admin.findOne({email: email}).exec();
    
if (!checkAdmin) {
  throw { code: 404, message: "Admin Not Found" };
}

if (checkAdmin.tokens.ResetPassword !== code) {

  throw { code: 404, message: "Reset Code Does Not Match" };
 
}

const isSamePassword = await bcrypt.compare(password, checkAdmin.password);
if (isSamePassword) {
throw { code: 400, message: "New password cannot be the same as the old password." };
} 
const passwordsalt = await bcrypt.genSalt();
const encryptedPassword = await bcrypt.hash(password, passwordsalt)

checkAdmin.password = encryptedPassword;
await checkAdmin.save();
return true;


} catch (error) {
console.log(error);
throw { code: 500 || err.code, message: "Failed To Save Reset Password Code" || err.code };

  }
},

    // Sub Admin Create
    CreateSubAdmin: async(data) =>
    {
    const existingSubadmin = await SubAdmin.findOne({userName: data.userName})
    console.log(existingSubadmin)
    if(existingSubadmin)
    {
        throw({code:409, message:"Sub Admin Already Exist"})
    }
    if(!data.userName)
    {
        throw({message:"userName Is Required" })
    }
    if(!data.password)
    {
        throw({message:"Password Is Required"})
    }
    
     const Passwordsalt = await bcrypt.genSalt();
     const encryptedPassword = await bcrypt.hash(data.password, Passwordsalt);
     const newSubAdmin = new SubAdmin({
            userName: data.userName,
            password: encryptedPassword,
            
        });
        console.log(newSubAdmin)
        newSubAdmin.save().catch((err) => {
            console.error(err);
            throw { code: 500, message: "Failed to save SubAdmin" };
        });
  },

    // Number Boy Create

    createNumberBoy: async(data) =>
    {
      try{
    const existingNumberBoy = await NumberBoy.findOne({userName: data.userName})
    console.log(existingNumberBoy)
    if(existingNumberBoy)
    {
        throw({code:409, message:"NumberBoy Already Exist"})
    }
    if(!data.userName)
    {
        throw({message:"userName Is Required" })
    }
    if(!data.password)
    {
        throw({message:"Password Is Required"})
    }
     const Passwordsalt = await bcrypt.genSalt();
     const encryptedPassword = await bcrypt.hash(data.password, Passwordsalt);
     const newNumberBoy = new NumberBoy({
            userName: data.userName,
            password: encryptedPassword,
            
        });
        console.log("newNumberBoy",newNumberBoy)
        newNumberBoy.save()
      }catch(err) {
         
            throw { code: 500, message: "Failed to save NumberBoy" };
        };
  },

//   TeleCaller create
  createTeleCaller: async(data) =>
  {
  const existingTelecaller = await Telecaller.findOne({userName: data.userName})
  console.log(existingTelecaller)
  if(existingTelecaller)
  {
      throw({code:409, message:"TeleCaller Already Exist"})
  }
  if(!data.userName)
  {
      throw({message:"userName Is Required" })
  }
  if(!data.password)
  {
      throw({message:"Password Is Required"})
  }
   const Passwordsalt = await bcrypt.genSalt();
   const encryptedPassword = await bcrypt.hash(data.password, Passwordsalt);
   const newTeleCaller = new Telecaller({
          userName: data.userName,
          password: encryptedPassword,
          
      });
      console.log(newTeleCaller)
      newTeleCaller.save().catch((err) => {
          console.error(err);
          throw { code: 500, message: "Failed to save Telecaller" };
      });
},
// update SubAdmin
updateSubAdmin: async (subAdminId, updatedData) => {
  try {
    const subAdmin = await SubAdmin.findById(subAdminId);
    if (!subAdmin) {
      throw { code: 404, message: "Sub Admin not found" };
    }

    if (updatedData.userName) {
      subAdmin.userName = updatedData.userName;
    }
    if (updatedData.password) {
      subAdmin.password = updatedData.password;
    }
    await subAdmin.save();

    return subAdmin;
  } catch (error) {
    throw { code: 500, message: "Failed to update Sub Admin" };
  }
},

// Update Number Boy
updateNumberBoy: async (numberBoyId, updatedData) => {
  try {
    const numberBoy = await NumberBoy.findOne(numberBoyId);
    if (!numberBoy) {
      throw { code: 404, message: "Number Boy not found" };
    }

    if (updatedData.userName) {
      numberBoy.userName = updatedData.userName;
    }
    if (updatedData.password) {
      numberBoy.password = updatedData.password;
    }
    await numberBoy.save();

    return numberBoy;
  } catch (error) {
    throw { code: 500, message: "Failed to update Number Boy" };
  }
},

// Update Telecaller
updateTelecaller: async (telecallerId, updatedData) => {
  try {
    const telecaller = await Telecaller.findOne(telecallerId);
    if (!telecaller) {
      throw { code: 404, message: "Telecaller not found" };
    }

    if (updatedData.userName) {
      telecaller.userName = updatedData.userName;
    }
    if (updatedData.password) {
      telecaller.password = updatedData.password;
    }
    await telecaller.save();

    return telecaller;
  } catch (error) {
    throw { code: 500, message: "Failed to update Telecaller" };
  }
},

// assing Selected Number To TeleCaller
sendNumbersToTelecaller: async (userName, freshNewNums, freshOldNums) => {
  try {
    const telecaller = await Telecaller.findOne({ userName: userName }).exec();
    if (!telecaller) {
      throw { code: 404, message: "Telecaller not found" };
    }

    const selectedNumbers = await NumberSchema.find({
      'newNumber.freshNewNum': { $in: freshNewNums },
      'oldNumber.freshOldNum': { $in: freshOldNums }
    }).exec();

    if (selectedNumbers.length === 0) {
      throw { code: 404, message: "Numbers do not exist" };
    }

    const assignedNumbers = selectedNumbers.map(number => ({
      newNumbers: {
        freshNewNum: number.newNumber.freshNewNum,
        callHistory: []
      },
      oldNumbers: {
        freshOldNum: number.oldNumber.freshOldNum,
        callHistory: []
      }
    }));

    telecaller.assignedNumbers = telecaller.assignedNumbers.concat(assignedNumbers);

    await telecaller.save();

    return "Numbers assigned to the telecaller";
  } catch (error) {
    throw error;
  }
}



};


