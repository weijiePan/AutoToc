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
     
    //adds the id to table and returns id
    static async  addNewChunkToTable(uploadId:string, chunkId:string){
     
        const tableData = await supabaseUtil.getUploadData(uploadId);
        const table = await supabaseUtil.getTableClient();
        const chunks = tableData.data.tableRowData.chunk_id;
  
        const supabaseResp = await table.update({"chunk_id":[...chunks, chunkId], current_chunk:tableData.data.tableRowData.current_chunk + 1}).eq("upload_id", uploadId);
  
        return tableData.data.tableRowData.current_chunk + 1; //work on error handling
    }
    static async  insertProcessedDocument(uploadId:string, fileName:string, size:number){
        const client = await supabaseUtil.getTableClient();
        const resp = await client.insert([{id:uploadId, filename:fileName, filesize:size}]);
        if(resp.status == 200) throw new Error("invalid processed document insert");
        
    }
 
}



