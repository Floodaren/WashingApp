import { Component } from '@angular/core';
import {LoadingController,NavController, ModalController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import axios from 'axios';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  eventSource = [];
  eventLoad = [];
  viewTitle: string;
  selectedDay = new Date();
 
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  
  constructor(public navCtrl: NavController, private modalCtrl: ModalController, private alertCtrl: AlertController, public loading: LoadingController) 
  {
  }
  
  
  addEvent() {
    
    let modal = this.modalCtrl.create('EventModalPage', {selectedDay: this.selectedDay});
    modal.present();
    modal.onDidDismiss(data => {
      if (data) {
        let eventData = data;
 
        eventData.startTime = new Date(data.startTime);
        eventData.endTime = new Date(data.endTime);
 
        let events = this.eventSource;
        events.push(eventData);
        this.eventSource = [];
        setTimeout(() => {
          this.eventSource = events;
        });
      }
    });
  }

  FillWashTimes() 
  {
    let events = this.eventSource;
    for (var i = 0 ; i < this.eventLoad.length ; i++)
    {     
      let eventData2 = { startTime: this.eventLoad[i].Starttime, endTime: this.eventLoad[i].Endtime, allDay: false , title: "Tvättid"};   
      eventData2.startTime = new Date(this.eventLoad[i].Starttime);
      eventData2.endTime = new Date(this.eventLoad[i].Endtime);
      events.push(eventData2);
    }
    this.eventSource = [];
    setTimeout(() => {
      this.eventSource = events;
    });
  }
 
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
 
  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');
    
    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'From: ' + start + '<br>To: ' + end,
      buttons: ['OK']
    })
    alert.present();
  }
 
  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }


  async getWashTimes() {
    this.eventSource = [];
    await axios.get('http://localhost:3030/GetWashTimes', {
    })
    .then(result => {
      if (result.data.userId === 0)
      {
        console.log("Inga poster")
      }
      else 
      {
        this.eventLoad = result.data.washTimes;
        return this.FillWashTimes();
      }
    })
    .catch(function (error) {
      console.log(error);
      alert("Kunde inte kontakta servern");
    });
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    
    setTimeout(() => {
      console.log('Async operation has ended');
      this.getWashTimes();
      refresher.complete();      
    }, 2000);
  }

  ionViewWillEnter()
  {
    this.getWashTimes();
  }

  async ionViewCanEnter() {
    await this.getWashTimes();
  }
}
