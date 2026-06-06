import express from "express"
import multer from "multer"
import path from "path"
import cors from "cors"
import {annotateDocument} from "./util/convert.js"
import fs from "fs"
const port = 3001;
const server = express();
const storageLocation = `./import`; 
const exportLocation = `./export/document.pdf`
const rootLocation = path.resolve("./");
//sanitization
//ensuring file is pdf
const storageOption = multer.diskStorage(
    {
        destination:function(req, file, cb){
            cb(null, storageLocation);
        },
        filename:function(req,file,cb){
            cb(null, file.fieldname +".pdf");
        }
    }
);
//multer storage
const storage = multer({storage:storageOption});
//setup server
server.use(cors({
    origin:"http://localhost:3000"
}))
server.listen(port, ()=>{
    console.log(`live on http://localhost:${port}`);
});
server.get("/", (req,res)=>{
    res.send("hi");
} );
    //post request

server.post("/", storage.single("document"),(req,res)=>{
   annotateDocument(1,10).then((result)=>{
    if(result){
        res.sendFile(exportLocation,{root:rootLocation}, function(err){
            if(err){
                console.error("error:", err);
            }else{
                console.log("no error, file sent");
            }
        })
    }else{
        console.log("no file");
        res.send(false);
    }
   })
});

// test comment
