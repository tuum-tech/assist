import { Injectable } from "@angular/core";
import { Native } from './Native';
import { HttpClient, HttpHeaders } from "@angular/common/http";
declare let appManager: AppManagerPlugin.AppManager;
declare let didManager: DIDPlugin.DIDManager;
declare let didSessionManager: DIDSessionManagerPlugin.DIDSessionManager;
let appManagerObj = null;
let myService = null;


@Injectable({
    providedIn: 'root'
})
export class AppService {

    static intentConfig: any;
    static signedIdentity: DIDSessionManagerPlugin.IdentityEntry = null;
    private isReceiveIntentReady = false;


    constructor(public native: Native, private http: HttpClient) {

        myService = this;
    }

    init() {
        this.setIntentListener()
    }

    setIntentListener() {
        if (!this.isReceiveIntentReady) {
            this.isReceiveIntentReady = true;
            appManager.setIntentListener((intent: AppManagerPlugin.ReceivedIntent) => {
                this.onReceiveIntent(intent);
            });
        }
    }

    tryDoLogin(): Promise<boolean> {
        var self = this;

        return new Promise((resolve, reject) => {
            AppService.signedIdentity = {
                didString: "did:elastos:iWm3fwhsVbXJ1ecSi7n7Q9L6qNmH14FsuN",
                didStoreId: "did:elastos:iWm3fwhsVbXJ1ecSi7n7Q9L6qNmH14FsuN#Primary",
                name: "Ricardo Trapp"
            };
            resolve(true);

            //did:elastos:iWm3fwhsVbXJ1ecSi7n7Q9L6qNmH14FsuN
            // didSessionManager.getSignedInIdentity().then((id: DIDSessionManagerPlugin.IdentityEntry) => {
            //     console.log('Signed ID', id);
            //     AppService.signedIdentity = id;
            //       resolve(true)    
            //   }).catch(err =>{
            //       console.log(err)
            //       resolve(false)
            //   });
        });

    }

    private getSubject(presentation, fragment): any {
        var subject = null;
        presentation.verifiableCredential.forEach(vc => {
            let element = vc.credentialSubject[fragment]
            if (element != null) {
                subject = element;
            }
        });
        return subject;
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
        myService.native.go('/create');
    }

    sendPost(url, data): Promise<any> {
        return new Promise((resolve, reject) => {

            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': "assist-restapi-secret-key"
            })
            this.http.post(url, data, { "headers": headers }).toPromise().then(response => {
                console.log(response)
                resolve(response)
            }).catch(err => {
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