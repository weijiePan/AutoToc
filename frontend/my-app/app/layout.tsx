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
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <header>
            <a className="logo" href="/">
              <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z"/>
                <path fill="hsl(0,0%,100%)" fillRule="evenodd" d="M6.271 2.112c-.81.106-1.238.301-1.544.6c-.305.3-.504.72-.613 1.513C4.002 5.042 4 6.124 4 7.675v8.57a4.2 4.2 0 0 1 1.299-.593c.528-.139 1.144-.139 2.047-.138H20V7.676c0-1.552-.002-2.634-.114-3.451c-.109-.793-.308-1.213-.613-1.513c-.306-.299-.734-.494-1.544-.6c-.834-.11-1.938-.112-3.522-.112H9.793c-1.584 0-2.688.002-3.522.112m.488 4.483c0-.448.37-.811.827-.811h8.828a.82.82 0 0 1 .827.81a.82.82 0 0 1-.827.811H7.586a.82.82 0 0 1-.827-.81m.827 2.973a.82.82 0 0 0-.827.81c0 .448.37.811.827.811h5.517a.82.82 0 0 0 .828-.81a.82.82 0 0 0-.828-.811z" clipRule="evenodd" />
                <path fill="hsl(0,0%,100%)" d="M7.473 17.135H20c-.003 1.13-.021 1.974-.113 2.64c-.109.793-.308 1.213-.613 1.513c-.306.299-.734.494-1.544.6c-.834.11-1.938.112-3.522.112H9.793c-1.584 0-2.688-.002-3.522-.111c-.81-.107-1.238-.302-1.544-.601c-.305-.3-.504-.72-.613-1.513c-.041-.3-.068-.637-.084-1.02a2.46 2.46 0 0 1 1.697-1.537c.29-.076.667-.083 1.746-.083" />
              </svg>
                <h1>Auto TOC</h1>
            </a>
            <div className="right">
              <button>
                Login
              </button>
              <button>
                Sign Up
              </button>
            </div>
       

        </header>
        {children}
        </body>
    </html>
  );
}
{/* <div id='btnDiv'>
      <a href="/upload"><button className="btn" id="upload" form="documentUpload">Upload</button></a>
      <button className="btn" id="clear" form="documentUpload" onClick={()=>{clearDatabase(router)}}>Clear</button>
    </div> */}
