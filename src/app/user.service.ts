import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userData: any = {};

  constructor(private http: HttpClient) {}

  setUserData(genre: String, numSongs: number, numArtists: number) {
    this.userData = { genre, numSongs, numArtists };
    // localStorage.setItem('userSettings', JSON.stringify(this.userData))
  }

  getUserData() {
      // const savedData = JSON.parse(localStorage.getItem('userSettings') || '{}');
      // this.userData = savedData;

    return this.userData;
  }

  getNumSongs() {
    return this.userData.numSongs
  }

  getNumArtists() {
    return this.userData.numArtists
  }
  getGenre() {
    return this.userData.genre;
  }

  getToken(): Observable<any> {
    const clientId = '111230cb0a6e4eee9b8f9489b98e1009';
    const clientSecret = '0966bac0a198455db62d489b4d35ddc9';

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;

    return this.http.post<any>('https://accounts.spotify.com/api/token', body, { headers });
  }
}
