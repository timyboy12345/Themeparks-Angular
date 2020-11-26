import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TitleService} from '../_services/title.service';
import {FavoritesService} from '../_services/auth/favorites.service';
import {AuthService} from '../_services/auth/auth.service';
import {ThemeparksService} from '../_services/themeparks.service';
import {Themepark} from '../_interfaces/themepark.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public favoriteParks: Themepark[];

  constructor(private titleService: TitleService,
              public authService: AuthService,
              private favoritesService: FavoritesService,
              private themeparksService: ThemeparksService) {
    this.titleService.setTitle('Home');
    this.favoriteParks = [];
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.favoritesService.getFavorites().then(favorites => {
        this.themeparksService.getParksByIds(favorites).then(favoriteParks => {
          this.favoriteParks = favoriteParks;
        });
      });
    }
  }
}
