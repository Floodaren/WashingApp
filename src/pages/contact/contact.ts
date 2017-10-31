import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
import axios from 'axios';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  id:any;
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public storage: Storage) {
    this.storage.get('LoggedInId').then((val) => {
      this.id = val;
      });
  }
//#region Change mail and password prompts
  changeEmail()
  {
    this.showPromptEmail("Ändra Mail","Vilken ny e-postadress vill du ändra till?", "email", "Ny email");
  }

  changePassword()
  {
    this.showPromptPassword("Ändra Lösenord","Vilket nytt lösenord vill du ändra till?", "password", "Nytt lösenord");
    
  }

  showPromptEmail(inputTitle, inputmessage, inputname, inputplaceholder) 
  {
    let prompt = this.alertCtrl.create({
      title: inputTitle,
      message: inputmessage,
      inputs: [
        {
          name: inputname,
          placeholder: inputplaceholder
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.handleChangeEmail(this.id,data.email);
          }
        }
      ]
    });
    prompt.present();
  }

  showPromptPassword(inputTitle, inputmessage, inputname, inputplaceholder) 
  {
    let prompt =  this.alertCtrl.create({
      title: inputTitle,
      message: inputmessage,
      inputs: [
        {
          name: inputname,
          placeholder: inputplaceholder
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.handleChangePassword(this.id,data.password);
          }
        }
      ]
    });
    prompt.present();
  }
//#endregion


//#region Change mail and password functions
  handleChangePassword(ChangeuserId,newPassword) {
    axios.post('http://localhost:3030/ChangePassword', {
      userId: ChangeuserId,
      password: newPassword
    })
    .then(result => {
      if (result.data.satus === false)
      {
        this.showAlert("Misslyckades", "Något gick fel, försök igen");
      }
      else 
      {
        this.showAlert("Lyckades", "Ditt lösenord är nu ändrat");
      }
    })
    .catch(function (error) {
      console.log(error);
      alert("Kunde inte kontakta servern");
    });
  }

  handleChangeEmail(ChangeuserId,newEmail) {
    axios.post('http://localhost:3030/ChangeEmail', {
      userId: ChangeuserId,
      email: newEmail
    })
    .then(result => {
      if (result.data.satus === false)
      {
        this.showAlert("Misslyckades", "Något gick fel, försök igen");
      }
      else 
      {
        this.showAlert("Lyckades", "Din mail är nu ändrad");
        this.storage.set('LoggedInEmail', newEmail);
        this.storage.get('LoggedInEmail').then((val) => {
          console.log(val);
          });
      }
    })
    .catch(function (error) {
      console.log(error);
      alert("Kunde inte kontakta servern");
    });
  }

  showAlert(inputTitle, inputSubTitle) 
  {
    let alert = this.alertCtrl.create({
      title: inputTitle,
      subTitle: inputSubTitle,
      buttons: ['OK']
    });
    alert.present();
  }
//#endregion
}

