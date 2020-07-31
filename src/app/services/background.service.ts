import { Injectable } from "@angular/core";
import { LocalStorageService } from "./localstorage.service";
import { environment } from "src/environments/environment";
import { RequestsService } from "./requests.service";
import { RequestDTO } from "../models/request.model";

declare let appManager: AppManagerPlugin.AppManager;
declare let notificationManager: NotificationManagerPlugin.NotificationManager;

type RPCMessage = {
    method: string;
    param: any;
}

@Injectable({
    providedIn: 'root'
})
export class BackgroundService{
    static readonly BUFFER_KEY: string = "buffer";
    static readonly TRANSACTION_KEY: string = "transaction";

    constructor(private localstorage: LocalStorageService,
                private requestsService: RequestsService) {
    }

    initialize(){
        appManager.setListener(async (message: AppManagerPlugin.ReceivedMessage) => {
            console.log(message)
            let rpcMessage = JSON.parse(message.message) as RPCMessage;
            console.log(rpcMessage)
            switch (rpcMessage.method) {
                case "new":
                    console.log("New request to monitor", rpcMessage.param)
                    notificationManager.sendNotification({
                        key: rpcMessage.param,
                        title: `Your DID document with confirmation ID "${rpcMessage.param}" is being published`,
                        message: `Your DID document with confirmation ID "${rpcMessage.param}" is being published`
                    })

                    let keys = await this.getCollectionFromStorage(BackgroundService.BUFFER_KEY)
                    keys.push(rpcMessage.param)
                    await this.localstorage.setValue(BackgroundService.BUFFER_KEY, keys)
                    this.verifyPendingTransactions();
                    break;
                default:
                    break;
            }
        });
        this.verifyPendingTransactions();
        
    }

    private async getCollectionFromStorage(key: string)
    {
        let values = await this.localstorage.getValue<string[]>(key)
        return values || []
    }

    verifyPendingTransactions(){
        setTimeout(async () =>{
            console.log("Verifing pending transactions")
            let buffer = await this.getCollectionFromStorage(BackgroundService.BUFFER_KEY)
            await this.localstorage.setValue(BackgroundService.BUFFER_KEY, [])
            let keys = await this.getCollectionFromStorage(BackgroundService.TRANSACTION_KEY)
            
            keys = keys.concat(buffer)

            if (keys.length > 0) {
                var results: RequestDTO[] = await Promise.all(keys.map(key => {
                    return this.requestsService.getRequestFromId(key)
                }));

                var completeKeys = []
                results.forEach(request => {
                    console.log("item")
                    if (request != null && request.status == "Completed"){
                        console.log("Transaction ", request.id)
                        completeKeys.push(request.id)
                        notificationManager.sendNotification({
                            key: request.id,
                            title: `Your DID document with confirmation ID "${request.id}" is now published on the blockchain`,
                            message: `Your DID document with confirmation ID "${request.id}" is now published on the blockchain`
                        })
                        
                    }
                })
                let pendingKeys = keys.filter(x => !completeKeys.includes(x));
                await this.localstorage.setValue(BackgroundService.TRANSACTION_KEY, pendingKeys)
                if (pendingKeys.length > 0) this.verifyPendingTransactions()
            }
            else {
                console.log("No pending transactions")
            }

          
        }, (environment.verificationDelay * 60) * 1000 )
    }
   
}