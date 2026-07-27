'use client'

import { read } from "fs";
import { SubmitEvent, useState, useEffect } from "react";
import Stream from "stream";
import { blob } from "stream/consumers";
import {useRouter} from "next/navigation"
import {insertFile} from "../util/store"
import "./upload.css"
import {initiateUpload} from "../util/upload"

import DocumentUploadBar from "../components/UploadBar"

type blobURL={url:string, name:string, status:0|1};



export default function Upload() {
    const serverUploadUrl = `http://localhost:3001`;
    const router = useRouter();
    let [documents, changeDocuments] = useState<{name:string, file:File, isInitiated:boolean}[]>([]);
    let [isDocumentUploaded, changeIsDocumentUploaded] = useState<{string:boolean}[]>([]);
    let [error, changeError] = useState("");
    let [blobs, changeBlobs] = useState([""]);
    const handleDrop = function(e:React.DragEvent<HTMLDivElement>){
        e.preventDefault();
        changeDocuments([...documents, ...(Array.from(e.dataTransfer.files).map((file)=>{

            return({name:file.name, file:file, isInitiated:false});
        }))]);
       
    }   
    const handleDragEnter = function(e:React.DragEvent<HTMLLabelElement>){
        e.preventDefault();
    }   
    const handleDragLeave = function(e:React.DragEvent<HTMLLabelElement>){
        e.preventDefault();
    }
    const handleDragOver = function(e:React.DragEvent<HTMLLabelElement>){
        e.preventDefault();
    }
    const handleFileSelection = function(e:React.ChangeEvent<HTMLInputElement>){
        e.preventDefault();
        if(e.target.files){
            changeDocuments([...documents, ...Array.from(e.target.files).map((file)=>{
                return({name:file.name, file:file, isInitiated:false})
            })])
        }
   
    }
    return (
        <>
            <label id="uploadDiv" onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}>
                {documents.length < 1? 
                    <label className="dropContainer" htmlFor="documentUploadInput" >  
                    <svg xmlns="http://www.w3.org/2000/svg" width="5em" height="5em" viewBox="0 0 24 24">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <g fill="none">
                            <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
                            <path fill="hsl(0,0%,95%)" d="M8 9v2H5v9h14v-9h-3V9h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2zm4.884-6.531l3.359 3.358a1 1 0 1 1-1.415 1.415L13 5.413V15a1 1 0 1 1-2 0V5.413L9.172 7.242a1 1 0 1 1-1.415-1.415l3.36-3.358a1.25 1.25 0 0 1 1.767 0" />
                        </g>
                    </svg>
                    </label>
                    :
                    documents.map((file)=><DocumentUploadBar file={file.file} isInitiated = {file.isInitiated}></DocumentUploadBar>)
                }
                <input id="documentUploadInput" type="file" onChange={handleFileSelection}></input>
                <button className="submitBtn" type="submit" onClick={(e)=>{
                    e.preventDefault();
                    // initiateUpload(documents);
                    changeDocuments(documents.map((doc)=>{
                        if(doc.isInitiated == false){
                            doc.isInitiated = true;
                        }
                        return(doc);
                    }));
                }}>submit</button>
                <p className="errorText">{error}</p>
            </label> 
    </>
    )
}
