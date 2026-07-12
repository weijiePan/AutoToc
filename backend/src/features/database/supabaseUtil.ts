import {createClient} from "@supabase/supabase-js"
import {ContainerClient} from "@azure/storage-blob"
import {v4 as uuidv4} from "uuid"
import path from "path"
import {uploadBlock, completeUploadAzure, processUpload} from "#features/database/blobStorageUtil.js"

const tableName = "upload";
async function getSupaTableClient(tableName:string){
    if(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY){
        const dataBaseClient = await createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY);
        const tableClient = await dataBaseClient.from(tableName);
        return tableClient;
    }else{
        if(!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY ){
            throw new Error("missing env variables:" + "process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY\n" + "process.env.NEXT_PUBLIC_SUPABASE_URL\n");
        }else if(!process.env.NEXT_PUBLIC_SUPABASE_URL){
            throw new Error("process.env.NEXT_PUBLIC_SUPABASE_URL\n");
        }else{
            throw new Error("process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY\n");
        }
    }
    
}
async function getUploadData(uploadId:string){ 
    const tableClient = await getSupaTableClient(tableName);
    const resp = await tableClient.select().eq("upload_id", uploadId);
    if(resp.success == false){
        throw new Error(resp.error.message);
        
    }
    return ({success:true, data:{tableRowData:resp.data[0]}, error:undefined});
}
//adds the id to table and returns id
async function addNewChunkToTable(uploadId:string, chunkId:string){
    const tableData = await getUploadData(uploadId);
    const table = await getSupaTableClient(tableName);
    const chunks = tableData.data.tableRowData.chunk_id == null? []:tableData.data.tableRowData.chunk_id;
    const supabaseResp = await table.update({"chunk_id":[...chunks, chunkId], current_chunk:tableData.data.tableRowData.current_chunk + 1}).eq("upload_id", uploadId);
    return supabaseResp; //work on error handling
}
async function completeSupabaseUpload(uploadId:string){
    const table = await getSupaTableClient(tableName);
    const chunkIds = (await getUploadData(uploadId)).data.tableRowData.chunk_id;
    const supabaseResp = await table.update({"is_uploaded":1}).eq("upload_id", uploadId);
    return supabaseResp;
   
}
async function completeSupabaseProcessing(uploadId:string){
    const table = await getSupaTableClient(tableName);
    const supabaseResp = await table.update({"is_processed":1}).eq("upload_id", uploadId);
    return supabaseResp;
}



export {addNewChunkToTable, completeSupabaseUpload, completeSupabaseProcessing}