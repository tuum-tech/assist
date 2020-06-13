import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { Native } from 'src/app/services/Native';
import { Router } from '@angular/router';
import { HttpHelper } from 'src/app/services/httphelper.service';
import { RequestDTO } from 'src/app/models/request.model';
import { PostDTO } from 'src/app/models/httpresponse.model';


declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;
declare let didManager: DIDPlugin.DIDManager;


@Component({
  selector: 'page-create',
  templateUrl: 'create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage {

  payload: string;
  did: string;
  profileValues = []
  memo:string;
  hasTransaction: boolean = false;
  endTransaction: boolean = false;
  timer: number;
  requestId: string;
  constructor(public navCtrl: NavController, 
              private appService: AppService, 
              private native: Native, 
              public router: Router,
              private httpService: HttpHelper) {
    
  }

  ionViewDidEnter() {
    // When the main screen is ready to be displayed, ask the app manager to make the app visible,
    // in case it was started hidden while loading.
    appManager.setVisible("show");



    // Update system status bar every time we re-enter this screen.
    titleBarManager.setTitle("Assist");
    titleBarManager.setBackgroundColor("#005BFF");
    titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);
  }

  ionViewWillEnter() {
    console.log(AppService.intentConfig);
      
    setTimeout(()=> this.refresh(), 500)
    
  }

  refresh() {
    console.log("config", AppService.intentConfig);
    if (AppService.intentConfig && AppService.intentConfig.transfer) {
      let credentials = JSON.parse(atob(AppService.intentConfig.transfer.didrequest.payload));
      this.did = credentials.id;
     

      var values = [];
      if (credentials.verifiableCredential)
      {
        credentials.verifiableCredential.forEach(function (value) {
          let credId = value.id.replace("#", "");
          values.push({
            "header": credId,
            "value": value.credentialSubject[credId]
          })
        }); 
      }
      this.profileValues = values;
      this.endTransaction = false;
      this.hasTransaction = true;
    }
    else {
      this.hasTransaction = false;
      this.endTransaction = false;
      this.did = ""
      this.profileValues =[]
      this.payload = "";
      this.memo = "";

      var redirectPage = "onboarding"
      if (AppService.signedIdentity)
      {
        redirectPage = "home"
      }
      this.router.navigate([redirectPage],{ replaceUrl: true });  
    }
  }

  doPublish() {
    let action = "/v1/didtx/create"
    let data = {
      "didRequest" : AppService.intentConfig.transfer.didrequest,
      "requestFrom": AppService.intentConfig.transfer.from,
      "memo": this.memo || ""
    }
    this.httpService.post<PostDTO>(action, data).then(response=>{
      console.log("Confirmation", response)
      this.timer = 20;
      this.requestId = response.data["confirmation_id"];
      this.startTimer();
      this.endTransaction = true;
    }).catch(error =>{
      console.log("error");
    })
  }

  startTimer(){
    setTimeout(() =>{
      this.timer --;
      if (this.timer > 0)
      {
        this.startTimer();
      } else if (this.timer == 0) {
        this.returnTransaction();
      }
    }, 1000)
  }

  returnTransaction()
  {
    this.timer = -1;
    this.appService.sendIntentResponse(AppService.intentConfig.transfer.action, { txid: this.requestId }, AppService.intentConfig.transfer.intentId);
    AppService.intentConfig = {};
    this.refresh();
  }

  doCancel(){
    this.appService.sendIntentResponse(AppService.intentConfig.transfer.action, {  }, AppService.intentConfig.transfer.intentId);
  }
 
}
