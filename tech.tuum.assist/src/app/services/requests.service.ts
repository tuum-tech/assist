import { Injectable } from "@angular/core";
import { HttpHelper } from "./httphelper.service";
import { RequestDTO } from "../models/request.model";
import { PostDTO as HttpResponseDTO } from "../models/httpresponse.model";
import { AppService } from "./app.service";

@Injectable({
    providedIn: 'root'
})
export class RequestsService{
    
    static requestsList: string = "";
    static requestId: string = "5ed969153087f024fecd83c2";
    constructor(private httpService: HttpHelper) {
    }

    getRequestsFromDidSession() : Promise<RequestDTO[]> {
        return new Promise<RequestDTO[]>(async (resolve, reject) =>{
            var action = `/v1/didtx/did/${AppService.signedIdentity.didString}`
            var response = await this.httpService.get<HttpResponseDTO>(action);
            if (response.meta["code"] == 200){
                resolve(response.data as RequestDTO[])
            } else {
                reject(response.meta["message"])
            }           
        })
    }

    getRequestFromId(requestId: string) : Promise<RequestDTO> {
        return new Promise<RequestDTO>(async (resolve, reject) =>{
            var action = `/v1/didtx/confirmation_id/${requestId}`
            var response = await this.httpService.get<HttpResponseDTO>(action);
            if (response.meta["code"] == 200){
                resolve(response.data as RequestDTO)
            } else {
                reject(response.meta["message"])
            }           
        })
    }

    getRequestsFromDidSessionAndType(type: string) : Promise<RequestDTO[]> {
        return new Promise<RequestDTO[]>(async (resolve, reject) =>{

            if (type != "identification") return[]

            var action = `/v1/didtx/did/${AppService.signedIdentity.didString}`
            var response = await this.httpService.get<HttpResponseDTO>(action);
            if (response.meta["code"] == 200){
                resolve(response.data as RequestDTO[])
            } else {
                reject(response.meta["message"])
            }           
        })
    }
}