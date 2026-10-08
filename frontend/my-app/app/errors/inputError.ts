import {maxFileSize} from "../context/uploadContext"
export class InvalidFileSize extends Error{
    constructor(filesize){//get filesize in mb
        if(filesize == 0) super("empty file");
        if(filesize >= maxFileSize) super(`upload size larger than limit: ${maxFileSize}mb`);
    }
}
export class MissingFile extends Error{
    constructor(){
        super("upload file missing");
    }
}