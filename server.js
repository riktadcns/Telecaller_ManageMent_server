import express from "express";
import bodyparser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv"
import { AdminRoute } from "./routes/admin.routes.js";
import { NumberBoyRoute } from "./routes/numberBoy.routes.js";
import { SubAdminRoute } from "./routes/subadmin.routes.js";
import { TeleCallerRoute } from "./routes/telecaller.routes.js";
import { fileURLToPath } from 'url';
import path from "path";
import { dirname } from "path";
import cors from 'cors';

dotenv.config()

const app = express();

app.use(express.json());



const corsOptions = {
  origin: 'http://localhost:8080', 
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));


mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log('Connection to MongoDB successful');
  }).catch((err) => {
    console.error('Connection to MongoDB failed:', err);
  });
AdminRoute(app)
NumberBoyRoute(app)
SubAdminRoute(app)
TeleCallerRoute(app)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const clientDirectory = path.join(__dirname, "../client");
app.use(express.static(clientDirectory));

app.get("/", (req, res) => {
    res.sendFile(path.join(clientDirectory, "adminLogin.html"));
});
app.get("/adminPanel", (req, res) => {
  res.sendFile(path.join(clientDirectory, "adminPanel.html"));
});
app.get("/numberboylogin", (req, res) => {
  res.sendFile(path.join(clientDirectory, "NumberBoyLogin.html"));
});
app.get("/numberboylogin/numberEntry", (req, res) => {
  res.sendFile(path.join(clientDirectory, "NumberEntry.html"));
});
app.get("/telecallerLogin", (req, res) => {
  res.sendFile(path.join(clientDirectory, "TeleCallerLogin.html"));
});
app.get("/telecallerLogin/telecallerEntry", (req, res) => { 
  res.sendFile(path.join(clientDirectory, "TeleCallerEntry.html"));
});

app.get("/telecallerLogin/telecallerEntry", (req, res) => { 
  res.sendFile(path.join(clientDirectory, "selectNumTele.html"));
});


app.get("/telecallerLogin/telecallerEntry", (req, res) => { 
  res.sendFile(path.join(clientDirectory, "subadminEdit.html"));
});

app.get("/telecallerLogin/telecallerEntry", (req, res) => { 
  res.sendFile(path.join(clientDirectory, "telecallerEdit.html"));
});

app.get("/telecallerLogin/telecallerEntry", (req, res) => { 
  res.sendFile(path.join(clientDirectory, "numberBoyEdit.html"));
});

app.listen(process.env.PORT, ()=>{
    console.log(`Read the docs - http://localhost:${process.env.PORT || 8080}`)
})