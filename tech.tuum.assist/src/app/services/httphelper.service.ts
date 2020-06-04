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
            var myHeaders = new Headers();
            myHeaders.append("Authorization", environment.apiSecretKey);
            myHeaders.append("Content-Type", "application/json");

            var requestOptions = {
                mode: ('no-cors' as RequestMode),
                method: 'POST',
                headers: myHeaders,
                body: data
              };

            fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                resolve(result as T)
            })
            .catch(error => {

                console.log('error', error)
                reject(error)
            });


            // let headers = new HttpHeaders({
            //     'Content-Type': 'application/json',
            //     'Accept': '*/*',
            //     'Authorization': environment.apiSecretKey
            // })
            
            // this.http.post(url, data, { headers: headers}).toPromise().then(response =>{
            //     console.log("sendpost", response)
            //     resolve(response as T)
            // }).catch(err=>{
            //     console.log("send err", err)
            //     reject(err)
            // });
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
                reject(err);
            })
        })
    }

   

}