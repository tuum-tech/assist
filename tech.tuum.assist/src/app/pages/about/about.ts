import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { Native } from 'src/app/services/Native';

declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  payload: string;
  did: string;
  hasTransaction: boolean = false;

  constructor(public navCtrl: NavController, private appService: AppService, private native: Native) {
  }

  ionViewDidEnter() {
    // Update system status bar every time we re-enter this screen.
    titleBarManager.setTitle("Transaction");
    titleBarManager.setBackgroundColor("#000000");
    titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);
  }

  ionViewWillEnter() {
    console.log(AppService.intentConfig);
      
    setTimeout(()=> this.refresh(), 500)
    
  }

  refresh() {
    console.log(AppService.intentConfig);
    if (AppService.intentConfig && AppService.intentConfig.transfer) {
      this.payload = AppService.intentConfig.transfer.didrequest.payload;
      this.did = AppService.intentConfig.transfer.from;
      this.hasTransaction = true;
    }
    else {
      this.hasTransaction = false;
      this.did = "No transactions to send"
      this.payload = "";
      this.native.go("/home")
    }
  }

  returnTransaction() {
    let url = "http://192.168.1.253:8000/v1/didtx/create"
    let data = {
      "didId": this.did,
      "didRequest" : AppService.intentConfig.transfer.didrequest
    }
    console.log(JSON.stringify(data))
    this.appService.sendPost(url, data).then(response=>{
      console.log("Confirmation ID", response.data["confirmation_id"])
      this.appService.sendIntentResponse(AppService.intentConfig.transfer.action, { txid: response.data["confirmation_id"] }, AppService.intentConfig.transfer.intentId);
      AppService.intentConfig = {};
      this.refresh()
    })

    
  }
}
