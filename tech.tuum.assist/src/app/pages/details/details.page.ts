import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'page-details',
  templateUrl: 'details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage {

  

  constructor(public navCtrl: NavController, private appService: AppService) {
    
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

  goBack(){
    console.log("back clicked")
    this.navCtrl.back();
  }
 
}
