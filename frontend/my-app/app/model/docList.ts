import {Document} from "./doc"
import {createDocument, verifyDocShape} from "./doc"

export function createDocList(docsJson:string){
    if(docsJson == null) return [];
    const arr:Array<Document> = JSON.parse(docsJson);
    for(let i = 0; i < arr.length; i++) verifyDocShape;
    return arr;
};

export function addDoc(docList:Document[], File:File, fileName:string){
    docList.splice(docList.length, 0, createDocument(File, fileName));
}
export function removeDoc(docList:Document[], id:string){
    let i = 0; 
    while(i < docList.length && id != docList[i].id) i++;
    if(i >= docList.length || id != docList[i].id) throw new Error('no document found');
    docList.splice(i, 1);
}


