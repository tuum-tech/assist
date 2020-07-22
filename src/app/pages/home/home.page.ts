import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { StatisticsService } from 'src/app/services/statistics.service';
import { RequestsService } from 'src/app/services/requests.service';
import { RequestDTO } from 'src/app/models/request.model';
import { ServiceCountDTO } from 'src/app/models/servicecount.model';
import { StatisticsDTO } from 'src/app/models/statistics.model';

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
  public idPublishStatistics: ServiceCountDTO;
  public mediaUploadStatistics: ServiceCountDTO;
  public statistics : StatisticsDTO;
  

  constructor(public navCtrl: NavController, 
              private appService: AppService,
              private statisticsService: StatisticsService,
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
    this.appService.setTitleBar();
  }

  async ionViewWillEnter(){
    await this.refresh()
  } 

  tabChanged(ev: any) {
    this.selectedTab = ev.detail.value;
  }

  async refresh()
  {
    await this.getRequests()

    this.statistics = await this.statisticsService.getAppStatistics();

    Promise.all([
      this.statisticsService.getUserStatisticsFromService(StatisticsService.ID_PUBLISH),
      this.statisticsService.getUserStatisticsFromService(StatisticsService.MEDIA_UPLOAD)
      ]).then(response =>{
        this.idPublishStatistics = response[0] 
        this.mediaUploadStatistics = response[1]  
      })
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

  get name(): string{
    return AppService.signedIdentity.name;
  }

  get avatar(): string{
    if (!AppService.signedIdentity.avatar) return null;
    return `${AppService.signedIdentity.avatar.base64ImageData}`;
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
    
    await this.refresh()
    evnt.target.complete();
  }

  doLogin(){
    this.appService.tryDoLogin(true).then(async response =>{
       await this.refresh()
       this.closeProfile()
    });
  }

}
