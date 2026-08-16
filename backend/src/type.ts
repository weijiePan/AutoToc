interface result{
    data: any,
    error:string,
    status:number
}
interface successResponse{
    success:true,
    data:object,
    error:null
}
interface failureResponse{
    success:false,
    data:null,
    error:string
}
interface successSupabase extends successResponse{
    data:{
        tableRowData:{
            upload_id:string, 
            current_chunk:number,
            chunk_id:string[],
            is_uploaded:boolean
            is_processed:boolean,
            file_name:string,
        }
    }
}
export {result, successResponse, failureResponse, successSupabase}
