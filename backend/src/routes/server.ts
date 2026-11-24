import express from "express"
import dotenv from "dotenv"
import path from "path"
import cors from "cors";
import {uploadRoute} from "./upload.js"
import {ProcessingQueue} from "../model/ProcessingQueue.js"

const corsOption = {
    origin:"https://auto-toc.vercel.app",
}
const queue = new ProcessingQueue();
const envPath = path.resolve(process.cwd() , "../../", ".env");
console.log("envPath", envPath);
const server = express();
const port = 3001;
server.use(cors(corsOption));
server.use(express.json());
server.use("/uploads", uploadRoute);


server.listen(port, '',()=>{
    console.log(`listenig on http://localhost:${port}`);
})
server.get("",(req,res)=>{
    res.send("hi");
})

export {envPath};