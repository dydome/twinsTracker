import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { NgForm } from '@angular/forms';

import { RegisterPage } from "../register/register";
import { ReminderPage } from "../reminder/reminder";
import { HomePage } from "../home/home";

import { AuthService } from '../../services/auth';
import { RequestService } from '../../services/request';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  registerPage = RegisterPage;
  reminderPage = ReminderPage;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authService: AuthService,
    public requestService: RequestService
  ) {
  }

  // ionViewWillEnter() {
  //   this.authService.setKeys();
  // }
  
  ionViewDidEnter() {
    this.authService.getKeys();
  }


  loginUser() {
    let body = {
      'email': this.authService.userEmail,
      'password': this.authService.userPassword
    };
    let token = {};
    this.requestService.postMethod('/auth', body, token).subscribe(data => {
      if (data.error === false) {
        this.authService.userToken = data.token;
        this.authService.userID = data.user.id;
        this.authService.setKeys(data.token, data.email, data.user.id);
        this.navCtrl.setRoot(HomePage);
      }
    });
  }
}