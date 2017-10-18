import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { App } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import axios from 'axios';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username:any;
  password:any;
  test:any;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, private app:App, public alertCtrl: AlertController) {
  }
  

  handleSubmit() {
    axios.post('http://localhost:3030/LogInUser', {
      username: this.username,
      password: this.password
    })
    .then(result => {
      if (result.data.userId === 0)
      {
        this.showAlert();
      }
      else 
      {
        this.storage.set('LoggedInEmail', result.data.email);
        this.storage.set('LoggedInId', result.data.userId);
        this.checkIfLoggedIn();
      }
    })
    .catch(function (error) {
      console.log(error);
      alert("Kunde inte kontakta servern");
    });
  }

  async checkIfLoggedIn()
  {
    var userEmail;
    var userId;
    await this.storage.get('LoggedInEmail').then((val) => { 
      userEmail = val;
    });
    await this.storage.get('LoggedInId').then((val) => {
      userId = val;
    });
    if (userEmail != undefined && userId != undefined)
    {
      this.app.getRootNav().setRoot(TabsPage);
    }
  }
  showAlert() 
  {
    let alert = this.alertCtrl.create({
      title: 'Login misslyckades',
      subTitle: 'Felaktig email eller lösenord, försök igen',
      buttons: ['OK']
    });
    alert.present();
  }
}
