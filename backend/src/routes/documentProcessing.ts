import {Router, Request} from "express"
import {initiateUpload, uploadChunk, completeUpload, processUpload, downloadDocument} from "#features/database/upload.js"
import fs from "fs"
import express from "express"
const uploadRoute = Router();
uploadRoute.get("/uploads/start", async(req:Request<{fileName:string}>,res)=>{//receives json specifying chunk size
    //upload id to supabase
    const resp = await initiateUpload(req.query.fileName as string);
    res.json(resp);
})
uploadRoute.post("/uploads/upload/:uploadId",  express.raw({type: '*/*', limit:"20mb"}), async (req,res)=>{
    const buffer = req.body;
    console.log(req.body);
    const uploadId = req.params.uploadId;
    console.log('upload start' + req.params.uploadId);
    const resp = await uploadChunk(uploadId, buffer);
    console.log('upload end');
    res.json(resp)
})

uploadRoute.get("/uploads/complete/:uploadId", async (req,res)=>{
    //upload id 
    const uploadId = req.params.uploadId;
    const tocStart = Number(req.query.tocStart);
    const tocEnd = Number(req.query.tocEnd);
    try{
        await completeUpload(uploadId);
        if(!tocStart || !tocEnd){
            throw new Error("invalid or no start page and end page");
        }
        console.log('finished upload');
        const processingResp = await processUpload(uploadId, tocStart, tocEnd);
        if(processingResp){
            const exportLocation = processingResp.data.exportLocation;
            await downloadDocument(exportLocation, res);//uploadId should be export location
            console.log('finised processing');
            //clean up files
            res.json({success:true, data:null, error:null})
        }else{
            throw new Error("export location empty");
        }
        
    }catch(e:any){
        console.log(e.message);
        console.log(e.stack);
        res.json({success:false, data:null, error:"unable to complete upload/processing"});
    }
    
    
})


export{uploadRoute};