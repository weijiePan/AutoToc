import express from "express"
import dotenv from "dotenv"
import path from "path"
import {uploadRoute} from "./modules/upload/upload.js"
//resets env 
const envPath = path.resolve(process.cwd(), "../", ".env")
dotenv.config({path:envPath});

const server = express();
const port = 3000;

server.use(uploadRoute);

server.listen(port, ()=>{
    console.log(`listenig on http://localhost:${port}`);
})

export {envPath};