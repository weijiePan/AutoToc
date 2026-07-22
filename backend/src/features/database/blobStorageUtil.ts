import {ContainerClient} from "@azure/storage-blob"
import path from "path"
import fs from "fs"
import {annotateDocument, importFolder, exportFolder} from "#features/processing/convert.js";
export default class blobStorageUtil{
    static async getUploadData(uploadId:string){
        if(process.env.BLOB_URL){
            const containerClient = new ContainerClient(process.env.BLOB_URL);
            const blobClient = await containerClient.getBlockBlobClient(uploadId);
            return blobClient;
        }else{
            throw new Error("BLOB_URL invalid");
        }
    }
    static async uploadBlock(uploadId:string, data:Blob, chunkId:string){
        const blobClient = await blobStorageUtil.getUploadData(uploadId);
        const resp = await blobClient.stageBlock(
            chunkId, 
            data,
            data.size
        );
        return resp;
    }
    static async completeUploadAzure(uploadId:string, chunkIds:string[]){
        const blobClient = await blobStorageUtil.getUploadData(uploadId);
        const resp = await blobClient.commitBlockList(chunkIds);
        return resp;
    }
    static async downloadFile(uploadId:string){
        const blobClient = await blobStorageUtil.getUploadData(uploadId);
        const importLocation = path.join(importFolder, uploadId);
        const downloadStream = (await blobClient.download(0)).readableStreamBody;
        if(downloadStream){
            const wStream = fs.createWriteStream(importLocation);
            for await (const chunk of downloadStream){
                wStream.write(chunk);
            }
            return({success:true, data:{importLocation:importLocation }, error:null});
        }else{
            throw new Error("empty download stream");
        }
        
    }
    static async processUpload(uploadId:string, tocStart:number, tocEnd:number){
        const isDownloaded = await blobStorageUtil.downloadFile(uploadId);
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
}



