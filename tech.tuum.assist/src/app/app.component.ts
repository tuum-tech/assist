import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Router } from '@angular/router';

import { TabsPage } from './pages/tabs/tabs';

@Component({
  selector: 'my-app',
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, router: Router) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // Make sure to wait for platform to be ready before navigating to the first screen. Otherwise
      // plugins such as AppManager or TitleBarManager are not ready.
      router.navigate(["tab1Root"]);
    });
  }
}
