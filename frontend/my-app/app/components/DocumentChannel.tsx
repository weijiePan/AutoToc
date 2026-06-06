
import Image from "next/image";
import "./DocumentChannel.css"
export default function DocumentChannel({blobURL}:{blobURL:string}){
    return(
    
    <div className="documentChannel">
        <div>
            <a href={blobURL}>
                <img src ="/pdf-icon.png"></img>
            </a>
            <h3 className="documentName">title</h3>
            
        </div>
    </div>)
}