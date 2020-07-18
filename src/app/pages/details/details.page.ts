import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { RequestsService } from 'src/app/services/requests.service';
import { RequestDTO } from 'src/app/models/request.model';
import * as moment from 'moment'


declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'page-details',
  templateUrl: 'details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage {

  request: RequestDTO = new RequestDTO()
  profileValues = []

  constructor(public navCtrl: NavController, private appService: AppService, private requestService: RequestsService) {
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
    // this.appService.setBack(()=>{
    //   this.goBack()
    // })
    

    
  }

  async ionViewWillEnter(){
    await this.getRequest()
  } 

  async getRequest(){
    
    this.request = await this.requestService.getRequestFromId(RequestsService.requestId);
    let credentials = JSON.parse(atob(this.request.didRequest["payload"]));
    var values = [];
      if (credentials.verifiableCredential)
      {
        credentials.verifiableCredential.forEach(function (value) {
          let credId = value.id.replace("#", "");
          values.push({
            "header": credId,
            "value": value.credentialSubject[credId]
          })
        }); 
      }
      this.profileValues = values;

  }

  public get timeMoment() : string {
    if (!this.request) return "";
    return moment.utc(this.request.created).format('MMMM DD YYYY');

 }

 public getMoment(value: number) : string {
   if (!value) return "No information"
  return moment.unix(value).fromNow();
 }

 public get statusClass(): string{
  if (this.request){
    if (this.request.status == "Completed") return "recent-item-status-success"
    if (this.request.status == "Error") return "recent-item-status-error"
  } 
  return "recent-item-status-pending";

 }

 public get blockchainTx(){
  
  if (!this.request || !this.request.blockchainTx || !this.request.blockchainTx["result"]) return {
    txid: "Process not started",
    time: null,
    blockhash: "No information",
    confirmations: "No information"
  };

  

  return this.request.blockchainTx["result"]
 }

 public get HasBlockhainTx(){
   return (this.request && this.request.blockchainTx && this.request.blockchainTx["result"])
 }

 public get statusIcon(): string{
  if (this.request){
    if (this.request.status == "Completed") return "../../../assets/images/Icon feather-check-circle-1.png"
    if (this.request.status == "Error") return "../../../assets/images/Icon material-error-outline.png"
  } 
  return "../../../assets/images/Icon weather-time-3.png"
 }


  goBack(){
    this.navCtrl.back();
  }

  copy(value){
    this.appService.copyClipboard(value);
    this.appService.toast("Copied to clipboard")
  }

  isOwnRequest() : boolean{
    if (!AppService.signedIdentity || !this.request) return false
    var did = AppService.signedIdentity.didString.replace('did:elastos:', '');
    return did === this.request.did
  }
 

  isObjImage(obj)
  {
    return this.appService.isObjImage(obj);
  }

  getBase64Image(obj)
  {
    return this.appService.getBase64Image(obj);
  }
}
