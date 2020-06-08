import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { RequestsService } from 'src/app/services/requests.service';
import { RequestDTO } from 'src/app/models/request.model';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  public selectedTab: string
  public requests: RequestDTO[] = []

  constructor(public navCtrl: NavController, 
              private appService: AppService,
              private requestService: RequestsService) {
    this.selectedTab = "requests";
    if (!AppService.signedIdentity || AppService.signedIdentity.didString == ""){
      this.navCtrl.navigateForward(['onboarding', { replaceUrl: true }]);
    }
  }

  async ionViewDidEnter() {
    // When the main screen is ready to be displayed, ask the app manager to make the app visible,
    // in case it was started hidden while loading.
    appManager.setVisible("show");

    // Update system status bar every time we re-enter this screen.
    titleBarManager.setTitle("Assist");
    titleBarManager.setBackgroundColor("#005BFF");
    titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);

    await this.getRequests()

    
  }

  tabChanged(ev: any) {
    console.log(ev.detail.value)
    this.selectedTab = ev.detail.value;
  }

 

  async getRequests(){
    var response = await this.requestService.getRequestsFromDidSession();
    this.requests = response
    console.log("Requests", this.requests)
  }

  gotoRequests(requestType: string)
  {
    RequestsService.requestsList = requestType;
    this.navCtrl.navigateForward(['requests']);
  }

  openRequest(requestId: string) {
    console.log("openrequest", requestId)
    RequestsService.requestId = requestId
    this.navCtrl.navigateForward(['details']);
  }

  openProfile(){
    this.navCtrl.navigateForward(['create']);
  }
}
