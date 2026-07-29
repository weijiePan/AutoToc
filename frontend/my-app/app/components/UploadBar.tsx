"use client"
import {uploadDocument, completeUpload} from "@/util/upload"

import "./UploadBar.css"
import {useState, useEffect} from "react"
export default function DocumentUploadBar({file, isInitiated}:{file:File, isInitiated:boolean}){
    let [isUploaded, changeIsUploaded] = useState(false);
    let [tocStart, changeTocStart] = useState(0);
    let [tocEnd, changeTocEnd] = useState(10);//10 is default
    const color = isInitiated? "hsl(236, 100%, 60%)":"hsl(0, 0%, 15%)";
    console.log("isIinitiated" + isInitiated);
    useEffect(()=>{
        if(isInitiated && !isUploaded){
            console.log("num1" + tocStart);
            console.log("num2" + tocEnd);
            uploadDocument(file, file.name, tocStart, tocEnd).then((uploadResp)=>{
                console.log(uploadResp)
            })
        }
    },[isInitiated])
    //const tocStart = Number(req.query.tocStart);
    //const tocEnd = Number(req.query.tocEnd);
    return(
    <div className="documentUploadBar" style={{
        backgroundColor:color
    }}>
        <div className="left">
            <h3>{file.name}</h3>
        </div>
        <div className="right">
            <div>
                <label>TOC Start</label>
                <input type="number" value={tocStart} onChange={(e)=>{
                    changeTocStart(Number(e.target.value));
                }}></input>
            </div>
             <div>
                <label>TOC End</label>
                <input type="number" value={tocEnd} onChange={(e)=>{
                    changeTocEnd(Number(e.target.value));
                }}></input>
            </div>
        </div>

    </div>
    )
}