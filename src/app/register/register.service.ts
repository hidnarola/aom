import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';
@Injectable()
export class RegisterService {
  private api_host : any = environment.API_URL;
  constructor(private http: Http) { }

  private headers = new Headers({ 'Content-Type': 'application/json' });

  getLocationFromZipCode (code : any) {
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+code+'&key='+environment.GMAP_KEY);
  }
  // Artist Registration service
  artistRegistration(data : any) {
    return this.http.post(`${this.api_host}/artist_registration`, data);
  }

  // Listener Registration service
  listenerRegistration(data : any) {
    return this.http.post(`${this.api_host}/user_registration`, data);
  }
}
