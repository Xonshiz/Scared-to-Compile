import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-notif-bar',
  templateUrl: './notif-bar.component.html',
  styleUrls: ['./notif-bar.component.scss']
})
export class NotifBarComponent implements OnInit {

  mailString:string = "";
  @ViewChild('emailSent') emailSender: ElementRef<HTMLElement>;

  constructor() { }

  ngOnInit(): void {
  }
  sendEmail(){
    let username = this.mailString.split("@")[0];
    let url = window.location.href;
    url = url.split("/user")[0]+"/user/"+username;
    this.triggerFalseClick(`mailto:${this.mailString}?subject=Lets Collaborate&body=${url}`);
    this.mailString = "";
  }

  triggerFalseClick(emailContent:string) {
    let el: HTMLElement = this.emailSender.nativeElement;
    el.setAttribute("href", emailContent);
    el.click();
  }
}
