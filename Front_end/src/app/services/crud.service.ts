import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Toolbar } from "../models/toolbar";

@Injectable({
    providedIn: 'root'
})

export class CrudService {
    constructor(private http: HttpClient) {

    }

    saveAllStickyNotes(stickyNotes: Toolbar[]):Observable<any> {
        let url = '/api/components';
        return this.http.post(url, stickyNotes);
    }

    getAllStickyNotes() {
        let url = '/api/components';
        return this.http.get(url);
    }
}