import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { io, Socket } from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})

export class CollaborationService {

    private socket: Socket;
    private socketId: string = "";
    private _message: BehaviorSubject<any> = new BehaviorSubject<any>({});

    public get message(): Observable<any> {
        return this._message.asObservable();
    }

    constructor() {
        this.socket = io(
            /*"http://localhost:5000",{
            withCredentials: true,
            extraHeaders: {
              "my-custom-header": "abcd"
            }
          }*/);
        this.socket.on("connect", () => {
            this.socketId = this.socket.id;
            console.log("connected to server with id ", this.socketId);
        });

        this.socket.on("disconnect", () => {
            console.log("disconnected");
        })
    }

    startRecievingMessage() {
        this.socket.on("cursormove", (data: any) => {
            this._message.next(data);
        })
    }

    sendMessage(msg: any) {
        msg = { ...msg, socketId: this.socketId };
        this.socket.emit("selfcursormove", msg);
    }
}