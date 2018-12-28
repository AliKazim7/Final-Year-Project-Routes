import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  start = 'chicago, il';
  end = 'chicago, il';
  waypoints: any[] = []
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});

  constructor(public navCtrl: NavController, public navParams: NavParams,public fb: FirebaseProvider , public geolocation: Geolocation) {
    this.start = navParams.get('origin')
    this.end = navParams.get('destination')
    navParams.get('stops').forEach(item => {
      this.waypoints.push({
        location: new google.maps.LatLng(item.lat, item.lng),
        stopover: true
      })
    })
  }

  ionViewDidLoad() {
    this.initMap();
  }
  
  addMarker(location, map) {
    this.logs.push('in add marker')
    var icon = {
      url: "../../assets/imgs/bus-png-icon-13.png",
      scaledSize: new google.maps.Size(50, 50),
      origin: new google.maps.Point(0,0), 
      anchor: new google.maps.Point(0, 0) 
  };
    var marker = new google.maps.Marker({
        position: location,
        title: 'Driver',
        icon: icon
    });
    marker.setMap(map);
  }
  logs:any [] = []
  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      center: { lat: 31.469374, lng: 74.290879 }
    });

    this.directionsDisplay.setMap(this.map);
    this.calculateAndDisplayRoute()
    
    this.fb.firebase().database().ref('Driver/Bus/1/location').on('value',(data)=>{
      if(data.val() != null){
        
        var l = parseFloat(data.val()['lat']);
        var ll = parseFloat(data.val()['lng']);
        this.logs.push('data recieved = ' + l + '/' + ll)
        this.addMarker({ lat: l, lng: ll },this.map)
      }
    })
  }

  calculateAndDisplayRoute() {
    this.directionsService.route({
      origin: this.start,
      destination: this.end,
      waypoints: this.waypoints,
      optimizeWaypoints: true,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });

    this.geolocation.getCurrentPosition({enableHighAccuracy:true}).then((resp) => {
      var ddirectionsDisplay = new google.maps.DirectionsRenderer();
      ddirectionsDisplay.setMap(this.map);
     console.log('aa rai hai YE');
    
      this.directionsService.route({
        origin: {lat:resp.coords.latitude, lng:resp.coords.longitude},
        destination: this.waypoints[1].location,
        travelMode: 'WALKING'
      }, (response, status) => {
        if (status === 'OK') {
          ddirectionsDisplay.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }


}
