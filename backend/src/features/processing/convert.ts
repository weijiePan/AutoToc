import { spawn } from "child_process";
import {fileURLToPath} from "url"

import path from "path";

const srcFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), "../", "../", "../");

const pythonLocation = "/usr/bin/python3";
const editorLocation = path.resolve(srcFolder, "modules", "util", "processing", "editor.py");
const tmpFolder = path.resolve(srcFolder, "tmp");
const importFolder = path.join(tmpFolder, "import");
const exportFolder = path.join(tmpFolder, "export");

async function annotateDocument(documentName:string, tocStart:number, tocEnd:number ) {
    console.log("documentName", documentName);
    const importLocation = path.resolve(importFolder, documentName);
    const exportLocation = path.resolve(exportFolder, documentName);
    console.log("import location", importLocation);
    console.log("exportLocation", exportLocation);
    return new Promise<{success:boolean}>((resolve, reject) => {
        let editing = spawn(pythonLocation, [editorLocation, tocStart.toString(), tocEnd.toString(), importLocation, exportLocation]);
        editing.stdout.on("data", (data) => {
            console.log("item" + data.toString());
        });
        editing.stderr.on("data", (err) => {
            throw new Error(err.toString);
        });
        editing.on("close", (code) => {
            console.log("end");
            resolve({success:true});
        });
    });
}

//argument to pass
// tocStart = int(sys.argv[1])
// tocEnd = int(sys.argv[2])
// importLocation = sys.argv[3]
// exportLocation =sys.argv[4]
export { annotateDocument, importFolder, exportFolder };
