import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  

  constructor(public navCtrl: NavController, private appService: AppService) {
  }

  ionViewDidEnter() {
    // When the main screen is ready to be displayed, ask the app manager to make the app visible,
    // in case it was started hidden while loading.
    appManager.setVisible("show");



    // Update system status bar every time we re-enter this screen.
    titleBarManager.setTitle("Home");
    titleBarManager.setBackgroundColor("#000000");
    titleBarManager.setForegroundMode(TitleBarPlugin.TitleBarForegroundMode.LIGHT);
  }

  
}
