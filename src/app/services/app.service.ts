import { Injectable } from "@angular/core";
import { Native } from './Native';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalStorageService } from "./localstorage.service";
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { ToastController } from '@ionic/angular';
import { ModalDialogController } from "../components/modal-dialog/modal-dialog.controller";
import { ModalDialogEnum } from "../components/modal-dialog/modal-dialog.config";

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;
declare let notificationManager: NotificationManagerPlugin.NotificationManager;

let myService = null;


@Injectable({
    providedIn: 'root'
})
export class AppService {

    static intentConfig: any;
    static signedIdentity: DIDSessionManagerPlugin.IdentityEntry = null;
    private isReceiveIntentReady = false;


    constructor(public native: Native,
        private clipboard: Clipboard,
        private toastCtrl: ToastController,
        private modalDialogController: ModalDialogController,
        private localStorage: LocalStorageService) {

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

    async presentAlert(message, title = "", action = null) {
        if (action == null) action = () => { };
        if (title === "") title = "Alert";
        await this.presentMessage(
            title,
            message,
            ModalDialogEnum.Alert,
            [
                {
                    title: 'Ok',
                    callback: action,
                },
            ]
        );
    }

    async presentInfo(message, title = "", action = null) {
        if (action == null) action = () => { };
        if (title === "") title = "Information";
        await this.presentMessage(
            title,
            message,
            ModalDialogEnum.Info,
            [
                {
                    title: 'Ok',
                    callback: action,
                },
            ]
        );
    }

    async presentSuccess(message, title = "", action = null) {
        if (action == null) action = () => { };
        if (title === "") title = "Success";
        await this.presentMessage(
            title,
            message,
            ModalDialogEnum.Success,
            [
                {
                    title: 'Ok',
                    callback: action,

                },
            ]
        );
    }

    async presentMessage(title, message, dialogType: ModalDialogEnum, buttons) {
        await this.modalDialogController
            .create({
                title: title,
                dialogType: dialogType,
                description: message,
                cancelCallback: () => {
                },
                buttons: buttons,
            })
            .show();
    }
    tryDoLogin(force: boolean = false): Promise<boolean> {
        var self = this;

        return new Promise(async (resolve, reject) => {

            console.log("Try do login")

            appManager.sendIntent("https://did.elastos.net/credaccess", {
                claims:
                {
                    name: false,
                    avatar: false
                }
              },
                {},
                (response) => {

                    var nameSubject = self.getSubject(response.result.presentation, "name");
                    var avatarSubject = self.getSubject(response.result.presentation, "avatar");
                    
                    var avatar = null;

                    if (avatarSubject)
                    {
                        avatar = {
                            contentType: avatarSubject["content-type"],
                            base64ImageData: this.getBase64Image(avatarSubject)
                        }
                    }

                    AppService.signedIdentity = {
                        didString: response.result.did,
                        didStoreId: response.result.did,
                        name: nameSubject || "",
                        avatar: avatar
                    };
                    this.localStorage.setProfile(AppService.signedIdentity)
                    resolve(true);

                },
                function (err) {
                    console.log(err);
                    resolve(false);
                })
        });

    }

    addNewRequestToBackground(id: string)
    {
        let payload = {
            method: "new",
            param: id
        } 

        

        appManager.sendMessage("#service:backgroundservice", AppManagerPlugin.MessageType.INTERNAL, JSON.stringify(payload), ()=>{
            // Nothing to do
        }, (err)=>{
            console.log("Failed to send RPC message to the background service", err);
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
        appManager.setVisible("show");
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

    isObjImage(obj): boolean{
        if (obj !== Object(obj)) return false
        return ('content-type' in obj && obj['content-type'].startsWith("image")) 
    }

    getBase64Image(obj): string{
        return `data:${obj["content-type"]};${obj["type"]},${obj["data"]}`
    }


    setTitleBar() {
        titleBarManager.setTitle('Assist');
        titleBarManager.setIcon(TitleBarPlugin.TitleBarIconSlot.INNER_LEFT, null);
        titleBarManager.setIcon(TitleBarPlugin.TitleBarIconSlot.INNER_RIGHT, null);
        titleBarManager.setIcon(TitleBarPlugin.TitleBarIconSlot.OUTER_RIGHT, null);
        titleBarManager.setBackgroundColor("#005BFF");
        titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);

        
    }

    setBack(action) {
        titleBarManager.setIcon(TitleBarPlugin.TitleBarIconSlot.INNER_LEFT, {
            key: 'back',
            iconPath: TitleBarPlugin.BuiltInIcon.BACK,
        });

        titleBarManager.addOnItemClickedListener((menuIcon) => {
            if (menuIcon.key === 'back') {
              action();
            }
        });
    }
}