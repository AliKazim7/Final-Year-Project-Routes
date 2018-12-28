import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  config = {
    apiKey: "AIzaSyDOJXAQca7YiZPnhGyUby-KzgZykgW1NJ8",
    authDomain: "student-9f91d.firebaseapp.com",
    databaseURL: "https://student-9f91d.firebaseio.com",
    projectId: "student-9f91d",
    storageBucket: "student-9f91d.appspot.com",
    messagingSenderId: "710100276290"
  };
  constructor() {
    firebase.initializeApp(this.config);
  }

  public firebase() {
    return firebase;
  }

}
