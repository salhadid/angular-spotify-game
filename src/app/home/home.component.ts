import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import fetchFromSpotify, { request } from "../../services/api";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from "../user.service";
import { Router } from "@angular/router";


const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";

  const TOKEN_KEY = "whos-who-access-token";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  genreForm: FormGroup;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.genreForm = this.formBuilder.group({
      genre: ['', Validators.required],
      numSongs: [1, [Validators.required, Validators.min(1), Validators.max(3)]],
      numArtists: [2, [Validators.required, Validators.min(2), Validators.max(4)]]
    });
  }

  genres: String[] = [];
  authLoading: boolean = false;
  configLoading: boolean = false;
  token: String = "";



  ngOnInit(): void {
    this.authLoading = true;
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        this.authLoading = false;
        this.token = storedToken.value;
        this.loadGenres(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      this.authLoading = false;
      this.token = newToken.value;
    });

  }

  loadGenres = async (t: any) => {
    this.configLoading = true;
    const response = await fetchFromSpotify({
      token: this.token,
      endpoint: "recommendations/available-genre-seeds",
    });
    console.log(response);
    this.genres = response.genres;
    this.configLoading = false;
  };


  submitForm() {
    if (this.genreForm.valid) {
      console.log('Form values:', this.genreForm.value);
      const genre = this.genreForm.value.genre;
      const numSongs = this.genreForm.value.numSongs;
      const numArtists = this.genreForm.value.numArtists;
      this.userService.setUserData(genre, numSongs, numArtists);
      this.router.navigate(['/game']);
    }
  }
}
