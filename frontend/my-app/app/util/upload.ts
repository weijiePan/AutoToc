
const url = `http://localhost:3001`;
async function initiateUpload(event:any) {
   
    //get data
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const files = formData.getAll("file") as File[];
    const documentData = []//{id, documentLink}
    for(const file of files){
        console.log("upload initatied");
        const uploadResp = await uploadDocument(file);
        if(!uploadResp.success){
            return({success:false, errorMessage:`${uploadResp.uploadId} failed upload`});
        }
        documentData.push(uploadResp.downloadLink);
    }
    return({success:true, documentData:documentData});

}
async function uploadDocument(document:Blob){
    const initiateEndPoint = "/uploads/start";
    //initiate upload and get upload id
    const initiateResp = await fetch(`${url}${initiateEndPoint}`,{
        headers:{
            "content-type":"application/json",
        },
        method:"POST",
        body:undefined,
    });
    const respData= await initiateResp.json();
    const uploadId = respData.uploadId;

    const docStream = document.stream();
    for await(const chunk of docStream){
        const chunkResp = await chunkUpload(uploadId, chunk);
        if(!chunkResp.success){
            throw new Error("chunk upload fail");
        }
    }
    const completion = await completeUpload(uploadId);
    //upload each chunks
    return({success:true, uploadId:uploadId, downloadLink:completion});
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
    if(respMessage.success){
        return respMessage;
    }else{
        throw new Error("failure upload", respMessage);
    }
  
}
async function completeUpload(uploadId:string){
    const completeEndPoint = `/uploads/complete`;
    const resp = await fetch(`${url}${completeEndPoint}/${uploadId}`);
    const body = resp.body;
    const reader = body.getReader();
    let fragments = [];
    while(true){
        const {done, value} = await reader.read();
        if(done){
            break;
        }else{
            fragments.push(value);
        }

    }
    const b = new Blob(fragments);
    return(URL.createObjectURL(b));
}
export { initiateUpload}