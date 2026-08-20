import {createClient} from "@supabase/supabase-js"
import {ContainerClient} from "@azure/storage-blob"
import {v4 as uuidv4} from "uuid"
import path from "path"
import {credentialError, MissingUploadError} from "#src/error.js"
import type {successSupabase, failureResponse} from "#src/type.ts"
export default class supabaseUtil{
    static tableName = "upload";
    static async getTableClient(){
        if(!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY){
            throw new credentialError("lack of supabase credential");
        }
        const dataBaseClient = await createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
        const tableClient = await dataBaseClient.from(supabaseUtil.tableName);
        return tableClient;
            
            
     
        
    }
    static async getUploadData(uploadId:string):Promise<successSupabase>{ 
        const tableClient = await supabaseUtil.getTableClient();
        const resp = await tableClient.select().eq("upload_id", uploadId);
        if(resp.data){
            return ({success:true, data:{tableRowData:resp.data[0]}, error:null});
        }else{
          throw new MissingUploadError(`upload for id ${uploadId} not found`);
        }
        
    }
    static async createNewUpload(uploadId:string, fileName:string){
        const client = await supabaseUtil.getTableClient();
        const resp = await client.insert([{upload_id:uploadId, current_chunk:0, chunk_id:[], is_uploaded:false, is_processed:false, file_name:fileName }])
    }
    //adds the id to table and returns id
    static async  addNewChunkToTable(uploadId:string, chunkId:string){
     
        const tableData = await supabaseUtil.getUploadData(uploadId);
        const table = await supabaseUtil.getTableClient();
        const chunks = tableData.data.tableRowData.chunk_id;
  
        const supabaseResp = await table.update({"chunk_id":[...chunks, chunkId], current_chunk:tableData.data.tableRowData.current_chunk + 1}).eq("upload_id", uploadId);
  
        return tableData.data.tableRowData.current_chunk + 1; //work on error handling
    }
    static async  completeUpload(uploadId:string){
        const table = await supabaseUtil.getTableClient();
        const rowInfo = await supabaseUtil.getUploadData(uploadId)
        const chunkId = rowInfo.data.tableRowData.chunk_id;
        const supabaseResp = await table.update({"is_uploaded":1}).eq("upload_id", uploadId);
        return supabaseResp;
    }
    static async  completeProcessing(uploadId:string){
        const table = await supabaseUtil.getTableClient();
        const supabaseResp = await table.update({"is_processed":1}).eq("upload_id", uploadId);
        return supabaseResp;
    }

}



