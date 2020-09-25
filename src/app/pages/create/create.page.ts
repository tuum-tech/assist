import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { Native } from 'src/app/services/Native';
import { Router } from '@angular/router';
import { HttpHelper } from 'src/app/services/httphelper.service';
import { PostDTO } from 'src/app/models/httpresponse.model';
import { StatisticsService } from 'src/app/services/statistics.service';
import { ServiceCountDTO } from 'src/app/models/servicecount.model';
import * as moment from 'moment'
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { isNullOrUndefined, isUndefined } from 'util';
import { LocalStorageService } from 'src/app/services/localstorage.service';


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
  serviceCount: ServiceCountDTO;

  constructor(public navCtrl: NavController, 
              private appService: AppService, 
              private localStorage: LocalStorageService,
              private statService: StatisticsService,
              private native: Native, 
              public router: Router,
              private httpService: HttpHelper) {
    
  }

  ionViewDidEnter() {
    // When the main screen is ready to be displayed, ask the app manager to make the app visible,
    // in case it was started hidden while loading.
    appManager.setVisible("show");



    // Update system status bar every time we re-enter this screen.
    this.appService.setTitleBar();
  }

  ionViewWillEnter() {
    console.log(AppService.intentConfig);
      
    setTimeout(()=> this.refresh(), 500)
    
  }

  refreshCounter(): Promise<void>{
   return new Promise<void>((resolve, reject) =>{
    this.statService.getUserStatisticsFromService(StatisticsService.ID_PUBLISH, this.did).then(response=>{
      this.serviceCount = response;
      resolve()
    }).catch(error =>{
      resolve()
    })
   })
  }

  async refresh() {
    console.log("config", AppService.intentConfig);
    if (AppService.intentConfig && AppService.intentConfig.transfer) {
      let credentials = JSON.parse(atob(AppService.intentConfig.transfer.didrequest.payload));

      AppService.signedIdentity = await this.localStorage.getProfile();

      if (isNullOrUndefined(AppService.signedIdentity) || 
      isNullOrUndefined(AppService.signedIdentity.didString) ||
          AppService.signedIdentity.didString == "" )
      {
        this.navCtrl.navigateForward(['onboarding', { replaceUrl: true }]);
        return;
      }

      this.did = AppService.signedIdentity.didString;
      

      
      var values = [];
      if (credentials.verifiableCredential)
      {
        credentials.verifiableCredential.forEach(function (value) {
          let credId = value.id.replace("#", "");
          let item = value.credentialSubject[credId]
          
          if (typeof item !== 'object' && item !== null)
              item = decodeURIComponent(escape(item))


          values.push({
            "header": credId,
            "value": item
          })
        }); 
      }
      this.profileValues = values;
      this.endTransaction = false;
      this.hasTransaction = true;
      
      await this.refreshCounter();

      if (!this.serviceCount ||
         (this.serviceCount && this.serviceCount.count >= 5))
      {
        this.startResetTimer()
      }

    }
    else {
      this.hasTransaction = false;
      this.endTransaction = false;
      this.did = ""
      this.resetTimer = ""
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

  isObjImage(obj)
  {
    return this.appService.isObjImage(obj);
  }

  getBase64Image(obj)
  {
    return this.appService.getBase64Image(obj);
  }
 

  doPublish() {
    if (!this.serviceCount || this.serviceCount.count >=5) return;

    let action = "/v1/didtx/create"
    let data = {
      "didRequest" : AppService.intentConfig.transfer.didrequest,
      "requestFrom": AppService.intentConfig.transfer.from,
      "memo": this.memo || ""
    }
    this.httpService.post<PostDTO>(action, data).then(async response=>{

      if (response.data["confirmation_id"] == "")
      {
          this.appService.presentAlert(
            "You have reached your daily limit for DID publish service. Please try again tomorrow",
            "",
             () =>{
               this.doCancel();
             });
      } else {



        this.timer = 20;
        this.requestId = response.data["confirmation_id"];
        this.endTransaction = true;
        if (response.data["duplicate"] == true)
        {
          this.appService.presentAlert("Your last request is still processing. Please try again later",
          "",
          () =>{
            this.startTimer();
          })
        } else {
          this.appService.addNewRequestToBackground(this.requestId)
          this.startTimer();
        }
        
      }

      
      
    }).catch(error =>{
      console.log("error");
    })
  }

  startTimer(){
    setTimeout( () =>{
      this.timer --;
      if (this.timer > 0)
      {
        this.startTimer();
      } else if (this.timer == 0) {
        this.returnTransaction();
      }
    }, 1000)
  }

  public resetTimer: string = ""

  startResetTimer(){
    setTimeout(async () =>{
      if (!AppService.intentConfig) return
      let tomorrow = moment(`${moment().utc().add(1, 'days').format("YYYY-MM-DD")}T00:00Z`) 
      let diffHours = tomorrow.utc().diff(moment().utc(), "minutes")
      let diffMinutes = tomorrow.utc().diff(moment().utc(), "seconds")
      let hours = Math.floor(diffHours / 60);
      let minutes = diffHours % 60
      let seconds = diffMinutes % 60;
      this.resetTimer =  `${this.formatZero(hours)}:${this.formatZero(minutes)}:${this.formatZero(seconds)}`
      try {
        await this.refreshCounter()
        if (this.serviceCount.count >= 5)
        {
          this.startResetTimer();
        }  
      } catch (error) {
        this.startResetTimer();  
      }
    }, 1000)
  }

 

  formatZero(value, size = 2) {
    var s = String(value);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
}

  returnTransaction()
  {
    this.timer = -1;
    
    appManager.sendIntentResponse(
      AppService.intentConfig.transfer.action,
      { txid: this.requestId },
      AppService.intentConfig.transfer.intentId,
      success =>{
        AppService.intentConfig = null
        appManager.close()
      },
      error =>{
        console.error(error)
      }
    )
    this.refresh();
  }

  doCancel(){
    appManager.sendIntentResponse(
      AppService.intentConfig.transfer.action,
      {},
      AppService.intentConfig.transfer.intentId,
      success =>{
        AppService.intentConfig = null
        appManager.close()
      },
      error =>{
        console.error(error)
      }
    )
    this.refresh();
  }

  getButtonPublishClass()
  {
    if (this.serviceCount && this.serviceCount.count < 5)
    {
      return "button-publish"
    }
    return "button-publish-disabled"
  }

  copy(value){
    this.appService.copyClipboard(value);
    this.appService.toast("Copied to clipboard")
  }
 
}
