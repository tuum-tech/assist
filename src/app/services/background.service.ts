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
            let rpcMessage = JSON.parse(message.message) as RPCMessage;
            switch (rpcMessage.method) {
                case "new":

                    notificationManager.sendNotification({
                        key: rpcMessage.param,
                        title: `Your DID document ${rpcMessage.param} is being published`
                    })

                    let keys = await this.getCollectionFromStorage(BackgroundService.BUFFER_KEY)
                    keys.push(rpcMessage.param)
                    this.localstorage.add(BackgroundService.BUFFER_KEY, keys)
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

            let buffer = await this.getCollectionFromStorage(BackgroundService.BUFFER_KEY)
            this.localstorage.add(BackgroundService.BUFFER_KEY, [])
            let keys = await this.getCollectionFromStorage(BackgroundService.TRANSACTION_KEY)
            
            keys = keys.concat(buffer)

            if (keys.length > 0) {
                var results: RequestDTO[] = await Promise.all(keys.map(key => {
                    return this.requestsService.getRequestFromId(key)
                }));

                let pendingKeys = []
                results.forEach(request => {
                    if (request.status == "Completed"){
                        notificationManager.sendNotification({
                            key: request.id,
                            title: `Your DID document ${request.id} is now published on the blockchain`
                        })
                    } else {
                        pendingKeys.push[request.id]
                    }
                })

                this.localstorage.add(BackgroundService.TRANSACTION_KEY, pendingKeys)
                this.verifyPendingTransactions()
            }
            else {
                this.verifyPendingTransactions()
            }

          
        }, (environment.verificationDelay * 60) * 1000 )
    }
   
}