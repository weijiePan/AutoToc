import {ContainerClient} from "@azure/storage-blob"
import path from "path"
import fs from "fs"
import {annotateDocument, importFolder, exportFolder} from "#features/processing/convert.js";
import {credentialError, MissingUploadError} from "#src/error.js"
export default class blobStorageUtil{
    static async getBlobClient(uploadId:string){
            if(process.env.BLOB_URL){
                const containerClient = new ContainerClient(process.env.BLOB_URL);
                const blobClient = await containerClient.getBlockBlobClient(uploadId);
                return blobClient;
            }else{
                throw new credentialError("blob url missing");
            }
    }
    static async uploadBlock(uploadId:string, data:Buffer, chunkId:string){
        try{
            if(data.length <= 0 ){
                throw new MissingUploadError("empty upload data");
            }
            const blobClient = await blobStorageUtil.getBlobClient(uploadId);
            const resp = await blobClient.stageBlock(
                chunkId, 
                data,
                data.length
            );
            return resp;
        }catch(e:any){
            throw new credentialError("incorrect azure credential");
        }   
       
    }
    static async completeUploadAzure(uploadId:string, chunkIds:string[]){

        const blobClient = await blobStorageUtil.getBlobClient(uploadId);
        const resp = await blobClient.commitBlockList(chunkIds);
        return resp;
    }
    static async downloadFile(uploadId:string){
        const blobClient = await blobStorageUtil.getBlobClient(uploadId);
        
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



