'use client'

import "./home.css"
import { useState, useEffect } from "react"
import { useSearchParams , useRouter} from "next/navigation"
import {getFileUrls, clearDatabase} from "./util/store"
import Upload from "./upload/Upload"

import DocumentDisplay from "./components/DocumentDisplay"
type fileInfo = {
  name: string,
  file: ArrayBuffer,
};

type blobURL={url:string, name:string};
export default function Home() {
  const status = {
    processing:0,
    completed:1,
  };
  let [isDocumentsPage, changeIsDocumentsPage] = useState(true);
  let [blobURLS, changeBlobURLS]: [blobURL[], Function] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    console.log('start finding urls');
    getFileUrls().then((blobsAndName)=>{
      console.log(blobsAndName);
      changeBlobURLS(blobsAndName);
    })  
  }, [])
  let documentDisplays = [];
  if(blobURLS.length > 0){
    for(let blobUrl of blobURLS){
        documentDisplays.push(<DocumentDisplay fileName={blobUrl.name} url={blobUrl.url}></DocumentDisplay>);
    }
  }else{
    for(let i = 0; i < 10; i++){
      documentDisplays.push(<DocumentDisplay fileName={""} url={""}></DocumentDisplay>)
    }
  }
  return (
  <div className="main">
    <div className="navigation">
      <h3 onClick={()=>{
        changeIsDocumentsPage(true);
      }}>Documents</h3>
      <h3 onClick={
        ()=>{
          changeIsDocumentsPage(false);
        }
      }>Upload</h3>
    </div>
     <hr className="navDivider"></hr>
    {
      isDocumentsPage?
      <>
     
      <input className="search-bar" placeholder="Search"></input>
      <div className="documentDisplayContainer">
        <div className="documentNameDisplay">
          {documentDisplays}
        </div>  
      </div>
      </>:
      <>
        <p></p>
        <Upload></Upload>
      </>
    }
   
  </div>)
}
