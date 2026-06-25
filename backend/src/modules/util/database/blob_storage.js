import {ContainerClient} from "@azure/storage-blob"
import dotenv from "dotenv"
import path from "path"

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

export {uploadBlock, completeUploadAzure};

