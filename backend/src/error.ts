class credentialError extends Error{
    constructor(message:string){
       super(message); 
       this.name = "credentialError";
    }
}
class MissingUploadError extends Error{
    constructor(message:string){
        super(message);
        this.name = "missingUploadError";
    }
}

export {credentialError, MissingUploadError }