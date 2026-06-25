import {envPath} from "../server.js"
import dotenv from "dotenv"
import fsPromise from "fs/promises"
import path from "path"
dotenv.config({path:envPath});

import {uploadBlock, completeUploadAzure} from "./util/database/blob_storage.js"

async function mockUpload(){
    const filePath = path.join("./", "../", "files/a.txt");
    const fileData = await fsPromise.readFile(filePath, "utf8");
    console.log(await uploadBlock("a", fileData, "a"));
}
mockUpload();