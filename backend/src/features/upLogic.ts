import {v4 as uuidv4} from "uuid"
import supabaseUtil from "#features/database/supabaseUtil.js"
import blobStorageUtil from "#features/database/blobStorageUtil.js"
import type {Response} from "express"
import type {result} from "#src/type.ts"

import fs from "fs"

import {credentialError, MissingUploadError} from "#src/error.js"
function createBase64BlockId(currentChunk:number):string{
    const s = 8;
    let chunk = currentChunk.toString();
    while(chunk.length < s){
        chunk = "0" + chunk;
    }
       
    const buffer = Buffer.from(chunk, "utf8");
    const chunkId = buffer.toString("base64");
    return chunkId;
    
}

async function initiateUpload(fileName:string):Promise<result>{
    if(fileName == "" || fileName == null){
        return {data:null, error:"empty file name or no file name", status:400};
    }
    const uploadId = uuidv4();
    //creates a row for tracking the progress of file upload/processing
    try{
        await supabaseUtil.createNewUpload(uploadId, fileName);
         return {data:{uploadId:uploadId}, error:"", status:200};
    }catch(e:any){
        return { data:{uploadId:uploadId}, error:"Internal server error", status:500};
    }
   
}

async function uploadChunk(uploadId:string, data:Buffer):Promise<result>{
    //create block id

    let currentChunk = null;
    let supabaseUpdated = false;
    let chunkUploaded = false;

    try{
        if(data.length < 1){
            return({data:null, error:"empty chunk upload", status:400});
        }
        currentChunk = (await supabaseUtil.getUploadData(uploadId)).data.tableRowData.current_chunk;//{ tableRowData: undefined } is undefined
        const chunkId = createBase64BlockId(Number(currentChunk));
        //update in supabase
        const newChunk = await supabaseUtil.addNewChunkToTable(uploadId,chunkId);
        supabaseUpdated = true;
        //upload to blob storage
        await blobStorageUtil.uploadBlock(uploadId, data, chunkId);
        
        chunkUploaded = true;
        
        return {data:{currentChunk:newChunk}, error:"", status:200};
    }catch(e:any){
        console.log(e.message);
        if(e instanceof credentialError){
            console.log('credential fail');
            console.log(e.stack);
            return({data:null, error:"internal server error", status:500});
        }
        if(e instanceof MissingUploadError){
            return({data:null, error:`upload id not found for ${uploadId}`, status:404});
        }
        return{data:null, error:`chunk upload failed for ${uploadId}`, status:500};
    }
}
async function completeUpload(uploadId:string){

    const chunkIds = (await supabaseUtil.getUploadData(uploadId)).data.tableRowData.chunk_id;

    if(chunkIds.length <= 0 ){
        throw new Error("uploadId not found in database");
    }
    await blobStorageUtil.completeUploadAzure(uploadId, chunkIds);
    await supabaseUtil.completeUpload(uploadId);
    
    
}

async function processUpload(uploadId:string, tocStart:number, tocEnd:number){
        try{
            const importLocation = await blobStorageUtil.downloadFile(uploadId);
            const resp = await blobStorageUtil.processUpload(uploadId, tocStart, tocEnd);
            const exportLocation = resp != null? resp.exportLocation:null;
            if(exportLocation){
                await supabaseUtil.completeProcessing(uploadId);
                return {success:true, data:{exportLocation:exportLocation}, error:null};
            }else{
                throw new Error("no export location");
            }
        }catch(e){

        }
}
function downloadDocument(exportLocation:string, res:Response){
    const fileStream = fs.createReadStream(exportLocation);
    fileStream.on("error",(err)=>{
        throw new Error(err.toString());
        throw new Error("error opening file/ streaming from read stream");
    });
    fileStream.on("data",(chunk)=>{
        res.write(chunk);
    });
    fileStream.on("close",()=>{
        res.end();
    })

}
export {initiateUpload, uploadChunk, completeUpload, processUpload, downloadDocument}
