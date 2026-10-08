
import {InvalidFileSize, MissingFile} from "../errors/inputError";
import {maxFileSize} from "../context/DocumentContext"
import { v4 as uuidv4 } from 'uuid';
const status = {
    "uninitiated":"uninitiated",
    "in-progress":"in-progress", 
    "complete":"complete",
    "error":"error",
    
};
export interface Document {
    id:string,
    fileName:String,
    file:File,
    size:number,
    sizeUploaded:number,
    status:String,
    error:String,//api errors
};
export function createDocument(file:File, fileName:String){
    if(file == null){
        throw new MissingFile();
    }
    if(file.size == 0 || (file.size / 1048576) > maxFileSize){
        throw new InvalidFileSize(file.size/1048576);
    }
    return(
        {
            id:uuidv4(),
            fileName:fileName ?? file.name ?? `${new Date()}.pdf`,
            file:file,
            size:file.size,//stored in bytes
            sizeUploaded:0,
            status:status["uininitated"],
            error:null,//api errors

        }
    );
}
export function verifyDocShape(obj){
    const DocShape = {
        fileName:"",
        file:"",
        size:"",
        sizeUploaded:"",
        status:"",
        error:"",//api errors
    }
    for(const i in obj){
       if(DocShape[i] == null){
            throw new Error("invalid documents stored");
       }
    }
    for(const i in DocShape){
       if(obj[i] == null){
            throw new Error("invalid documents stored");
       }
    }
    return 1;
}
export function increaseProgress(Document:Document, bytesUploaded:number){
    return {...Document, sizeUploaded:Document.sizeUploaded + bytesUploaded};
}
export function changeStatus(Document:Document, newStatus:string){

}
export function setError(Document:Document, error:String){
    
}