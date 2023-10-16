import { AdminController } from "../controller/admin.controller.js";
import { Admin } from "../models/admin.model.js";
import { Authorize } from "../middleware/athorize.js";
import { NumberBoy } from "../models/numberBoy.model.js";
import { SubAdmin } from "../models/subadmin.models.js";
import { Telecaller } from "../models/telecaller.model.js";
import { NumberSchema } from "../models/number.model.js";

export const AdminRoute = (app) =>{
    
    //Admin Create
    // app.post("/api/admin-create",async(req,res)=>
    // {
    //     try{
    //     const {userName,password} = req.body;
    //     console.log(req.body)
    //     const Admin = await AdminController.createAdmin({userName,password});
    //      console.log(Admin)
    //      res.status(200).send({code:200, message:"User Save Successfully"})  
    // }
    // catch(err)
    // {
    //     res.status(500).send({code: err.code, message: err.message})
    // }
    // })

    // admin login
    app.post("/api/admin-login",async(req,res)=>
    {
        try{
        const {userName,password} = req.body;
        const admin = await Admin.findOne({ userName: userName }); 
        const accesstoken = await AdminController.GenerateAccessToken(userName, password);
        console.log(accesstoken)
        if (admin && accesstoken) {
            res.status(200).send({code:200, message:"Login Successfully", token: accesstoken });
          } else {
            res.status(404).json({ code:404, message:'Invalid Access Token or Admin' });
          }
    }
    catch(err)
    {
        res.status(500).send({code: err.code, message: err.message})
    }
    })

    //Reset Password Send admin

app.post("/api/admin/send-reset-password",Authorize(["superAdmin"]),async(req,res) =>{
    try{
        const {email} = req.body;
        await AdminController.SendresetPassword(email);
        res.status(200).send({code:200, message:"Reset Password Code Send Successfully"})
    
    }
    catch(err){
        
        res.status(500).send({code: err.code, message: err.message})
    }
    })
    
    //save reset password admin
    
    app.post("/api/admin/save-reset-password",Authorize(["superAdmin"]), async(req,res) => {
        
        try
        {
           const {email, code, password} = req.body;
            const result = await AdminController.SaveResetPassword(email, code, password);
            console.log(result)
            res.status(200).send({code:200, message:"Reset Password Save Successfully"})
        }
        catch(err)
        {
            console.log(err)
            res.status(500).send({code:err.code, message: err.message})
        }
    })

    // sub admin Create
    app.post("/api/admin/Create-SubAdmin",Authorize(["superAdmin"]),async(req,res)=>
    {
        try{
        const {userName,password} = req.body;
        console.log(req.body)
        const Subadmin = await AdminController.CreateSubAdmin({userName,password});
         console.log(Subadmin)
         res.status(200).send({code:200, message:"Sub Admin Register Successfully"})  
    }
    catch(err)
    {
        res.status(500).send({code: err.code, message: err.message})
    }
    })
    // get sub admin details
    app.get("/api/admin/view-subadmin",Authorize(["superAdmin"]),async(req,res)=>{
        try
        {
            const subadmin = await SubAdmin.find({}, "-password")
            res.status(200).json(subadmin);
        }
        catch(err)
        {
            res.status(500).send({code: err.code, message: err.message})
        }
    })
    
    // Number Boy Create
    app.post("/api/admin/Create-NumberBoy",Authorize(["superAdmin"]),async(req,res)=>
    {
        try{
        const {userName,password} = req.body;
        console.log(req.body)
        const numberBoy = await AdminController.createNumberBoy({userName,password});
         console.log(numberBoy)
         res.status(200).send({code:200, message:"Number Boy Create Successfully"})  
    }
    catch(err)
    {
        res.status(500).send({code: err.code, message: err.message})
    }
    })
    // View Number Boy
    app.get("/api/admin/view-NumberBoy",Authorize(["superAdmin"]),async(req,res)=>{
        try
        {
            const numberBoy = await NumberBoy.find({}, "-password")
            res.status(200).json(numberBoy);
        }
        catch(err)
        {
            res.status(500).send({code: err.code, message: err.message})
        }
    })
    

    // Telecaller Register
    app.post("/api/admin/Create-Telecaller",Authorize(["superAdmin"]),async(req,res)=>
    {
        try{
        const {userName,password} = req.body;
        console.log(req.body)
        const telecaller = await AdminController.createTeleCaller({userName,password});
         console.log(telecaller)
         res.status(200).send({code:200, message:"Number Telecaller Register Successfully"})  
    }
    catch(err)
    {
        res.status(500).send({code: err.code, message: err.message})
    }
    })
     // View Number Boy
     app.get("/api/admin/view-Telecaller",Authorize(["superAdmin"]),async(req,res)=>{
        try
        {
            const telecaller = await Telecaller.find({}, "-password")
            res.status(200).json(telecaller);
        }
        catch(err)
        {
            res.status(500).send({code: err.code, message: err.message})
        }
    });

    app.put('/api/admin/update-subadmin/:id', Authorize(["superAdmin"]),async (req, res) => {
        const subAdminId = req.params.id;
        const updatedData = req.body;
      
        try {
          const updatedSubAdmin = await AdminController.updateSubAdmin(subAdminId, updatedData);
          return res.json({ message: "Sub Admin updated successfully", updatedSubAdmin });
        } catch (error) {
          return res.status(error.code).json({ message: error.message });
        }
      });
      
      app.put('/api/admin/update-numberboy/:id',Authorize(["superAdmin"]), async (req, res) => {
        const numberBoyId = req.params.id;
        const updatedData = req.body;
      
        try {
          const updatedNumberBoy = await AdminController.updateNumberBoy(numberBoyId, updatedData);
          return res.json({ message: "Number Boy updated successfully", updatedNumberBoy });
        } catch (error) {
          return res.status(error.code).json({ message: error.message });
        }
      });
      
      app.put('/api/admin/update-telecaller/:id',Authorize(["superAdmin"]), async (req, res) => {
        const telecallerId = req.params.id;
        const updatedData = req.body;
      
        try {
          const updatedTelecaller = await AdminController.updateTelecaller(telecallerId, updatedData);
          return res.json({ message: "Telecaller updated successfully", updatedTelecaller });
        } catch (error) {
          return res.status(error.code).json({ message: error.message });
        }
      });
    // Get All Numbers

    app.get("/api/admin/View-All-Numbers", Authorize(["superAdmin"]), async (req, res) => {
        try {
            const numbers = await NumberSchema.find();
    
            // Assuming numbers is an array of objects
            const formattedNumbers = numbers.map((number) => {
                return {
                    freshNewNum: number.newNumber.freshNewNum,
                    remarksNew: number.newNumber.remarksNew,
                    freshOldNum: number.oldNumber.freshOldNum,
                    remarksOld: number.oldNumber.remarksOld,
                    entryDate: number.newNumber.entryDate
                };
            });
    
            res.status(200).json(formattedNumbers);
        } catch (err) {
            res.status(500).send({ code: err.code, message: err.message });
        }
    });
    app.get("/api/admin/viewTelecaller-assign", Authorize(["superAdmin"]), async (req, res) => {
        try {
            const telecaller = await Telecaller.find();
    
            // Assuming numbers is an array of objects
            const formattedTele = telecaller.map((tele) => {
                return {
                   
                    userName: tele.userName
                };
            });
    
            res.status(200).json(formattedTele);
        } catch (err) {
            res.status(500).send({ code: err.code, message: err.message });
        }
    });

    
    app.get("/api/admin/Number-To-Assign", Authorize(["superAdmin"]), async (req, res) => {
        try {
            const numbers = await NumberSchema.find();
    
            // Assuming numbers is an array of objects
            const formattedNumbers = numbers.map((number) => {
                return {
                    freshNewNum: number.newNumber.freshNewNum,
                    freshOldNum: number.oldNumber.freshOldNum,
                    
                };
            });
    
            res.status(200).json(formattedNumbers);
        } catch (err) {
            res.status(500).send({ code: err.code, message: err.message });
        }
    });

    
    // get numbers by id
    app.get("/api/admin/View-Numbers/:id",Authorize(["superAdmin"]),async(req,res)=>{
        try
        {   
            const id = req.params.id;
            const numbers = await NumberSchema.findById(id)
            res.status(200).json(numbers);
        }
        catch(err)
        {
            res.status(500).send({code: err.code, message: err.message})
        } 
    })

    // send number to tele caller
    app.post("/api/admin/telecaller/send-selected-numbers", Authorize(["superAdmin"]), async (req, res) => {
        try {
          const { userName, freshNewNum, freshOldNum } = req.body;
          const result = await AdminController.sendNumbersToTelecaller(userName, freshNewNum, freshOldNum);
          console.log(result)
          res.status(200).json({ code: 200, message: "Numbers assigned to telecaller successfully" });
        } catch (error) {
          res.status(error.code || 500).json({ code: error.code || 500, message: error.message });
        }
      });
      

      app.get("/api/admin/assigned-telecaller-numbers", Authorize(["superAdmin"]), async (req, res) => {
        try {
          const telecallers = await Telecaller.find();
      
          const assignedNumbers = telecallers.map((telecaller) => {
            return telecaller.assignedNumbers.map((numbers) => ({
              userName: telecaller.userName,
              freshNewNum: numbers.newNumbers.map((item) => item.freshNewNum),
              freshOldNum: numbers.oldNumbers.map((item) => item.freshOldNum),
            }));
          }).flat();
      
          res.status(200).json(assignedNumbers);
        } catch (err) {
          res.status(500).send({ code: err.code, message: err.message });
        }
      });
      

      
      

      
}