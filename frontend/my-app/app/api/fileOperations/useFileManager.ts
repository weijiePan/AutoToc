import {useState} from "react";
export function useFileManager(){
    const [files, setFiles] = useState([]);
    //makes call to backend or cache to update files
    function updateFiles(){

    }
    return{
        
        files,
        updateFiles
    };
}