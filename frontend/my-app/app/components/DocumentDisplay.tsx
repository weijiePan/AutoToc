
import "./DocumentDisplay.css"
export default function DocumentDisplay({fileName, url}:{fileName:string, url:string}){
    return(
    fileName != ""?
    <div className="DocumentDisplay">
        <a href={url}>
            <h3>{fileName}</h3>
        </a>
    </div>:
    <div className="DocumentDisplay">
        <a>
            <h3>Process your document</h3>
        </a>
    </div>
    )
}