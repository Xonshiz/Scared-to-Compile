import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { io, Socket } from 'socket.io-client';
import { Toolbar } from "../models/toolbar";

@Injectable({
    providedIn: 'root'
})

export class CollaborationService {

    private socket: Socket;
    private socketId: string = "";
    private _message: BehaviorSubject<any> = new BehaviorSubject<any>({});
    private _disconnectedSocket: BehaviorSubject<any> = new BehaviorSubject<any>({});
    private _otherComponent: BehaviorSubject<Toolbar> = new BehaviorSubject<Toolbar>({});

    public get message(): Observable<any> {
        return this._message.asObservable();
    }

    public get otherComponent(): Observable<Toolbar> {
        return this._otherComponent.asObservable();
    }

    public get disconnectedSocket(): Observable<any> {
        return this._disconnectedSocket.asObservable();
    }

    constructor() {
        this.socket = io(
            /*"http://localhost:5000",{
            withCredentials: true,
            extraHeaders: {
              "my-custom-header": "abcd"
            }
          }*/
          );
        this.socket.on("connect", () => {
            this.socketId = this.socket.id;
            //console.log("connected to server with id ", this.socketId);
        });

        this.socket.on("disconnect", () => {
            this._disconnectedSocket.next(this.socket.id);
            //console.log("disconnected");
        })
    }

    startRecievingData() {
        this.socket.on("cursormove", (data: any) => {
            this._message.next(data);
        })
        this.socket.on("otherComponent", (data: any) => {
            this._otherComponent.next(data);
        })
        this.socket.on("userLeft", (data) => {
            this._disconnectedSocket.next(data);
        })
    }

    sendMessage(msg: any) {
        msg = { ...msg, socketId: this.socketId };
        this.socket.emit("selfcursormove", msg);
    }

    sendComponent(msg: Toolbar) {
        this.socket.emit("createComponent", msg);
    }
}