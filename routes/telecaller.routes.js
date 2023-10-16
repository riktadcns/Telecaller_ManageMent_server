import { Telecaller } from "../models/telecaller.model.js";
import { TelecallerController } from "../controller/telecaller.controller.js";
import { Authorize } from "../middleware/athorize.js";


export const TeleCallerRoute = (app) =>
{
    app.post("/api/TeleCaller-login", async (req, res) => {
        try {
            const { userName, password } = req.body;
            const telecaller = await Telecaller.findOne({ userName: userName }).exec();
            
            if (telecaller) {
                const telecallerId = telecaller.telecallerId;
                const accessToken = await TelecallerController.GenerateAccessToken(userName, password);
                
                if (accessToken) {
                    res.status(200).json({ telecallerId, accessToken });
                } else {
                    res.status(500).json({ code: 500, message: 'Failed to generate access token' });
                }
            } else {
                res.status(404).json({ code: 404, message: 'Invalid Access Token or TeleCaller' });
            }
        } catch (err) {
            res.status(500).json({ code: 500, message: err.message });
        }
    });
       //Get TeleCaller Details
       app.get("/api/view-telecaller/:id",async(req,res)=>{
        try
        {
            const id = req.params.id;
            const telecaller = await Telecaller.findById(id, "-password")
            res.status(200).json(telecaller);
        }
        catch(err)
        {
            res.status(500).send({code: err.code, message: err.message})
        }
    })
    app.get("/api/telecaller/getAssignedNumbers/:userName", async (req, res) => {
        try {
            const userName = req.params.userName;
            const telecaller = await Telecaller.findOne({ userName });
    
            if (!telecaller) {
                return res.status(404).json({ message: "No assigned numbers found." });
            }
    
            const freshNewNumbers = [];
            const freshOldNumbers = [];
    
            for (const assignment of telecaller.assignedNumbers) {
                freshNewNumbers.push(...assignment.newNumbers.map(item => item.freshNewNum));
                freshOldNumbers.push(...assignment.oldNumbers.map(item => item.freshOldNum));
            }
    
            const formattedNumbers = {
                freshNewNum: freshNewNumbers,
                freshOldNum: freshOldNumbers
            };
    
            res.status(200).json(formattedNumbers);
        } catch (err) {
            res.status(500).send({ code: err.code, message: err.message });
        }
    });
    
    
    
    
      app.post("/api/updateNumberAfterCall",async(req,res)=>
      {
          try{
          const {telecallerUserName, phoneNumber, isInterested, purchase, remarks} = req.body
          const checknum = await TelecallerController.updateNumberAfterCall(telecallerUserName, phoneNumber, isInterested, purchase, remarks)
          console.log(checknum)
          res.status(200).send({code:200, message:"Checked Number Successfully"})  
      }
      catch(err)
      {
          res.status(500).send({code: err.code, message: err.message})
      }
      })
      

    
}