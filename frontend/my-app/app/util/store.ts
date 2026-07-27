'use client'
import {useRouter} from "next/navigation"
const databaseName = "documentsDatabase";
const tableName = "document";


function insertFile(file:Blob, fileName:string, uploadId:string){
    console.log("file");
    console.log(file);
    console.log("fileName");
    console.log(fileName);
    console.log("uploadId");
    console.log(uploadId);
    const request = window.indexedDB.open(databaseName, 1);
    request.onupgradeneeded = function(e){
        const db = request.result;
        const store = db.createObjectStore(tableName, {keyPath:"uploadId"});
    } 
    request.onerror = function(e){
        console.error("indexedDB open error");
        console.error(e);
    }
    request.onsuccess = function(){
        const db = request.result;
        const transactions = db.transaction(tableName, "readwrite");
        const documentStore = transactions.objectStore(tableName);
        const req = documentStore.put({"uploadId":uploadId, "fileName":fileName, "file":file});
        req.onsuccess = ()=>{
                db.close();
                return(true);
        }
        req.onerror = (e)=>{
            console.error(e);
        }
    }
}
async function getFileUrls():Promise<{url:string, name:string}>{
    return new Promise((resolve, reject)=>{
        
        let objectURLS = [];
        const request = window.indexedDB.open(databaseName, 1);
        request.onupgradeneeded = function(e){
            const db = request.result;
            const store = db.createObjectStore("document", {keyPath:"uploadId"});
            
        } 
        request.onerror = (e)=>{
            reject(e);
        }
        request.onsuccess = ()=>{
            const db = request.result;
            if(db.objectStoreNames.contains(tableName)){
                const transaction = db.transaction(tableName, "readonly");
                const documentStore = transaction.objectStore(tableName);
                const files = documentStore.getAll();
                files.onsuccess = ()=>{ 
                    const res = files.result;
                    for(let i = 0; i < res.length; i++){
                        objectURLS.push({url:URL.createObjectURL(res[i].file), name:res[i].filename});
                    }
                    db.close();
                    resolve(objectURLS);
            }; 
            }else{
                return([]);
            }
            
        }
    })

}
function clearDatabase(router){
    const req = window.indexedDB.open(databaseName);
    req.onerror = (e)=>{
        console.error(e);
    }
    req.onsuccess = ()=>{
        const transaction = req.result.transaction(tableName, "readwrite");
        const documentQuery = transaction.objectStore(tableName);
        const deleteReq = documentQuery.clear();
        deleteReq.onsuccess = ()=>{
            console.log("delete");
            window.location.reload();
            console.log("refreshed");
        }
    }
}
export {insertFile, getFileUrls, clearDatabase};