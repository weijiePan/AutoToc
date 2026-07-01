'use client'
import {useRouter} from "next/navigation"
const databaseName = "documentsDatabase";
const tableName = "document";
function insertFile(file:Blob, fileName:string){
    const request = window.indexedDB.open(databaseName, 1);
    request.onupgradeneeded = function(e){
        const db = request.result;
        const store = db.createObjectStore(tableName, {keyPath:"filename"});
    } 
    request.onerror = function(e){
        console.error("indexedDB open error");
        console.error(e);
    }
    request.onsuccess = function(){
        const db = request.result;
        const transactions = db.transaction(tableName, "readwrite");
        const documentStore = transactions.objectStore(tableName);
        const req = documentStore.put({"filename":fileName, "file":file});
        req.onsuccess = ()=>{
                db.close();
                return(true);
        }
        req.onerror = (e)=>{
            console.error(e);
        }
    }
}
async function getFileUrls(){
    return new Promise((resolve, reject)=>{
        
        let objectURLS = [];
        const request = window.indexedDB.open(databaseName, 1);
        request.onupgradeneeded = function(e){
            const db = request.result;
            const store = db.createObjectStore("document", {keyPath:"filename"});
            
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
                    //{url:string, name:string}
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