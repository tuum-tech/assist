import { Component, OnInit, Input } from '@angular/core';
import { RequestDTO } from '../../models/request.model';
import * as moment from 'moment'
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'request-item',
  templateUrl: './requestItem.component.html',
  styleUrls: ['./requestItem.component.scss'],
})
export class RequestItemComponent implements OnInit {
 
  @Input() request: RequestDTO;
  @Input() highlight: string;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
   
  }

  public get timeMoment() : string {
    if (!this.request) return "";
    return moment.utc(this.request.created).fromNow()

 }

 public get recentIdHighlighted(){
  
   if (!this.request) return "";
   if (!this.highlight) return this.request.id;

  
  
   var replace = new RegExp(this.highlight, 'g');
   var subsTo = `<span style='font-family: PoppinsBold; font-size: 18px; color: red;'>${this.highlight}</span>`

   return this.sanitizer.bypassSecurityTrustHtml(this.request.id.replace(replace, subsTo));

 }

 public get statusClass(): string{
  if (this.request){
    if (this.request.status == "Completed") return "recent-item-status-success"
    if (this.request.status == "Error") return "recent-item-status-error"
  } 
  return "recent-item-status-pending";

 }

 public get statusIcon(): string{
   return "../../../assets/images/Icon weather-time-3.png"
 }

 
}