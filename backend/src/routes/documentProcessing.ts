import {Router, Request} from "express"
import {initiateUpload, uploadChunk, completeUpload, processUpload, downloadDocument} from "#features/database/upload.js"
import fs from "fs"
const uploadRoute = Router();
uploadRoute.get("/uploads/start", async(req:Request<{fileName:string}>,res)=>{//receives json specifying chunk size
    //upload id to supabase
    const resp = await initiateUpload(req.query.fileName as string);
    res.json(resp);
})
uploadRoute.post("/uploads/upload/:uploadId", async (req,res)=>{
    const buffer = req.body;
    const uploadId = req.params.uploadId;
    const resp = await uploadChunk(uploadId, buffer);
    res.json(resp);
})

uploadRoute.get("/uploads/complete/:uploadId", async (req,res)=>{
    //upload id 
    const uploadId = req.params.uploadId;
    
})


export{uploadRoute};