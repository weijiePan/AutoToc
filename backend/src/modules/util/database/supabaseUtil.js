import {createClient} from "@supabase/supabase-js"
import {ContainerClient} from "@azure/storage-blob"
import {v4 as uuidv4} from "uuid"
import dotenv from "dotenv"
import path from "path"
import {uploadBlock, completeUploadAzure} from "./blob_storage.js"

dotenv.config({path:path.resolve(process.cwd(), "../../../../", ".env")});

async function getClient(){
    const client = await createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY);
    return client;
}

async function initiateUpload(total_chunk){
    const table = await (await getClient()).from("upload");
    const id = uuidv4(); 
    const resp = await table.insert([{upload_id:id, current_chunk:0, total_chunks:total_chunk, iscompleted:0}]);
    if(resp.success == true){
        return id;
    }else{
        throw new Error(resp.error.message);
    } 
}
async function getUploadData(uploadId){
    const client = await getClient();
    const resp = await client.from("upload").select().eq("upload_id", uploadId);
    if(resp.success == false){
        throw new Error("invalid upload_id");
    }
    return(resp.data[0]);
}

async function addNewChunk(uploadId, data){
    const tableData = await getUploadData(uploadId);
    const table = await (await getClient(uploadId)).from("upload");
    //to account for when chunks is null
    const chunks = tableData.chunk_id!=null?tableData.chunk_id:[];
    //pad chunkId to a set size
    const s = 8;
    let chunk = tableData.current_chunk.toString();
    while(chunk.length < s){
        chunk = "0" + chunk;
    }
       
    chunk = Buffer.from(chunk, "utf8");
    chunk = chunk.toString("base64");
    
    // upload to azure 
    
    const azureResp = await uploadBlock(uploadId, data, chunk);
    if(azureResp.error == undefined){
         //update in supabase
        const supabaseResp = await table.update({"chunk_id":[...chunks, chunk], current_chunk:tableData.current_chunk+1}).eq("upload_id", uploadId);
        if(supabaseResp.success == true){
            return "success";
        }else{
            return supabaseResp;
        }
    }else{
        return azureResp;
    }
   
    
 
}
async function completeUpload(uploadId){
    const table = await (await getClient()).from("upload");
    const chunkIds = (await getUploadData(uploadId)).chunk_id;
    const azureResp = await completeUploadAzure(uploadId, chunkIds);
      if(azureResp.error == undefined){
         //update in supabase
        const supabaseResp = await table.update({"iscompleted":1}).eq("upload_id", uploadId);
        if(supabaseResp.success == true){
            return "success";
        }else{
            return supabaseResp;
        }
    }else{
        return azureResp;
    }
   
}
async function getNextChunk(uploadId){
    const resp = await getNextData(uploadId);
    return resp.data.current_chunk + 1;
}


export {initiateUpload, addNewChunk, completeUpload}
