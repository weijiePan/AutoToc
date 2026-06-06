'use client'
import { read } from "fs";
import { SubmitEvent, useState } from "react";
import Stream from "stream";
import { blob } from "stream/consumers";
import {useRouter} from "next/navigation"

export default function Upload() {
    const serverUploadUrl = `http://localhost:3001/`;
    const router = useRouter();
    function uploadDocument(event:SubmitEvent) {
        event.preventDefault();
        const form = new FormData(event.target);
        console.log("aa");
        const document = form.get("document");
        if (document) {
            const newForm = new FormData();
            newForm.append("document", document);
            fetch(serverUploadUrl, {
                method: "POST",
                body: newForm,
            }).then((obj) => obj.blob()).then(
                (blob)=>{
                    const url = URL.createObjectURL(blob);
                    router.push("/" + `?blob=${url}`);
                }
            )
        } else {
            console.log("no file uploaded");
        }
    }
    return (<>
        <form onSubmit={uploadDocument}>
            <input type="text" placeholder="New File Name" name="documentName" ></input>
            <input type="file" multiple name="document" ></input>
            <button type="submit"></button>
        </form>
    </>)
}
