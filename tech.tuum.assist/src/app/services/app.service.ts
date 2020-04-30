import { Injectable } from "@angular/core";
import { Native } from './Native';
import { HttpClient, HttpHeaders } from "@angular/common/http";
declare let appManager: AppManagerPlugin.AppManager;
let appManagerObj = null;
let myService = null;


@Injectable({
    providedIn: 'root'
})
export class AppService {

    static intentConfig: any;

    private isReceiveIntentReady = false;

    
    constructor(public native: Native,  private http: HttpClient) {
        
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
        console.log(intent);
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

    sendPost(url, data) : Promise<any> {
        return new Promise((resolve, reject) =>{
            
            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
            })
            this.http.post(url, data, {"headers": headers}).toPromise().then(response =>{
                console.log(response)
                resolve(response)
            }).catch(err=>{
                console.log("send err", err)
                reject(err)
            });
        })
    }

    sendIntentResponse(action, result, intentId) {
        appManager.sendIntentResponse(action, result, intentId, () => {
            AppService.intentConfig = null;
        }, (err) => {
            console.error('sendIntentResponse error!', err);
        });
        
    }
}