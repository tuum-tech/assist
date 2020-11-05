import { Injectable } from "@angular/core";
import { HttpHelper } from "./httphelper.service";
import { RequestDTO } from "../models/request.model";
import { PostDTO as HttpResponseDTO } from "../models/httpresponse.model";
import { AppService } from "./app.service";
import { DocumentSearchDTO, DocumentDTO } from "../models/documentsearch.model";

@Injectable({
    providedIn: 'root'
})
export class DocumentsService{
    static selectedDocument: DocumentDTO;
    constructor(private httpService: HttpHelper) {
    }

    getDocumentsFromDid(did) : Promise<DocumentSearchDTO> {
        return new Promise<DocumentSearchDTO>(async (resolve, reject) =>{
            
            var action = `/v1/documents/did/${did}`
            var response = await this.httpService.get<HttpResponseDTO>(action);
            if (response.meta["code"] == 200){
                resolve(response.data as DocumentSearchDTO)
            } else {
                reject(response.meta["message"])
            }           
        })
    }

    getDocumentsFromCryptoName(crypto_name) : Promise<DocumentSearchDTO> {
        return new Promise<DocumentSearchDTO>(async (resolve, reject) =>{
            
            var action = `/v1/documents/crypto_name/${crypto_name}`
            var response = await this.httpService.get<HttpResponseDTO>(action);
            if (response.meta["code"] == 200){
                resolve(response.data as DocumentSearchDTO)
            } else {
                reject(response.meta["message"])
            }           
        })
    }

  
}