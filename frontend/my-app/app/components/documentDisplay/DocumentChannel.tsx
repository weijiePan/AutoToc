
import Image from "next/image";
import "./DocumentChannel.css"
export default function DocumentChannel({blobURL, name}:{blobURL:string, name:string}){
    return(
        <a className="documentChannel" href={blobURL}>
            <img src ="/pdf-icon.png"></img>
            <p className="documentName">{name}</p>
        </a>
    )
    
}