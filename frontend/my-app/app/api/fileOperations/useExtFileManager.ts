'use client'
import {useRouter} from "next/navigation"
import path from "path"
import url from "url"
const databaseName = "documentsDatabase";
const tableName = "document";
import { createClient } from '@supabase/supabase-js'

export function useDocumentManager(){
    const url = process.env.API_URL;

    async function uploadDocument(document:Blob, fileName:string, tocStart:Number, tocEnd:Number){
        const initiateEndPoint = "/uploads/start";
        //initiate upload and get upload id
        const initiateResp = await fetch(`${url}${initiateEndPoint}?fileName=${fileName}`);
        if(initiateResp.status != 200){
            console.log("failed");
            return;
        }
        const uploadId = (await initiateResp.json()).data.uploadId;
        const docStream = document.stream();
        for await(const chunk of docStream as any){
            const chunkResp = await chunkUpload(uploadId, chunk);
            if(chunkResp.status != 200){
                throw new Error("chunk upload failed");
            }
            
        }

        const completion = await completeUpload(uploadId, tocStart, tocEnd);
        //upload each chunks
        return({success:true, data:{uploadId:uploadId}, downloadLink:completion});
    }

    async function chunkUpload(uploadId:string, data:Blob){
        const uploadEndPoint = "/uploads/upload";
        const resp = await fetch(`${url}${uploadEndPoint}/${uploadId}`,{
            headers:{
                "Content-Type":"application/octet-stream",
                "Content-Length":`data.size`,
            },
            method:"POST",   
            body:data,
        })
        return resp;
    
    }
    async function completeUpload(uploadId:string, tocStart:Number, tocEnd:Number){
        console.log("completeUpload");
        const completeEndPoint = `/uploads/complete`;
        console.log("tocStart " + tocStart);
        console.log("tocEnd " + tocEnd);
        const resp = await fetch(`${url}${completeEndPoint}/${uploadId}?tocStart=${tocStart}&tocEnd=${tocEnd}`);
        const body = resp.body;
        if(body){
            const reader = body.getReader();
            let fragments = [];
            while(true){
                const {done, value} = await reader.read();
                if(done){
                    break;
                }else{
                    console.log("value");
                    fragments.push(value);
                }
            }
            const b = new Blob(fragments);
            console.log(b);
            
            return(URL.createObjectURL(b));
        }else{
            throw new Error("download request body null");
        }
    }
    return{
        uploadDocument,
        chunkUpload,
        completeUpload,
    }
}

