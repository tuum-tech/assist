import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service'

declare let appManager: any;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnBoardingPage {
  
  page: number = 1;

  constructor(public navCtrl: NavController,
              public router: Router,
              private appService: AppService) {
    
  }

  async doLogin(){
    var loginResponse = await this.appService.tryDoLogin();

    if (loginResponse) this.router.navigate(['home'],{ replaceUrl: true });
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

  



  

 
}