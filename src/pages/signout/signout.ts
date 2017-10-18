import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import { App } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-signout',
  templateUrl: 'signout.html',
})
export class SignoutPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController, private app:App) {
  }

  signOut()
  {
    this.showConfirm();
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Logga ut',
      message: 'Är du säker på att du vill logga ut?',
      buttons: [
        {
          text: 'Ja',
          handler: () => {
            this.storage.clear();
            this.app.getRootNav().setRoot(TabsPage);
          }
        },
        {
          text: 'Nej',
          handler: () => {
            
          }
        }
      ]
    });
    confirm.present();
  }
}
