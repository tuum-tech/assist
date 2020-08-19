import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { RequestsService } from 'src/app/services/requests.service';
import { RequestDTO } from 'src/app/models/request.model';
import { DocumentSearchDTO, VerifiableCredentialDTO, DocumentMap, DocumentDTO } from 'src/app/models/documentsearch.model';
import { DocumentsService } from 'src/app/services/documents.service';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'page-didsearch',
  templateUrl: 'didsearch.page.html',
  styleUrls: ['./didsearch.page.scss'],
})
export class DidSearchPage {

  public documentSearch: DocumentSearchDTO;
  public search: string = ""

  public isLoading: boolean = false;

  constructor(public navCtrl: NavController, private appService: AppService, private documentService: DocumentsService) {
    if (!AppService.signedIdentity || AppService.signedIdentity.didString == "") {
      this.navCtrl.navigateForward(['onboarding', { replaceUrl: true }]);
    }
  }

  async ionViewDidEnter() {
    // When the main screen is ready to be displayed, ask the app manager to make the app visible,
    // in case it was started hidden while loading.
    appManager.setVisible("show");

    // Update system status bar every time we re-enter this screen.
    this.appService.setTitleBar();
    this.appService.setBack(()=>{
      this.goBack()
    })
  }

  async ionViewWillEnter(){
    

    
  } 

  async getRequests() {
    
  }

  onInput(value) {
    this.search = value;
  }


  
  async searchDocuments(){
    this.isLoading = true;

    let response = await this.documentService.getDocumentsFromDid(this.search);

    if (response)
    {
        this.documentSearch = response

        if (!this.documentSearch.documents ||
            this.documents.length == 0)
            {
               this.appService.toast("No documents found", 5000) 
            }
    }
    this.isLoading = false

  }

  get did(): string{
    if (!this.documentSearch) return ""
    return this.documentSearch.did
  }


  get documents(): DocumentDTO[]{
    
    if (!this.documentSearch) return []
    let response: DocumentDTO[] = [];
    for (let key in this.documentSearch.documents) {
        let item = this.documentSearch.documents[key]
        item.id = key
        item.did = this.documentSearch.did
        response.push(item)
    }
    return response
  }
  
  openDocument(document: DocumentDTO){
    DocumentsService.selectedDocument = document;
    this.navCtrl.navigateForward(['document']);
  }
 
  goBack() {
    this.navCtrl.back();
  }

  async doRefresh(evnt){
    await this.getRequests()
    evnt.target.complete();
  }
}
