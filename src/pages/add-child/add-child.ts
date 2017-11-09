import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgForm } from "@angular/forms";
import { Camera, CameraOptions } from '@ionic-native/camera';

import { HomePage } from '../../pages/home/home';

import { RequestService } from "../../services/request";
import { ChildrenService } from '../../services/children';
import { AuthService } from "../../services/auth";

import * as moment from 'moment';

@Component({
  selector: 'page-add-child',
  templateUrl: 'add-child.html',
})
export class AddChildPage {
  public date: Date = moment()['_d'];
  public object = {
    monday: false,
    weekdays: ['Niedz', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'],
    months: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']
  };
  public newChildBlock: boolean = false;
  public image: string = '';
  public imageTaken: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public childrenService: ChildrenService,
    public requestService: RequestService,
    public authService: AuthService,
    public camera: Camera
  ) {
  }

  ionViewWillEnter() {
    if (this.childrenService.children.length > 1) {
      this.newChildBlock = true;
    } else {
      this.newChildBlock = false;
    }
    this.imageTaken = false;
  }

  setPicture() {
    const options: CameraOptions = {
      quality: 100,
      correctOrientation: true,
      saveToPhotoAlbum: true,
      targetWidth: 150,
      targetHeight: 150,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      this.imageTaken = true;
    }, (err) => {
      console.log('error');
    });
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 100,
      correctOrientation: true,
      saveToPhotoAlbum: true,
      targetWidth: 150,
      targetHeight: 150,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.image = 'data:image/jpeg;base64,' + imageData;
      this.imageTaken = true;
    }, (err) => {
      console.log('error');
    });
  }

  addChild(form: NgForm) {
    let date = moment(this.date).format('YYYY-MM-DD HH:mm:ss');
    let requestData = {
      token: this.authService.userToken,
      body: {
        'parrent_id': this.authService.userID,
        'name': form.value.name,
        'weight': Number(form.value.weight),
        'length': Number(form.value.length),
        'dateofbirth': date,
        'photo': this.image
      }
    }
    this.requestService.postMethod('/children', requestData).subscribe(data => {
      if (data.error === false) {
        console.log('Succes')
      } else {
        console.log('Error')
      }
      this.navCtrl.setRoot(HomePage);
    });
  }

  setDate(date: Date) {
    this.date = date;
  }

  showTime(time) {
    return moment(time).format('DD.MM.YYYY');
  }

  goBack() {
    this.navCtrl.setRoot(HomePage);
  }

}