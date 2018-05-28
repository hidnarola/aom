import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';
@Injectable()
export class RegisterService {

  constructor(private http: Http) { }

  private headers = new Headers({ 'Content-Type': 'application/json' });

  getLocationFromZipCode (code : any) {
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+code+'&key='+environment.GMAP_KEY);
  }

}
