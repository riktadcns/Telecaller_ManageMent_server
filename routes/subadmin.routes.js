import { SubAdmin } from "../models/subadmin.models.js";
import { SubadminController } from "../controller/subadmin.controller.js";


export const SubAdminRoute = (app) =>
{
    app.post("/api/Subadmin-login",async(req,res)=>
    {
        try{
            const {userName,password} = req.body;
            const subadmin = await SubAdmin.findOne({ userName: userName }).exec(); 
            const accesstoken = await SubadminController.GenerateAccessToken(userName,password)       
            console.log(accesstoken)    
            console.log(subadmin)
        if (subadmin && accesstoken) {
            res.status(200).send({code:200, message:"Login Successfully", token: accesstoken });
          } else {
            res.status(404).json({ code:404, message:'Invalid Access Token or Sub admin' });
          }
    }
    catch(err)
    {
        res.status(500).send({code: err.code, message: err.message})
    }
    });

    //Get Sub Admin Details
    app.get("/api/view-Subadmin/:id",async(req,res)=>{
        try
        {
            const id = req.params.id;
            const subadmin = await SubAdmin.findById(id, "-password")
            res.status(200).json(subadmin);
        }
        catch(err)
        {
            res.status(500).send({code: err.code, message: err.message})
        }
    })

}