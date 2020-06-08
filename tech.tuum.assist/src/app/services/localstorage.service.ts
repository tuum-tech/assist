import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';



@Injectable({
    providedIn: 'root'
})



export class LocalStorageService {

    private readonly LOGIN_KEY = "login-credentials";


    constructor(private storage: Storage) {
    }

    public async getKeys(){
       var keys= await this.storage.keys;
       console.log("keys are: "+ keys)
    }

    public add(key: string, value: any): any {
        return this.get<any>(key).then((val) => {
            let id = value['id'];
            if (val === null) {
                let initObj = {};
                initObj[id] = value;
                return this.storage.set(key, JSON.stringify(initObj));
            }
            let addObj = JSON.parse(val);
            addObj[id] = value;
            return this.storage.set(key, JSON.stringify(addObj));
        });
    }

    public set(key: string, value: any): any {
        
        return this.storage.set(key, JSON.stringify(value));
    }

    public get<T>(key: string): Promise<T> {
        return new Promise(async (resolve, reject)=>{
            try {
                let value = await this.storage.get(key);    
                
                resolve(JSON.parse(value) as T)
            } catch (error) {
                reject(error)
            }
        })
    }

    public getAny(key: string): Promise<any> {
        return new Promise(async (resolve, reject)=>{
            try {
                let value = await this.storage.get(key); 
                   
                resolve(JSON.parse(value))
            } catch (error) {
                reject(error)
            }
        })
    }

    public getVal(key, func) {
        this.storage.get(key).then((val) => {
            if (typeof(val) == "string") {
                val = JSON.parse(val);
            }
            func(val);
        });
    }

    public remove(key: string): any {
        return this.storage.remove(key);
    }

    public clear(): any {
        return this.storage.clear();
    }


    public setProfile(login: DIDSessionManagerPlugin.IdentityEntry): Promise<any> {
        return this.set(this.LOGIN_KEY, login);
    }

    public getProfile(): Promise<DIDSessionManagerPlugin.IdentityEntry> {
        return this.get(this.LOGIN_KEY);
    }

    
}


