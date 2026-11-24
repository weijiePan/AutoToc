export class ProcessingQueue{
    static queue:string[];
    constructor(){
        ProcessingQueue.queue = [];
    }
    static addToQueue(fileId:string){
        ProcessingQueue.queue.push(fileId);
    }
    static popQueue(fileId:string){
        if(ProcessingQueue.queue.length <= 0) throw new Error("can't remove from empty queue");
        return(ProcessingQueue.queue.splice(0,1));
    }
}