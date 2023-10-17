import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import fetchFromSpotify from 'src/services/api';

interface Track {
  name: string;
  preview_url: string | null;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  constructor(private userService: UserService) {}

  authLoading: boolean = false;
  configLoading: boolean = false;
  token: String = "";
  songs : any[] = [];
  artists : any[] = [];
  userData : any = [];
  genre : String = "";
  numSongs : number = 1;
  numArtists: number = 2;


  ngOnInit(): void {
    this.userData = this.userService.getUserData();
    this.genre = this.userData.genre
    this.numSongs = this.userData.numSongs
    this.numArtists = this.userData.numArtists
    this.authLoading = true;
    this.userService.getToken().subscribe({
      next: response => {
        const accessToken = response.access_token;
        this.authLoading = false;
        this.token = accessToken;
        this.fetchRecommendations(this.token)
      },
      error: error => {
        console.error('Error:', error);
        this.authLoading = false;
      }
    });
    console.log('Genre Name:', this.userData.genre);
    console.log('Song Name:', this.userData.numSongs);
    console.log('Artist Name:', this.userData.numArtists);

  }



  fetchRecommendations = async (t: any) => {
    this.configLoading = true;
    const response = await fetchFromSpotify({
      token: t,
      endpoint: `recommendations?seed_genres=${this.genre}&limit=${this.numSongs + 50}`,
    });
    console.log(response)
    console.log(response.tracks[0].artists[0].name);
    this.songs = response.tracks.filter((track: Track) => track.preview_url !== null).slice(0, this.numSongs).map((track: Track) => {
      return {
        name: track.name,
        url: track.preview_url
      }
    });
    this.configLoading = false;
  };
}
