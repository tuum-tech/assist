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
  public isShowProfile: boolean = false;
  public isSearchOpen:boolean = false;
  public search:string = "";

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

    

    
  }

  async ionViewWillEnter(){
    await this.getRequests()
  } 

  tabChanged(ev: any) {
    this.selectedTab = ev.detail.value;
  }

  

  async getRequests(){
    var response = await this.requestService.getRecentRequestsFromDidSession();
    this.requests = response
  }

  gotoRequests(requestType: string)
  {
    RequestsService.requestsList = requestType;
    this.navCtrl.navigateForward(['requests']);
  }

  openRequest(requestId: string) {
    RequestsService.requestId = requestId
    this.navCtrl.navigateForward(['details']);
  }

  get did(): string{
    return AppService.signedIdentity.didString;
  }

  openProfile(){
    this.isShowProfile = true
  }

  closeProfile(){
    this.isShowProfile = false
  }

  async openSearch(){
    if (this.isSearchOpen){
      if (this.search){
        var response = await this.requestService.getRequestFromId(this.search);
        if (response){
           this.openRequest(this.search)
        } else {
          this.appService.toast(`${this.search} not found`)
        }
        
      }
    } else {
      this.search = "";
    }
    this.isSearchOpen = !this.isSearchOpen

  }

  copy(value){
    this.appService.copyClipboard(value);
    this.appService.toast("Copied to clipboard")
  }

  async openMediaUpload(){
    await this.appService.presentInfo("This feature is not available")
  }

  async doRefresh(evnt){
    await this.getRequests()
    evnt.target.complete();
  }

}
