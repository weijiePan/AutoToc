'use client'
import { read } from "fs";
import { SubmitEvent, useState, useEffect } from "react";
import Stream from "stream";
import { blob } from "stream/consumers";
import {useRouter} from "next/navigation"
import {insertFile} from "../util/store"
import "./upload.css"
import {initiateUpload} from "../util/upload"

type blobURL={url:string, name:string, status:0|1};



export default function Upload() {
    const serverUploadUrl = `http://localhost:3001`;
    const router = useRouter();
    let [documents, changeDocuments] = useState<File[]>([]);
    let [error, changeError] = useState("");
    let [blobs, changeBlobs] = useState([""]);
    const handleDrop = function(e:React.DragEvent<HTMLDivElement>){
        e.preventDefault();
        changeDocuments([...documents, ...Array.from(e.dataTransfer.files)]);
    
    }   
    const handleDragEnter = function(e:React.DragEvent<HTMLLabelElement>){
        e.preventDefault();
        console.log("entered");
    }   
    const handleDragLeave = function(e:React.DragEvent<HTMLLabelElement>){
        e.preventDefault();
        console.log("left");
    }
    const handleDragOver = function(e:React.DragEvent<HTMLLabelElement>){
        e.preventDefault();
    }
    const handleFileSelection = function(e:React.ChangeEvent<HTMLInputElement>){
        changeDocuments([...documents, ...Array.from(e.target.files as FileList)]);
    }
    useEffect(()=>{
        console.log(documents);
    },[documents])
    return (<>
        <label id="uploadDiv" onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDrop={handleDrop}>
           <h3 id="documentUploadTitle">Upload Documents</h3>
           {documents.length < 1? 
            <label className="dropContainer" htmlFor="documentUploadInput" >  
                <div onDrop ={handleDrop} className="lines"></div>
                <div className="lines"></div>
                <div className="lines"></div>
                <div className="lines"></div>
                <div className="lines"></div>
                <div className="lines"></div>
            </label>
            :null
            }
            <input id="documentUploadInput" type="file" onChange={handleFileSelection}></input>
            <button className="submitBtn" type="submit" ><p>submit</p></button>
            <p className="errorText">{error}</p>
        </label> 
        {/* <form  onSubmit={async (e)=>{ 
            const result = await initiateUpload(e)
            if(result.success){
                console.log(result.documentData);
            }else{
                throw new Error("blob link fail");
            }
            
            }
        }>
            <h3 id="documentUploadTitle">Upload Documents</h3>
            <label className="dropContainer" htmlFor="documentUploadInput" >  
                <div onDrop ={handleDrop} className="lines"></div>
                <div className="lines"></div>
                <div className="lines"></div>
                <div className="lines"></div>
                <div className="lines"></div>
                <div className="lines"></div>
                <div className="lines"></div>
                <div className="lines"></div>
                <div className="lines"></div>
            </label>
            <input id="documentUploadInput" type="file" ></input>
            <button className="submitBtn" type="submit" ><p>submit</p></button>
            <p className="errorText">{error}</p>
        </form> */}
        
    </>)
    //for every file, create one fetch request
    //one fetch request, adds to an array of in-progress indicators
    //once the fetch request is done, a use state is changed to show completion
}
