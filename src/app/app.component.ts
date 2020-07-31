import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Router } from '@angular/router';
import { AppService } from './services/app.service';
import { BackgroundService } from './services/background.service';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;
@Component({
  selector: 'my-app',
  templateUrl: 'app.html',
  styleUrls: ['app.scss']
})
export class MyApp {

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen, 
              router: Router,
              private appService: AppService,
              private backgroundService: BackgroundService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      appManager.getStartupMode((startupInfo: AppManagerPlugin.StartupInfo) => {

        console.log(startupInfo.startupMode)

        if (startupInfo.startupMode === 'service'){
          console.log("Service start");
          this.backgroundService.initialize()
        } else {
          console.log("Application start");
          statusBar.styleDefault();
          splashScreen.hide();
      
          this.appService.setIntentListener();
          document.addEventListener("deviceready", ()=>{
            appManager.setVisible("show");
          }, false);
        }
            
      });

      
      
      
    });
  }
}
