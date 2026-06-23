import { spawn } from "child_process";
import path from "path";
const pythonLocation = "./venv/bin/python";
const editorLocation = path.resolve("./util/editor.py");
const importLocation = path.resolve("./import/document.pdf");
const exportLocation = path.resolve("./export/document.pdf");
async function annotateDocument(tocStart, tocEnd) {
    return new Promise((resolve, reject) => {
        let editing = spawn(pythonLocation, [editorLocation, tocStart, tocEnd, importLocation, exportLocation]);
        editing.stdout.on("data", (data) => {
            console.log("item" + data.toString());
        });
        editing.stderr.on("data", (err) => {
            console.log(err.toString());
            resolve(false);
        });
        editing.on("close", (code) => {
            console.log("end");
            resolve(true);
        });
    });
}
//argument to pass
// tocStart = int(sys.argv[1])
// tocEnd = int(sys.argv[2])
// importLocation = sys.argv[3]
// exportLocation =sys.argv[4]
export { annotateDocument };
//# sourceMappingURL=convert.js.map