import {Router, Request} from "express"
import {initiateUpload, uploadChunk, completeUpload, processUpload, downloadDocument} from "#features/DocumentManager.js"
import fs from "fs"
import express from "express"
import supabaseUtil from "#features/database/supabaseUtil.js"
import {ProcessingQueue} from "../model/ProcessingQueue.js"
const uploadRoute = Router();


uploadRoute.post("/:uploadId",  express.raw({type: '*/*', limit:"20mb"}), async (req,res)=>{
    const buffer = req.body;
    const uploadId = req.params.uploadId;
    const resp = await uploadChunk(uploadId, buffer);
    res.status(resp.status);
    res.json({chunk:resp.data.chunkId});
})

uploadRoute.get("/complete/:uploadId/:filename", async (req,res)=>{
    //upload id 
    const uploadId = req.params.uploadId;
    const fileName = req.params.filename;
    const tocStart = 0;
    const tocEnd = 10;
    const chunkId = req.body.chunkIds;
  
    if(tocStart == null || tocEnd == null) throw new Error("invalid or no start page and end page");
    if(!uploadId) throw new Error("lack of uploadId");
    if(chunkId == null || chunkId.length == 0) throw new Error('invalid chunkIds');
    await completeUpload(uploadId, fileName, chunkId);
    ProcessingQueue.addToQueue(uploadId);
    const processingResp = await processUpload(uploadId, tocStart, tocEnd);
    const exportLocation = processingResp.data.exportLocation;
    await downloadDocument(exportLocation, res);//uploadId should be export location
   
})
uploadRoute.get("/getFileName/:uploadId", async (req,res)=>{
    try{
        const uploadId = req.params.uploadId;
        const resp = await supabaseUtil.getUploadData(uploadId);
        if(!resp.success){
            res.send({success:false, data:null, error:"invalid uploadId"});
        }else{
            res.json({success:true, data:{fileName:resp.data.tableRowData.file_name}, error:null});
        }
    }catch(e){
        res.status(400);
        res.json({message:"invalid uploadId"});
    }
  

})


export{uploadRoute};