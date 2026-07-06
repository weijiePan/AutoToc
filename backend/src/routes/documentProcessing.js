import {Router} from "express"
import {initiateUpload, addNewChunk, completeUpload, completeProcessingUpload} from "../modules/util/database/supabaseUtil.js";
import fs from "fs"
const uploadRoute = Router();


uploadRoute.post("/uploads/start", async(req,res)=>{//receives json specifying chunk size
    //upload id to supabase
    const resp = await initiateUpload();
    res.send(JSON.stringify({uploadId:resp.data.id}));
})
uploadRoute.post("/uploads/upload/:uploadId", async (req,res)=>{
    const buffer = req.body;
    const uploadId = req.params.uploadId;
    // //upload to aws
    // //wait till upload is successful to return a response
    // //generate and store chunk id in supabase
    const resp = await addNewChunk(uploadId, req.body);
    // //give status:success or failure
    res.send(JSON.stringify(resp));

})

uploadRoute.get("/uploads/complete/:uploadId", async (req,res)=>{
    //upload id 
    const uploadId = req.params.uploadId;
    //blob commmit everything
    const uploadResp = await completeUpload(uploadId);
    if(uploadResp.success){
        //process file
        const processingResp = await completeProcessingUpload(uploadId);
        if(processingResp.success){
            //stream file back to user
            const readStream = fs.createReadStream(processingResp.data.exportLocation);
            for await(const chunk of readStream){
                res.write(chunk);
            }
            res.end();
        }
    }

})


export{uploadRoute};