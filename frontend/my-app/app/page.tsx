'use client'
import DocumentChannel from "./components/DocumentChannel";
import "./home.css"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"

type fileInfo = {
  name: string,
  file: ArrayBuffer,
};


export default function Home() {
  let [blobURLS, changeBlobURLS]: [string[], Function] = useState([]);
  const searchParams = useSearchParams();
  useEffect(() => {
    let newBlobUrl = searchParams.get("blob");
    if (newBlobUrl != null) {
      changeBlobURLS([...blobURLS, newBlobUrl])
    }
  }, [])
  let documentDisplays = blobURLS.map((url) => 
    <DocumentChannel blobURL={url}></DocumentChannel>
  )
  return (<>
    <div className="documentNameDisplay">
      {documentDisplays}
    </div>
    <div id='btnDiv'>
      <a href="/upload"><button className="btn" id="upload" form="documentUpload">Upload</button></a>
      <button className="btn" id="clear" form="documentUpload">Clear</button>
    </div>
  </>)
}
