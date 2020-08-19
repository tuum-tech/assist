import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { RequestsService } from 'src/app/services/requests.service';
import { RequestDTO } from 'src/app/models/request.model';
import * as moment from 'moment'
import { DocumentDTO, VerifiableCredentialDTO } from 'src/app/models/documentsearch.model';
import { DocumentsService } from 'src/app/services/documents.service';
import { Subject } from 'rxjs';
import { isNgTemplate } from '@angular/compiler';
import { isUndefined, isNullOrUndefined } from 'util';


declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;


export interface SubjectValue {
    header: string;
    value: string;
    isImage: boolean;
}

export interface Issuers{
  [did: string] : IssuerValue
}

export interface IssuerValue {
  did: string;
  name: string;
  image: string;
}

@Component({
  selector: 'page-document',
  templateUrl: 'document.page.html',
  styleUrls: ['./document.page.scss'],
})
export class DocumentPage {

  document: DocumentDTO = new DocumentDTO();
  credentials: any[] = [];
  issuers: Issuers = {};

  constructor(public navCtrl: NavController, 
              private appService: AppService, 
              private documentService: DocumentsService) {
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

          let issuer = null
              
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

  getSubjects(item: VerifiableCredentialDTO)
  {
      let header = this.getCaptalizedHeader(item)
      
      return this.getSubjectElements(header, item.subject)
  }

  getSubjectElements(header: string, subject: any) : SubjectValue[]
  {
    let response: SubjectValue[] = []
    if (this.isObjImage(subject))
    {
      response.push({
        isImage: true,
        header: header,
        value: this.getBase64Image(subject),
      })
      
    }
    else 
    {

      if (subject === Object(subject))
      {
        var keyNames = Object.keys(subject);
        keyNames.forEach(key => {
          let keyHeader = key.charAt(0).toUpperCase() + key.slice(1) + ":"
          let item = subject[key]
          if (item === Object(item))
          {
            let elements = this.getSubjectElements(keyHeader, item)
            response = response.concat(elements)
          }
          else
          {
            response.push({
              isImage: false,
              header: keyHeader,
              value: item,
            })
          } 
        });
      }
      else
      {
        response.push({
          isImage: false,
          header: header,
          value: subject,
        })
      } 

      
     
    }
    return response
  }


  goBack(){
    this.navCtrl.back();
  }

  copy(value){
    this.appService.copyClipboard(value);
    this.appService.toast("Copied to clipboard")
  }

  

  getIssuer(issuerDid)
  {
    let did = issuerDid.replace("did:elastos:", "")
    if (!isNullOrUndefined(this.issuers[did])) return this.issuers[did];

    this.issuers[did] = {
      did: did,
      name: "",
      image: "",
    }

    console.log("Searching document")
      this.documentService.getDocumentsFromDid(issuerDid)
      .then(response=>{
        let documentsKey = Object.keys(response.documents)
        if (documentsKey.length > 0)
        {
          
          let document: DocumentDTO  = response.documents[documentsKey[0]]

          document.verifiable_creds.forEach(credential => {
              if (credential.id === "#name")
              {
                this.issuers[did].name = credential.subject["name"]
              }
  
              if (credential.id === "#avatar")
              {
                this.issuers[did].image = this.getBase64Image(credential.subject["avatar"])
              }
          });
        }
      }).catch(err =>{
        console.error("Error getting issuer ", issuerDid)
      })
    return this.issuers[did]
  }

  
  
  hasAvatarIssuer(issuerDid: string): boolean{
    let issuer = this.getIssuer(issuerDid)
    return issuer !== undefined && issuer.image !== ""
  }

  getIssuerAvatar(issuerDid: string): string{
    let issuer = this.getIssuer(issuerDid)
    return issuer.image
  }

   getIssuerName(issuerDid: string): string{
    let issuer = this.getIssuer(issuerDid)
    if (isUndefined(issuer)) return issuerDid
    return issuer.name
  }

  getIssuerDid(issuerDid: string): string{
    let issuer = this.getIssuer(issuerDid)
    if (isUndefined(issuer)) return issuerDid
    return issuer.did
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
