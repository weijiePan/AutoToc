export function useDocumentManager(){
    const url = process.env.API_URL;    
    const databaseName = process.env.LOCAL_DB_NAME;
    const tableName = process.env.LOCAL_TABLE_NAME;
    function insertFile(file:Blob, uploadId:string){
        const request = window.indexedDB.open(databaseName, 1);
        request.onupgradeneeded = function(e){
            const db = request.result;
            const store = db.createObjectStore(tableName, {keyPath:"uploadId"});
        } 
        request.onerror = function(e){
            console.error("indexedDB open error");
            console.error(e);
        }
        request.onsuccess = async function(){
            const db = request.result;
            const transactions = db.transaction(tableName, "readwrite");
            const documentStore = transactions.objectStore(tableName);
            const req = documentStore.put({"uploadId":uploadId, "fileName":"", "file":file});
            req.onsuccess = ()=>{
                    db.close();
                    console.log(`insertion of ${uploadId}`);
                    return(true);
            }
            req.onerror = (e)=>{
                console.error(e);
            }
        }
    }
    async function getFileUrls():Promise<{url:string, name:string}>{
        console.log("getFileUrls");
        const endPoint = "/getFileName/"
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
                    console.log("started processing files");
                    files.onsuccess = async ()=>{ 
                        const res = files.result;
                        for(let i = 0; i < res.length; i++){
                            console.log(`${url}${endPoint}/${res[i].uploadId}`);
                            const getFileNameResponse = await (await fetch(`${url}${endPoint}${res[i].uploadId}`)).json();
                            if(getFileNameResponse.success){
                            objectURLS.push({url:URL.createObjectURL(res[i].file), name:getFileNameResponse.data.fileName});
                            }else{
                                objectURLS.push({url:URL.createObjectURL(res[i].file), name:"file name not found"});
                            }
                        }
                        db.close();
                        resolve(objectURLS as any);
                    }; 
                }else{
                    throw new Error("no table name");
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
                window.location.reload();
            }
        }
        return{

        }
    }
    return({
        insertFile,
        getFileUrls,
        clearDatabase,
    });
}