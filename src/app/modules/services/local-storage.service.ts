import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

    constructor() { }

    setLocalStore = (key: any, data: any) => {
        return localStorage.setItem(key, data);
    }

    getLocalStore = (key: any) => {
        return localStorage.getItem(key);
    }

    clearStorageFor = (key: any) => {
        return localStorage.removeItem(key);
    }

    clearStorage = () => {
        return localStorage.clear();
    }
}
