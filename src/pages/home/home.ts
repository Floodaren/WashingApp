import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import axios from 'axios';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  id:any;
  posts:any;
  constructor(public navCtrl: NavController, public storage: Storage) {
    this.ShowWashTimes();
  }

  async ShowWashTimes()
  {
   await this.storage.get('LoggedInId').then((val) => {
      this.id = val;
      });
    this.handleGetWashTimes();
  }

  getPosts()
  {
    this.handleGetWashTimes();
  }

  handleGetWashTimes() {
    console.log(this.id);
    axios.post('http://localhost:3030/GetWashTimesForSpecificUser', {
      userId: this.id
    })
    .then(result => {
      if (result.data.result === false)
      {
        console.log("inga poster");
      }
      else 
      {
        this.posts = result.data.result;
      }
    })
    .catch(function (error) {
      console.log(error);
      alert("Kunde inte kontakta servern");
    });
  }

}


