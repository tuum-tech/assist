import { Injectable } from "@angular/core";
import { Native } from './Native';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalStorageService } from "./localstorage.service";
import { Clipboard } from '@ionic-native/clipboard/ngx';
import {
    LoadingController,
    ToastController,
    AlertController
} from '@ionic/angular';

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


    constructor(public native: Native, 
                private http: HttpClient, 
                private clipboard: Clipboard,
                private toastCtrl: ToastController,
                private alertController: AlertController,
                private localStorage : LocalStorageService) {

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

    async presentAlert(message, action = null) {
        if (action == null) action = ()=>{};
        const alert = await this.alertController.create({
          header: 'Alert',
          message: message,
          buttons: [ {
            text: 'OK',
            handler: action
          }]
        });
    
        await alert.present();
      }

    tryDoLogin(): Promise<boolean> {
        var self = this;

        return new Promise(async (resolve, reject) => {
           
            let profile =  await this.localStorage.getProfile();
            if (profile)
            {
                AppService.signedIdentity = profile;
                resolve(true);
                return;
            }
            
            appManager.sendIntent("credaccess", {
                claims: 
                    { 
                        name: false
                    }
                },
                {},
                (response) => {
                    var nameSubject = self.getSubject(response.result.presentation, "name");
                    console.log(response)
                    AppService.signedIdentity = {
                                didString: response.result.did,
                                didStoreId: response.result.did,
                                name:  nameSubject || ""
                            };
                    this.localStorage.setProfile(AppService.signedIdentity)
                    resolve(true);
                    
                },
                function(err){
                    console.log(err);
                    resolve(false);
                })
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

   

    sendIntentResponse(action, result, intentId) {
        appManager.sendIntentResponse(action, result, intentId, () => {
            AppService.intentConfig = null;
        }, (err) => {
            console.error('sendIntentResponse error!', err);
        });

    }

    public copyClipboard(text) {
        return this.clipboard.copy(text);
      }
    
    public toast(message: string = 'Operation completed', duration: number = 2000): void {
        this.toastCtrl
          .create({
            "message": message,
            "duration": 2000,
            "position": 'middle',
          })
          .then((toast) => toast.present());
      }
}