'use client'

import "./home.css"
import { useState, useEffect } from "react"
import { useSearchParams , useRouter} from "next/navigation"
import {getFileUrls, clearDatabase} from "./util/store"
import Upload from "./upload/Upload"
import DocumentChannel from "./components/documentDisplay/DocumentChannel";
import EmptyDocumentChannel from "./components/documentDisplay/EmptyDocumentChannel"

type fileInfo = {
  name: string,
  file: ArrayBuffer,
};

type blobURL={url:string, name:string, status:0|1};
export default function Home() {
  const status = {
    processing:0,
    completed:1,
  };
  let [blobURLS, changeBlobURLS]: [blobURL[], Function] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    fetch("http://localhost:3001").then(
      (res)=>{
        let body = res.body;
        let reader = body.getReader();
        reader.read().then(({done, value})=>{
          console.log(value);
          console.log("separator");
          if(done){
            console.log("done");
          }
        })
      }
    );
    
    // getFileUrls().then((blobAndName)=>{
    //   changeBlobURLS(blobAndName);
    //   console.log(blobAndName);
    // })
  }, [])
  let documentDisplays;
  if(blobURLS.length > 0){
    documentDisplays = blobURLS.map(({url, name, status}) => 
      status == 1?<DocumentChannel blobURL={url} name={name} key={name} ></DocumentChannel>:null
    )
  }else{
    documentDisplays = <>
      <EmptyDocumentChannel></EmptyDocumentChannel>
      <EmptyDocumentChannel></EmptyDocumentChannel>
      <EmptyDocumentChannel></EmptyDocumentChannel>
      <EmptyDocumentChannel></EmptyDocumentChannel>
      <EmptyDocumentChannel></EmptyDocumentChannel>
      <EmptyDocumentChannel></EmptyDocumentChannel>
    </>
  }

  return (
  <div className="main">
    <div className="progress-side">
      <h3 className="title">Processing</h3>
    </div>
    <div className="documentDisplayContainer">
      <h3 className="title">Processed Documents</h3>
      <div className="documentNameDisplay">
        {documentDisplays}
      </div>  
    </div>
  </div>)
}
