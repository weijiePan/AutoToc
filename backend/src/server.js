import express from "express"
import dotenv from "dotenv"
import path from "path"
import {uploadRoute} from "./modules/upload/upload.js"
//resets env 
dotenv.config({path:path.resolve(process.cwd(), "../", ".env")});

const server = express();
const port = 3000;

server.use(uploadRoute);

server.listen(port, ()=>{
    console.log(`listenig on http://localhost:${port}`);
})