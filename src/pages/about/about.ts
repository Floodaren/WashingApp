import { Component } from '@angular/core';
import {LoadingController,NavController, ModalController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import axios from 'axios';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  eventSource = [];
  eventLoad = [];
  viewTitle: string;
  selectedDay = new Date();
  userId:any;
  monthtext:any;
  washTimeDidExist: boolean = false;

  monthOrDay: boolean = false;
  
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  
  constructor(public navCtrl: NavController, private modalCtrl: ModalController, private alertCtrl: AlertController, public loading: LoadingController, public storage: Storage) 
  {
    this.storage.get('LoggedInId').then((val) => {
      this.userId = val;
      });
  }


  
//#region Create event/washtime
  addEvent() {
    
    let modal = this.modalCtrl.create('EventModalPage', {selectedDay: this.selectedDay});
    modal.present();
    modal.onDidDismiss(async data => {
      if (data) {
        let eventData = data;
 
        eventData.startTime = new Date(data.startTime);
        var lockedTime = moment(eventData.startTime).add(3, 'h').toDate();
        eventData.endTime = lockedTime;
        await this.createWashTime(this.userId,eventData.startTime,eventData.endTime,eventData.description);
        
        if (this.washTimeDidExist === false)
        {
          let events = this.eventSource;
          events.push(eventData);
          this.eventSource = [];
          setTimeout(() => {
            this.eventSource = events;
          });
        }      
      }
    }); 
  }

  async createWashTime(userId, inputstartTime, inputendTime, description)
  {

    await axios.post('http://localhost:3030/CreateWashTime', {
      userId: userId,
      startTime: inputstartTime,
      endTime: inputendTime,
      description: description
    })
    .then(result => {
      if (result.data.result === false)
      {
        this.showAlert();
        this.washTimeDidExist = true;
      }
      else 
      {
        this.washTimeDidExist = false;
        
      }
    })
    .catch(function (error) {
      console.log(error);
      alert("Kunde inte kontakta servern");
    });
  }
//#endregion
 
//#region Get wash times and fill the view
  FillWashTimes() 
  {
    let events = this.eventSource;
    console.log(this.eventLoad);
    for (var i = 0 ; i < this.eventLoad.length ; i++)
    {     
      let eventData2 = { startTime: this.eventLoad[i].Starttime, endTime: this.eventLoad[i].Endtime, allDay: false , title: "Tvättid", userId: this.eventLoad[i].UserId};   
      eventData2.startTime = new Date(this.eventLoad[i].Starttime);
      eventData2.endTime = new Date(this.eventLoad[i].Endtime);
      events.push(eventData2);
    }
    this.eventSource = [];
    setTimeout(() => {
      this.eventSource = events;
    });
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
 //#endregion
 
//#region Select events and show month
 onViewTitleChanged(title) {
    this.viewTitle = title;
    this.monthtext = title;
  }

  onTimeSelected(ev) {
    this.selectedDay = ev.selectedTime;
  }

  onEventSelected(event) {
    let start = moment(event.startTime).format('LLLL');
    let end = moment(event.endTime).format('LLLL');
    let namn = "";
    console.log(event.userId);
    if(event.userId == 1)
    {
      namn = "Nicholas Flod";
    }
    else if (event.userId == 2)
    {
      namn = "Erika Orosz";
    }
    else 
    {
      namn = "Uppdatera för att se vem som bokat tiden";
    }
    
    let alert = this.alertCtrl.create({
      title: '' + event.title,
      subTitle: 'Från: ' + start + '<br>Till: ' + end + '<br> Bokad av: ' + namn,
      buttons: ['OK']
    })
    alert.present();
  }
//#endregion

//#region Update view and enter view
  showAlert() 
  {
    let alert = this.alertCtrl.create({
      title: 'Felaktig Tvättid!',
      subTitle: 'Antingen är tvättiden upptagen eller så har du valt en tid som är tidigare än den nuvarande',
      buttons: ['OK']
    });
    alert.present();
  }

  switchView()
  {
    if (this.monthOrDay == false)
    {
      this.calendar.mode = 'week';
      this.monthOrDay = true;
    }
    else if (this.monthOrDay == true)
    {
      this.calendar.mode = 'month';
      this.monthOrDay = false;
    }
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    
    setTimeout(() => {
      console.log('Async operation has ended');
      this.getWashTimes();
      refresher.complete();      
    }, 1000);
  }

  ionViewWillEnter()
  {
    this.getWashTimes();
  }

  async ionViewCanEnter() {
    await this.getWashTimes();
  }
//#endregion
}
