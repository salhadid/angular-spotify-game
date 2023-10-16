import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import fetchFromSpotify from "../../services/api";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  genreForm: FormGroup;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {
    this.genreForm = this.formBuilder.group({
      genre: ['', Validators.required],
      numSongs: [1, [Validators.required, Validators.min(1), Validators.max(3)]],
      numArtists: [2, [Validators.required, Validators.min(2), Validators.max(4)]]
    });
  }

  genres: String[] = ["House", "Alternative", "J-Rock", "R&B"];
  selectedGenre: String = "";
  authLoading: boolean = false;
  configLoading: boolean = false;
  token: String = "";

  loadGenres = async (t: any) => {
    this.configLoading = true;
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    });
    console.log(response);
    this.genres = response.genres;
    this.configLoading = false;
  };

  getToken() {
    const clientId = 'your-client-id'; // Replace with your Spotify client ID
    const clientSecret = 'your-client-secret'; // Replace with your Spotify client secret

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`;

    return this.http.post<any>('https://accounts.spotify.com/api/token', body, { headers });
  }

  ngOnInit(): void {
    this.authLoading = true;
    this.getToken().subscribe({
      next: response => {
        const accessToken = response.access_token;
        console.log('Access Token:', accessToken);
    
        this.authLoading = false;
        this.token = accessToken;
    
        this.loadGenres(this.token);
      },
      error: error => {
        console.error('Error:', error);
        this.authLoading = false;
      }
    });
  }

  setGenre(selectedGenre: any) {
    this.selectedGenre = selectedGenre;
    console.log(this.selectedGenre);
  }

  submitForm() {
    if (this.genreForm.valid) {
      console.log('Form values:', this.genreForm.value);
    }
  }
}
