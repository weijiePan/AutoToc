
import "./DocumentDisplay.css"
export default function DocumentDisplay({fileName, url}:{fileName:string, url:string}){
    return(
    fileName != ""?
    <a className="DocumentDisplay" target="_blank" href={url}>
                <h3>{fileName}</h3>   
    </a>:
    <div className="DocumentDisplay">
            <h3>Process your document</h3>
    </div>
    )
}