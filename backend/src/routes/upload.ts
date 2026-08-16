import {Router, Request} from "express"
import {initiateUpload, uploadChunk, completeUpload, processUpload, downloadDocument} from "#features/upLogic.js"
import fs from "fs"
import express from "express"
import supabaseUtil from "#features/database/supabaseUtil.js"
const uploadRoute = Router();
uploadRoute.get("/uploads/start", async(req:Request<{fileName:string}>,res)=>{//receives json specifying chunk size
    //upload id to supabase
    const resp = await initiateUpload(req.query.fileName as string);
    if(resp.status == 200){
        res.json(resp);
    }else{
        res.status(resp.status).json({message:resp.error});
    }
})
uploadRoute.post("/uploads/upload/:uploadId",  express.raw({type: '*/*', limit:"20mb"}), async (req,res)=>{
    const buffer = req.body;
    const uploadId = req.params.uploadId;
    const resp = await uploadChunk(uploadId, buffer);
    res.status(resp.status);
    res.json({message:resp.error});
})

uploadRoute.get("/uploads/complete/:uploadId", async (req,res)=>{
    //upload id 
    const uploadId = req.params.uploadId;
    const tocStart = Number(req.query.tocStart);
    const tocEnd = Number(req.query.tocEnd);

    try{
        if(tocStart == null || tocEnd == null){
            throw new Error("invalid or no start page and end page");
        }
        if(!uploadId){
            throw new Error("lack of uploadId");
        }
        await completeUpload(uploadId);
       
        
        const processingResp = await processUpload(uploadId, tocStart, tocEnd);
        if(processingResp){
            const exportLocation = processingResp.data.exportLocation;
            await downloadDocument(exportLocation, res);//uploadId should be export location
            //clean up files
        }else{
            throw new Error("export location empty");
        }
        
    }catch(e:any){
        console.log(e.message);
        console.log(e.stack);
    }
    
    
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