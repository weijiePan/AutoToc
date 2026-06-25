import {ContainerClient} from "@azure/storage-blob"
import dotenv from "dotenv"
import path from "path"
import fs from "fs"
import {annotateDocument, importFolder, exportFolder} from "../processing.convert.js";
dotenv.config({path:path.resolve(process.cwd(), "../../../../", ".env")});
async function getBlobClient(uploadId){
    const containerClient = new ContainerClient(process.env.blobUrl);
    const blobClient = await containerClient.getBlockBlobClient(uploadId);
    return blobClient;
}
async function uploadBlock(uploadId, data, chunkId){
    const blobClient = await getBlobClient(uploadId);
    const resp = await blobClient.stageBlock(
        chunkId, 
        data,
        data.length
    );
    return resp;
    //status return
}
async function completeUploadAzure(uploadId, chunkIds){
    const blobClient = await getBlobClient(uploadId);
    const resp = await blobClient.commitBlockList(chunkIds);

    return resp;
    //status return
}
async function downloadFile(uploadId){
    const blobClient = await getBlobClient(uploadId);
    const importLocation = path.join(importFolder, uploadId);
    const downloadStream = (await blobClient.download(0)).readableStreamBody;
    const wStream = fs.createWriteStream(importLocation);
    console.log(downloadStream);
    for await (const chunk of downloadStream){
        console.log(chunk.length);
        wStream.write(chunk);
    }
    return({success:true});
}
async function processUpload(uploadId, tocStart, tocEnd){
    const isDownloaded = await downloadFile(uploadId);
    if(isDownload.success){
        const isProcessed = await annotateDocument(uploadId, tocStart, tocEnd);
        
        if(isProcessed.success){
            return({success:true, exportLocation:path.join(exportFolder, uploadId)});
        }else{
            return(isProcessed.error);
        }
    }else{
        return({success:false});
    }
}
downloadFile("ebook - The C Programming Language Ritchie & kernighan -.doc - C_Book_2nd.pdf");
export {uploadBlock, completeUploadAzure, processUpload};

