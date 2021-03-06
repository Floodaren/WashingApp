import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { App } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import axios from 'axios';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  Userid:any;
  posts:any;
  constructor(public navCtrl: NavController, public storage: Storage, private app:App ) {  
  }

  async ShowWashTimes()
  {
   await this.storage.get('LoggedInId').then((val) => {
      this.Userid = val;
      });
    this.handleGetWashTimes();
  }

  deleteWashTime(id)
  {
    console.log(id);
    axios.post('http://localhost:3030/DeleteWashTime', {
      washId: id
    })
    .then(result => {
      if (result.data.result === false)
      {
        console.log("Något gick fel");
      }
      else 
      {
        this.ShowWashTimes();
        if (this.posts.length === 1)
        {
          this.app.getRootNav().setRoot(TabsPage);
        }
        else 
        {
          
        }
        
      }
    })
    .catch(function (error) {
      console.log(error);
      alert("Kunde inte kontakta servern");
    });
  }

  handleGetWashTimes() {
    axios.post('http://localhost:3030/GetWashTimesForSpecificUser', {
      userId: this.Userid
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
  
  
  ionViewWillEnter()
  {
    this.posts = [];
    this.ShowWashTimes();
  }
  
  
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    
    setTimeout(() => {
      refresher.complete();
      this.posts = [];
      this.ShowWashTimes();
    }, 1000);
  }

}


