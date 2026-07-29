
import {insertFile} from "./store"
const url = `http://localhost:3001`;
// async function initiateUpload(files:File[]) {
//     console.log("uploading");
//     //get data
//     const documentData = []//{id, documentLink}
//     for(const file of files){
//         console.log("upload initatied");
//         console.log(file.name);
//         const uploadResp = await uploadDocument(file, file.name);
//         if(!uploadResp.success){
//             return({success:false, errorMessage:`${uploadResp.uploadId} failed upload`});
//         }
//         documentData.push(uploadResp.downloadLink);
//     }
//     console.log(documentData);
//     return({success:true, documentData:documentData});

// }
async function uploadDocument(document:Blob, fileName:string, tocStart:Number, tocEnd:Number){
    console.log("ind document upload");
    const initiateEndPoint = "/uploads/start";
    //initiate upload and get upload id
    const initiateResp = await fetch(`${url}${initiateEndPoint}?fileName=${fileName}`);
    const respData = await initiateResp.json()
    if(!respData.success){
        console.log(respData);
        return respData;
    }

    const uploadId = respData.data.uploadId;
    if(!uploadId){
        const err = "invalid/undefined uploadId";
        console.log(err);
        return({success:false, data:null, error:err});
    }
    const docStream = document.stream();
    console.log("started streaming");
    for await(const chunk of docStream as any){
        const chunkResp = await chunkUpload(uploadId, chunk);
        if(!chunkResp.success){
            console.log(chunkResp);
            return(chunkResp);
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
    const respMessage = await resp.json();
    return respMessage;
  
}
async function completeUpload(uploadId:string, tocStart:Number, tocEnd:Number){
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
                console.log(value);
                fragments.push(value);
            }
        }
        const b = new Blob(fragments);
        console.log(b);
        
        await insertFile(b, uploadId);
        return(URL.createObjectURL(b));
    }else{
        throw new Error("download request body null");
    }
    
}
export { uploadDocument, completeUpload}