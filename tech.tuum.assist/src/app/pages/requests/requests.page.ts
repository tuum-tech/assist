import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { RequestsService } from 'src/app/services/requests.service';
import { RequestDTO } from 'src/app/models/request.model';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'page-requests',
  templateUrl: 'requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage {

  public title: string = ""
  public requests: RequestDTO[] = []
  public search: string = ""

  constructor(public navCtrl: NavController, private appService: AppService, private requestService: RequestsService) {
    if (!AppService.signedIdentity || AppService.signedIdentity.didString == "") {
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

    if (RequestsService.requestsList == "identification") this.title = "ID Publish"
    if (RequestsService.requestsList == "media") this.title = "Media Uploads"

    await this.getRequests()
  }

  async getRequests() {
    var response = await this.requestService.getRequestsFromDidSessionAndType(RequestsService.requestsList);
    this.requests = response
    console.log("Requests", this.requests)
  }

  filterList(value) {
    this.search = value;
  }


  get filterRequests(): RequestDTO[] {

    if (this.search == "") return this.requests;

    let items = []
    let filtered = this.requests.forEach((request, index) => {
      console.log("filtered", this.search, request.id)
      let indexFound = request.id.toUpperCase().lastIndexOf(this.search.toUpperCase())
      console.log("index get", indexFound)
      if (indexFound >= 0) {
        console.log("found")
        items.push(request);
      }
    })

    return items
  }

  openRequest(requestId: string) {
    RequestsService.requestId = requestId
    this.navCtrl.navigateForward(['details']);
  }
  goBack() {
    console.log("back clicked")
    this.navCtrl.back();
  }
}
