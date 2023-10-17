import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import fetchFromSpotify from 'src/services/api';

interface Artist {
  name: string;
}

interface Track {
  name: string;
  preview_url: string | null;
  artists: Artist[];
}

interface SongData {
  name: string;
  url: string | null;
  correctArtist: string;
  potentialArtists: string[];
  userGuess?: string;
  correctGuess?: boolean;
  guessMade?: boolean | null;
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
  songs : SongData[] = [];
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

  shuffleArray(array: any[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }


  fetchRecommendations = async (t: any) => {
    this.configLoading = true;
    const response = await fetchFromSpotify({
      token: t,
      endpoint: `recommendations?seed_genres=${this.genre}&limit=${this.numSongs + 50}`,
    });
    console.log(response)
    console.log(response.tracks[0].artists[0].name);

    const allArtists = response.tracks.map((track: Track) => track.artists[0].name);

    this.songs = response.tracks.filter((track: Track) => track.preview_url !== null).slice(0, this.numSongs).map((track: Track) => {

      const correctArtist = track.artists[0].name;
      const potentialArtists = [correctArtist];

      while (potentialArtists.length < this.numArtists) {
        const randomArtist = allArtists[Math.floor(Math.random() * allArtists.length)];
        if (!potentialArtists.includes(randomArtist)) {
          potentialArtists.push(randomArtist);
        }
      }

      this.shuffleArray(potentialArtists);
      return {
        name: track.name,
        url: track.preview_url,
        correctArtist,
        potentialArtists,
        guessMade: false
      }
    });
    this.configLoading = false;
  };

  checkGuess(song: SongData): void {
    song.guessMade = true;
    if (song.userGuess === song.correctArtist) {
      song.correctGuess = true;
    } else {
      song.correctGuess = false;
    }
  }
}


// push the correct artist
// loop with numArtists - 1
// shuffly the array
