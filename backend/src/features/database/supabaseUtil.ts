import {createClient} from "@supabase/supabase-js"

import {ContainerClient} from "@azure/storage-blob"
import {v4 as uuidv4} from "uuid"
import path from "path"
export default class supabaseUtil{
    static tableName = "upload";
    static async getTableClient(tableName:string){
        if(process.env.SUPABASE_URL && process.env.SUPABASE_KEY){
            
            const dataBaseClient = await createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
            const tableClient = await dataBaseClient.from(supabaseUtil.tableName);
            return tableClient;
        }else{
            if(!process.env.SUPABASE_URL && !process.env.SUPABASE_KEY ){
                throw new Error("missing env variables:" + "process.env.SUPABASE_KEY\n" + "process.env.SUPABASE_URL\n");
            }else if(!process.env.SUPABASE_URL){
                throw new Error("missing process.env.SUPABASE_URL\n");
            }else{
                throw new Error("missing process.env.SUPABASE_KEY\n");
            }
        }
        
    }
    static async getUploadData(uploadId:string){ 
        const tableClient = await supabaseUtil.getTableClient(supabaseUtil.tableName);
        const resp = await tableClient.select().eq("upload_id", uploadId);
        if(resp.success == false){
            throw new Error(resp.error.message);
        }
        return ({success:true, data:{tableRowData:resp.data[0]}, error:undefined});
    }
    static async createNewUpload(uploadId:string, fileName:string){
        const client = await supabaseUtil.getTableClient(supabaseUtil.tableName);
        const resp = await client.insert([{upload_id:uploadId, current_chunk:0, chunk_id:[], is_uploaded:false, is_processed:false, file_name:fileName }])
    }
    //adds the id to table and returns id
    static async  addNewChunkToTable(uploadId:string, chunkId:string){
        const tableData = await supabaseUtil.getUploadData(uploadId);
        const table = await supabaseUtil.getTableClient(supabaseUtil.tableName);
        const chunks = tableData.data.tableRowData.chunk_id == null? []:tableData.data.tableRowData.chunk_id;
        const supabaseResp = await table.update({"chunk_id":[...chunks, chunkId], current_chunk:tableData.data.tableRowData.current_chunk + 1}).eq("upload_id", uploadId);
        return tableData.data.tableRowData.current_chunk + 1; //work on error handling
    }
    static async  completeUpload(uploadId:string){
        const table = await supabaseUtil.getTableClient(supabaseUtil.tableName);
        const chunkIds = (await supabaseUtil.getUploadData(uploadId)).data.tableRowData.chunk_id;
        const supabaseResp = await table.update({"is_uploaded":1}).eq("upload_id", uploadId);
        return supabaseResp;
    }
    static async  completeProcessing(uploadId:string){
        const table = await supabaseUtil.getTableClient(supabaseUtil.tableName);
        const supabaseResp = await table.update({"is_processed":1}).eq("upload_id", uploadId);
        return supabaseResp;
    }

}



