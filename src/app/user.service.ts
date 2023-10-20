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
  }

  getUserData() {
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
    const clientId = '5c879be09efc4815800e89e76d75c3b8';
    const clientSecret = 'bf20090e32944342a0dc67dfd75e703a';

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;

    return this.http.post<any>('https://accounts.spotify.com/api/token', body, { headers });
  }
}
