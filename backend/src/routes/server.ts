import express from "express"
import dotenv from "dotenv"
import path from "path"
import cors from "cors";
import {uploadRoute} from "./upload.js"


const corsOption = {
    origin:"http://localhost:3000",
}
//resets env 
const envPath = path.resolve(process.cwd() , "../../", ".env");
dotenv.config({path:envPath});
console.log("envPath", envPath);
const server = express();
const port = 3001;
server.use(cors(corsOption));

server.use(uploadRoute);

server.listen(port, ()=>{
    console.log(`listenig on http://localhost:${port}`);
})
server.get("",(req,res)=>{
    res.send("hi");
})

export {envPath};