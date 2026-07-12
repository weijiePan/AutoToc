import {ContainerClient} from "@azure/storage-blob"
import path from "path"
import fs from "fs"
import {annotateDocument, importFolder, exportFolder} from "#features/processing/convert.js";

async function getBlobClient(uploadId:string){
    if(process.env.blobUrl){
        const containerClient = new ContainerClient(process.env.blobUrl);
        const blobClient = await containerClient.getBlockBlobClient(uploadId);
        return blobClient;
    }else{
        throw new Error("blobUrl invalid");
    }
}
async function uploadBlock(uploadId:string, data:Blob, chunkId:string){
    const blobClient = await getBlobClient(uploadId);
    const resp = await blobClient.stageBlock(
        chunkId, 
        data,
        data.size
    );
    return resp;
}
async function completeUploadAzure(uploadId:string, chunkIds:string[]){
    const blobClient = await getBlobClient(uploadId);
    const resp = await blobClient.commitBlockList(chunkIds);
    return resp;
}
async function downloadFile(uploadId:string){
    const blobClient = await getBlobClient(uploadId);
    const importLocation = path.join(importFolder, uploadId);
    const downloadStream = (await blobClient.download(0)).readableStreamBody;
    if(downloadStream){
        const wStream = fs.createWriteStream(importLocation);
        for await (const chunk of downloadStream){
            wStream.write(chunk);
        }
        return({success:true});
    }else{
        throw new Error("empty download stream");
    }
    
}
async function processUpload(uploadId:string, tocStart:number, tocEnd:number){
    const isDownloaded = await downloadFile(uploadId);
    if(isDownloaded.success){
        const isProcessed = await annotateDocument(uploadId, tocStart, tocEnd);
        if(isProcessed){
            if(isProcessed.success){
                return({success:true, exportLocation:path.join(exportFolder, uploadId)});
            }
        }
        
    }else{
        return({success:false});
    }
}
export {uploadBlock, completeUploadAzure, processUpload};

