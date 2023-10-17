import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import fetchFromSpotify from 'src/services/api';

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
  songs : any[] = []
  artists : any[] = []
  userData : any = [];


  ngOnInit(): void {
    this.userData = this.userService.getUserData();
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
  }



  fetchRecommendations = async (t: any) => {
    this.configLoading = true;
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    });
   
  };

  
}

