import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import fetchFromSpotify from "../../services/api";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from "../user.service";
import { Router } from "@angular/router";


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
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.genreForm = this.formBuilder.group({
      genre: ['', Validators.required],
      numSongs: [(this.userService.getNumSongs() || 1), [Validators.required, Validators.min(1), Validators.max(3)]],
      numArtists: [(this.userService.getNumArtists() || 2), [Validators.required, Validators.min(2), Validators.max(4)]]
    });
  }

  genres: String[] = [];
  authLoading: boolean = false;
  configLoading: boolean = false;
  token: String = "";
  // userData: any = {};



  ngOnInit(): void {
    this.authLoading = true;
    // this.userData = this.userService.getUserData;
    this.userService.getToken().subscribe({
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
