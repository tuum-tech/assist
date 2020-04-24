import { Component } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  constructor(private appService: AppService) {
  }

  ionViewWillEnter() {
    this.appService.setIntentListener();
    
  }
}
