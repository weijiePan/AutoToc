import {Router} from "express"

const uploadRoute = Router();


uploadRoute.post("/uploads/start",(req,res)=>{
    const uploadID = uuidv4();
    //upload id to supabase
    res.send(JSON.stringify({uploadId:uploadId}));

})
uploadRoute.post("/uploads/upload/id", (req,res)=>{
    //upload to aws
    //wait till upload is successful to return a response
    //generate and store chunk id in supabase
    //give next chunk id
    //give status:success or failure

})
uploadRoute.get("/uploads/complete/id", (req,res)=>{
    //upload id 
    //blob commmit everything
    //respond if a success
    //sends data back
})


export{uploadRoute};