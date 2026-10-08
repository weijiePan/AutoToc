import {createContext, useContext, useState} from "react"; 
import {FileUpload} from "../model/doc"
import {useFileManager} from "../api/fileOperations/useFileManager"
import {createDoc} from "../model/docList";
export const maxFileSize = 20;//20mb

const UploadContext = createContext(null);
const {files, updateFiles} = useFileManager();
export function useUpload(){
    const value = useContext(UploadContext);
    if(value == null) throw new Error("useUpload must be used inside <UploadProvider></UploadProvider>");
    
}

export function UploadProvider({children}){
    let [fileUploads, setFileUploads] = useState(null);
    let [files, getFiles] = useState(null);
    function addNewUpload(f:FileUpload){
      setFileUploads(fileUploads.toSpliced(-1, 0, f));
    }
    function deleteUpload(fileId ){
        setFileUploads(fileUploads, );
    }
    function getUploads(fileId){

    }
    const value={
        files: files,
    }

    return(<UploadContext value={value}>
        {children}
    </UploadContext>)
}
