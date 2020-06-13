import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class HttpHelper{

    constructor(private http: HttpClient){
                    
                }

   
    
    private sendPost<T>(url, data) : Promise<T> {
        return new Promise((resolve, reject) =>{
            console.log("url", url)
            console.log("apiKey", environment.apiSecretKey)

            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': environment.apiSecretKey
            })
            console.log(headers)
            this.http.post(url, data, { headers: headers}).toPromise().then(response =>{
                console.log("sendpost", response)
                resolve(response as T)
            }).catch(err=>{
                reject()
            });
        })
    }

    private sendGet<T>(url) : Promise<T> {
        return new Promise((resolve, reject) =>{
            let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': environment.apiSecretKey
            })
            this.http.get(url, { headers: headers}).toPromise().then(response =>{
                resolve(response as T)
            }).catch(err=>{
                console.log("send err", err)
                reject(err)
            });
        })
    }

    public get<T>(action:string) : Promise<T>{
        let url = `${environment.apiUrl}${action}`;
        return new Promise(async (resolve, reject) =>{
            this.sendGet<T>(url).then(r=>{
                resolve(r);
            }).catch(err=>{
                reject(err);
            })
        })
    }

    public post<T>(action:string, data: any) : Promise<T>{
        let url = `${environment.apiUrl}${action}`;
        return new Promise(async (resolve, reject) =>{
            this.sendPost<T>(url, data).then(r=>{
                resolve(r);
            }).catch(err=>{
                reject();
            })
        })
    }

   

}