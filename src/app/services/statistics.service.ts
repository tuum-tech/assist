import { Injectable } from "@angular/core";
import { HttpHelper } from "./httphelper.service";
import { AppService } from "./app.service";
import { ServiceCountDTO } from "../models/servicecount.model";
import { PostDTO as HttpResponseDTO } from "../models/httpresponse.model";
import { StatisticsDTO } from "../models/statistics.model";

@Injectable({
    providedIn: 'root'
})
export class StatisticsService{
    static readonly ID_PUBLISH: string = "did_publish";
    static readonly MEDIA_UPLOAD: string = "media_upload";

    constructor(private httpService: HttpHelper) {
    }

    getUserStatisticsFromService(service:string, did: string = "") : Promise<ServiceCountDTO> {
        return new Promise<ServiceCountDTO>(async (resolve, reject) =>{
            
            if (did == "" && !AppService.signedIdentity){
                resolve(new ServiceCountDTO())
                return
            }

            if (did == "") did = AppService.signedIdentity.didString;
            
            var action = `/v1/service_count/${service}/${did}`
            var response = await this.httpService.get<HttpResponseDTO>(action);
            if (response.meta["code"] == 200){
                resolve(response.data as ServiceCountDTO)
            } else {
                reject(response.meta["message"])
            }           
        })
    }

    getAppStatistics() : Promise<StatisticsDTO> {
        return new Promise<StatisticsDTO>(async (resolve, reject) =>{
            var action = `/v1/service_count/statistics`
            var response = await this.httpService.get<HttpResponseDTO>(action);
            if (response.meta["code"] == 200){
                resolve(response.data as StatisticsDTO)
            } else {
                reject(response.meta["message"])
            }           
        })
    }
}
