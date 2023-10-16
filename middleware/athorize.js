import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";
import { SubAdmin } from "../models/subadmin.models.js";
export const Authorize = (roles) => {
    return async (req, res, next) => {
      try {
        const authToken = req.headers.authorization;
  
        if (!authToken) {  
          return res
            .status(401)
            .send({ code: 401, message: "Invalid login attempt (1)" });
        }
  
        const tokenParts = authToken.split(" ");
        if (
          tokenParts.length !== 2 ||
          !(tokenParts[0] === "Bearer" && tokenParts[1])
        ) {
          return res
            .status(401)
            .send({ code: 401, message: "Invalid login attempt (2)" });
        }
  
        const user = jwt.verify(tokenParts[1], process.env.JWT_SECRET_KEY);
       
        if (!user) {
          return res
            .status(401)
            .send({ code: 401, message: "Invalid login attempt (3)" });
        }
  
        let existingUser;
        if (roles.includes("superAdmin")) {
          existingUser = await Admin.findById(user.id).exec();
          if (!existingUser) {
            return res
              .status(401)
              .send({ code: 401, message: "Invalid login attempt for user (1)" });
          }
        }
        if (roles.includes("subadmin")) {
          existingUser = await SubAdmin.findById(user.id).exec();
          if (!existingUser) {
            return res
              .status(401)
              .send({ code: 401, message: "Invalid login attempt for user (2)" });
          }
        }
        if (roles.includes("telecaller")) {
          existingUser = await SubAdmin.findById(user.id).exec();
          if (!existingUser) {
            return res
              .status(401)
              .send({ code: 401, message: "Invalid login attempt for user (3)" });
          }
        }
        req.user = existingUser;
        next();
      } catch (err) {
        console.error("Authorization Error:", err.message);
        return res.status(401).send({ code: 401, message: "Unauthorized access" });
      }
    };
  };