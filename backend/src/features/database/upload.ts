import "tsconfig-paths/register"
import {v4 as uuidv4} from "uuid"
function createBase64BlockId(currentChunk:number):string{
    const s = 8;
    let chunk = currentChunk.toString();
    while(chunk.length < s){
        chunk = "0" + chunk;
    }
       
    const buffer = Buffer.from(chunk, "utf8");
    const chunkId = buffer.toString("base64");
    return chunkId;
    
}
async function initiateUpload(){


}
