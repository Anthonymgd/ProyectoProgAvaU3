import { Injectable, NgModule } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    MailerService
  ]
})

export class MailerService {

  constructor(private httpreq:HttpClient) {  } 

  sendMessage(body: any){
    let headers = {
      headers : new HttpHeaders({
        'Content-Type' :'application/json'
      })
    }
    return this.httpreq.post("http://100.25.196.54:8080/email",body,headers);
  }
}
