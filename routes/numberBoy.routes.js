    import { NumberBoy } from "../models/numberBoy.model.js";
    import { NumberBoyController } from "../controller/numberBoy.controller.js";


    export const NumberBoyRoute = (app) =>
    {
        app.post("/api/numberBoy-login",async(req,res)=>
        {
            try{
                const {userName,password} = req.body;
                const numberBoy = await NumberBoy.findOne({ userName: userName }).exec(); 
                const accesstoken = await NumberBoyController.GenerateAccessToken(userName,password)       
                console.log(accesstoken)    
                console.log(numberBoy)
            if (numberBoy && accesstoken) {
                res.status(200).send({code:200, message:"Login Successfully", token: accesstoken });
            } else {
                res.status(404).json({ code:404, message:'Invalid Access Token or NumberBoy' });
            }
        }
        catch(err)
        {
            res.status(500).send({code: err.code, message: err.message})
        }
        });


        // get sub admin details
        app.get("/api/view-numberBoy/:id",async(req,res)=>{
            try
            {
                const id = req.params.id;
                const numberboy = await NumberBoy.findById(id, "-password")
                res.status(200).json(numberboy);
            }
            catch(err)
            {
                res.status(500).send({code: err.code, message: err.message})
            }
        })

        // Send New Number

        app.post("/api/Number",async(req,res)=>
        {
            try{
            const {freshNewNum,freshOldNum, remarksNew,remarksOld} = req.body
            const newnumber = await NumberBoyController.createNewNum(freshNewNum,freshOldNum, remarksNew,remarksOld)
            console.log(newnumber)
            res.status(200).send({code:200, message:" Number Entry Successfully"})  
        }
        catch(err)
        {
            res.status(500).send({code: err.code, message: err.message})
        }
        })
      

    }