import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'page-home',
  templateUrl: 'home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {

  public selectedTab: string

  constructor(public navCtrl: NavController, private appService: AppService) {
    this.selectedTab = "requests";
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

  tabChanged(ev: any) {
    this.selectedTab = ev.detail.value;
  }

  gotoRequests(requestType: string)
  {
    this.navCtrl.navigateForward(['requests']);
  }

  gotoDetails(requestId: string)
  {
    this.navCtrl.navigateForward(['details']);
  }

  openProfile(){
    this.navCtrl.navigateForward(['create']);
  }
}
