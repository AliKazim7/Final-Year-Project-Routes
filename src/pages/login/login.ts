import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  user: 'hassan'
  pass: '123'
  stops: any[] = []
  constructor(public navCtrl: NavController, public navParams: NavParams, public fb: FirebaseProvider,
    public loader:LoadingController, public alert:AlertController) {
  }

  login() {
    let l = this.loader.create({content:'Signing In...'})
    l.present()
    this.fb.firebase().database().ref('Students/' + this.user).once('value', (data) => {
      if (data.exists()) {
        if (data.val()['password'] == this.pass) {
          this.fb.firebase().database().ref('Routes/' + data.val()['route']).once('value', (val) => {
            var t = ''
            t = val.val()['waypoints']
            var len = t.split(',')
            var count = 0
            len.forEach((item) => {
              this.fb.firebase().database().ref('Stops/' + item).once('value', (d) => {
                this.stops.push({ lat: d.val()['lat'], lng: d.val()['lng'] })
              }).then(() => {
                if (++count == len.length) {
                  l.dismiss()
                  this.navCtrl.setRoot('MapPage', { origin: val.val()['origin'], destination: val.val()['destination'], stops: this.stops })
                }
              })
            })
          })

        }
        else {
          this.alert.create({title:'Password Incorrect',buttons:[{text:'Retry'}]}).present()
          l.dismiss()
        }
      }
      else {
        this.alert.create({title:'User does not exist',buttons:[{text:'Retry'}]}).present()
        l.dismiss()
      }
    })
    // this.fb.firebase().database().ref('Students').set({
    //   "hassan":{
    //     "name":"Hassan Ali",
    //     "number":"03134698550",
    //     "address":"363 E1 Johar Town",
    //     "location":{"lat": "31.469374", "lng": "74.290879"},
    //     "password":"123",
    //     "route":"1"
    //   }
    // })

  }
}
