import { Injectable } from "@angular/core";
import { Native } from './Native';
declare let appManager: AppManagerPlugin.AppManager;
let appManagerObj = null;
let myService = null;


@Injectable({
    providedIn: 'root'
})
export class AppService {

    static intentConfig: any;

    private isReceiveIntentReady = false;

    
    constructor(public native: Native) {
        
        myService = this;
    }

    init(){

    }

    setIntentListener() {
        if (!this.isReceiveIntentReady) {
            this.isReceiveIntentReady = true;
            appManager.setIntentListener((intent: AppManagerPlugin.ReceivedIntent)=>{
              this.onReceiveIntent(intent);
            });
        }
    }

    onReceiveIntent(intent: AppManagerPlugin.ReceivedIntent) {
        console.log("Intent received message:", intent.action, ". params: ", intent.params, ". from: ", intent.from);
        AppService.intentConfig = {};
        AppService.intentConfig.transfer = {
            memo: intent.params.memo || '',
            intentId: intent.intentId,
            action: intent.action,
            from: intent.from,
            payPassword: '',
            fee: 0,
            didrequest: intent.params.didrequest,
            chainId: 'IDChain',
        };
        myService.native.go('/tab2Root');
    }

    sendIntentResponse(action, result, intentId) {
        appManager.sendIntentResponse(action, result, intentId, () => {
            AppService.intentConfig = null;
        }, (err) => {
            console.error('sendIntentResponse error!', err);
        });
        
    }
}