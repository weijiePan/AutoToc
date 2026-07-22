import {v4 as uuidv4} from "uuid"
import supabaseUtil from "#features/database/supabaseUtil.js"
import blobStorageUtil from "#features/database/blobStorageUtil.js"
import type {Response} from "express"
import fs from "fs"
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

async function initiateUpload(fileName:string){
    if(fileName == "" || fileName == null){
        return {success:false, data:null, error:"empty fileName or no fileName"};
    }
    const uploadId = uuidv4();
    //creates a row for tracking the progress of file upload/processing
    try{
        await supabaseUtil.createNewUpload(uploadId, fileName);
    }catch(e){
        return {success:false, data:null, error:e};
    }
    return {success:true, data:{uploadId:uploadId}, error:null};
}

async function uploadChunk(uploadId:string, data:Blob){
    //create block id
    let currentChunk = null;
    let supabaseUpdated = false;
    let chunkUploaded = false;
    try{
        currentChunk = (await supabaseUtil.getUploadData(uploadId)).data.tableRowData.current_chunk;
        const chunkId = createBase64BlockId(currentChunk);
        //update in supabase
        const newChunk = await supabaseUtil.addNewChunkToTable(uploadId,chunkId);
        supabaseUpdated = true;
        //upload to blob storage
        await blobStorageUtil.uploadBlock(uploadId, data, chunkId);
        chunkUploaded = true;
        return {success:true, data:{currentChunk:newChunk }, error:null};
    }catch(e){
             
        if(supabaseUpdated == true && chunkUploaded == false){
            //revert supabase change
            const rowData = (await supabaseUtil.getUploadData(uploadId)).data.tableRowData;
            const currentChunk = rowData.current_chunk - 1;
            let chunks = rowData.chunk_id as Array<string>;
            chunks = chunks.slice(0, chunks.length-1);

            const client = await supabaseUtil.getTableClient(supabaseUtil.tableName);
            client.update({current_chunk:currentChunk, chunk_id:chunks}).eq("upload_id", uploadId);
        }
        return{success:false, data:null, error:`chunk upload failed for ${uploadId}` + e};
    }
}
async function completeUpload(uploadId:string){
    try{
        const chunkIds = (await supabaseUtil.getUploadData(uploadId)).data.tableRowData.chunk_id;
        await blobStorageUtil.completeUploadAzure(uploadId, chunkIds);
        await supabaseUtil.completeUpload(uploadId);
    }catch(e){
        throw new Error("unable to finalize upload" + e);
    }
    
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
    fileStream.on("data",(chunk)=>{
        res.write(chunk);
    });
    fileStream.on("close",()=>{
        res.end();
    })

}
export {initiateUpload, uploadChunk, completeUpload, processUpload, downloadDocument}
