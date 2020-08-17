import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { RequestsService } from 'src/app/services/requests.service';
import { RequestDTO } from 'src/app/models/request.model';
import * as moment from 'moment'
import { DocumentDTO, VerifiableCredentialDTO } from 'src/app/models/documentsearch.model';
import { DocumentsService } from 'src/app/services/documents.service';


declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'page-document',
  templateUrl: 'document.page.html',
  styleUrls: ['./document.page.scss'],
})
export class DocumentPage {

  document: DocumentDTO = new DocumentDTO()
  credentials: any[] = []

  constructor(public navCtrl: NavController, private appService: AppService, private documentService: DocumentsService) {
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
    if (!DocumentsService.selectedDocument){
      this.navCtrl.navigateForward(['home', { replaceUrl: true }]);
    } else {
      this.document = DocumentsService.selectedDocument;
      var values = [];
      if (this.document.verifiable_creds)
      {
        this.document.verifiable_creds.forEach(function (value) {
          let credId = value.id.replace("#", "");
          let item = value.subject[credId]
          
          if (typeof item !== 'object' && item !== null)
              item = decodeURIComponent(escape(item))
              
          values.push({
            "header": credId,
            "value": item
          })
        }); 
      }
      this.credentials = values;
    }
  } 


  public get timeMoment() : string {
    if (!this.document) return "";
    return moment.utc(this.document.published).format('MMMM DD YYYY');

 }

 public getMoment(value: number) : string {
   if (!value) return "No information"
  return moment.unix(value).fromNow();
 }

 public formatedMoment(value: string) : string {
  return moment(value).format('DD MMM YYYY');

}

 getCaptalizedHeader(item: VerifiableCredentialDTO){
  let header = item.id.replace("#", "");
  return header.charAt(0).toUpperCase() + header.slice(1) + ":";
}

 


  goBack(){
    this.navCtrl.back();
  }

  copy(value){
    this.appService.copyClipboard(value);
    this.appService.toast("Copied to clipboard")
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
