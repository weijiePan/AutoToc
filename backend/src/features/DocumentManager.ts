import {v4 as uuidv4} from "uuid"
import supabaseUtil from "#features/database/supabaseUtil.js"
import blobStorageUtil from "#features/database/blobStorageUtil.js"
import type {Response} from "express"
import type {result} from "#src/type.ts"

import fs from "fs"

import {credentialError, MissingUploadError} from "#src/error.js"
function createBase64BlockId():string{
    const string_limit = 8;
    const randomString = uuidv4().slice(0, string_limit-1);
    return btoa(randomString);
    
}
async function uploadChunk(uploadId:string, data:Buffer):Promise<result>{
    if(data.length <= 0) throw new Error("empty data");
    const chunkId = createBase64BlockId();
    await blobStorageUtil.uploadBlock(uploadId, data, chunkId);        
    return {data:{chunkId:chunkId}, error:"", status:204};


}
async function completeUpload(uploadId:string, fileName:string, chunkIds:string[]){
    if(chunkIds.length <= 0 ){
        throw new Error("uploadId not found in database");
    }
    await blobStorageUtil.completeUploadAzure(uploadId, chunkIds);
    const size = await blobStorageUtil.getBlobSize(uploadId);
    if(size == undefined) throw new Error("invalid file");
    await supabaseUtil.insertProcessedDocument(uploadId, fileName, size);
}

async function processUpload(uploadId:string, tocStart:number, tocEnd:number){
    const importLocation = await blobStorageUtil.downloadFile(uploadId);
    const resp = await blobStorageUtil.processUpload(uploadId, tocStart, tocEnd);
    const exportLocation = resp != null? resp.exportLocation:null;
    if(exportLocation){
        await supabaseUtil.completeProcessing(uploadId);
        return {success:true, data:{exportLocation:exportLocation}, error:null};
    }else{
        throw new Error("no export location");
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
