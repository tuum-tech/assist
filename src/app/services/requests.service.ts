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
    static requestId: string = "";
    constructor(private httpService: HttpHelper) {
    }

    getRequestsFromDidSession() : Promise<RequestDTO[]> {
        return new Promise<RequestDTO[]>(async (resolve, reject) =>{
            if (!AppService.signedIdentity){
                resolve([])
                return
            }
            var action = `/v1/didtx/did/${AppService.signedIdentity.didString}`
            var response = await this.httpService.get<HttpResponseDTO>(action);
            if (response.meta["code"] == 200){
                resolve(response.data as RequestDTO[])
            } else {
                reject(response.meta["message"])
            }           
        })
    }

    getRecentRequestsFromDidSession() : Promise<RequestDTO[]> {
        return new Promise<RequestDTO[]>(async (resolve, reject) =>{
            if (!AppService.signedIdentity){
                resolve([])
                return
            }

            var action = `/v1/didtx/recent/did/${AppService.signedIdentity.didString}`
            var response = await this.httpService.get<HttpResponseDTO>(action);
            if (response.meta["code"] == 200){
                resolve(response.data as RequestDTO[])
            } else {
                reject(response.meta["message"])
            }           
        })
    }

    getRequestFromId(requestId: string) : Promise<RequestDTO> {
        return new Promise<RequestDTO>((resolve, reject) =>{
            var action = `/v1/didtx/confirmation_id/${requestId}`
            this.httpService.get<HttpResponseDTO>(action).then(response =>{
                if (response.meta["code"] == 200){
                    resolve(response.data as RequestDTO)
                } else {
                   resolve(null)
                }           
            }).catch(err=>{
                resolve(null)   
            });
            
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