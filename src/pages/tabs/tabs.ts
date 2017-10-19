import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { SignoutPage } from '../signout/signout';

import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  logInCheck = false;
  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = LoginPage;
  tab5Root = SignoutPage;
  constructor(public storage: Storage) {
    this.checkIfLoggedIn();
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
      this.logInCheck = true;
    }
  }
}
