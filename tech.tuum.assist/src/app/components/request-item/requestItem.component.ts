import { Component, OnInit, Input } from '@angular/core';
import { RequestDTO } from '../../models/request.model';
import * as moment from 'moment'
@Component({
  selector: 'request-item',
  templateUrl: './requestItem.component.html',
  styleUrls: ['./requestItem.component.scss'],
})
export class RequestItemComponent implements OnInit {
 
  @Input() request: RequestDTO;

  constructor() {}

  ngOnInit() {
   
  }

  public get timeMoment() : string {
    if (!this.request) return "";
    
    if (this.request.modified){
       return moment(this.request.modified).fromNow()
    }
    return moment(this.request.created).fromNow()

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