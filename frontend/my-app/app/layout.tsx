'use client'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {getFileUrls, clearDatabase} from "./util/store"
import {useRouter} from "next/navigation"
import {useState} from "react"
import Upload from "./upload/Upload"
import "./globals.css";
/*#F5E7DE#F2BFA4
Kaffestuggu*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  let [isUploadOn, changeIsUploadOn] = useState(false);
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <header>
            <a href="/">
              <img className="logo" id="header-logo" src="/pdf-icon.png"></img>
            </a>
            <input className="search-bar" placeholder="Search"></input>
            <button className="file-button" onClick={()=>{
              changeIsUploadOn(isUploadOn?false:true)
            }}>UPLOAD</button>
            <button className="file-button" onClick={()=>{
              clearDatabase(router)
            }}>CLEAR</button>
        </header>
        {isUploadOn?<Upload></Upload>:null}
        {children}
        </body>
    </html>
  );
}
{/* <div id='btnDiv'>
      <a href="/upload"><button className="btn" id="upload" form="documentUpload">Upload</button></a>
      <button className="btn" id="clear" form="documentUpload" onClick={()=>{clearDatabase(router)}}>Clear</button>
    </div> */}
