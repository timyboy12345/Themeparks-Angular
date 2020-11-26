import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../_services/auth/auth.service';
import {User} from '../../_interfaces/user.interface';
import {FavoritesService} from '../../_services/auth/favorites.service';
import {ThemeparksService} from '../../_services/themeparks.service';
import {Themepark} from '../../_interfaces/themepark.interface';
import {MessageService} from '../../_services/message.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public user?: User = this.authService.user;
  public parks: Themepark[];
  private favorites: string[];

  public get favoriteParks(): Themepark[] {
    if (!this.parks || !this.favorites) {
      return [];
    }

    return this.parks.filter(favorite => {
      return this.favorites.includes(favorite.id);
    });
  }

  constructor(private authService: AuthService,
              private favoritesService: FavoritesService,
              private themeparksService: ThemeparksService,
              private messageService: MessageService) {
    this.parks = [];
    this.favorites = [];
  }

  ngOnInit(): void {
    this.favoritesService.getFavorites().then(favorites => {
      this.favorites = favorites;
    });

    this.themeparksService.getParks().then(parks => {
      this.parks = parks;
    });
  }

  public toggleFavorite(id: string): void {
    if (!this.favorites.includes(id)) {
      this.favoritesService.addFavorite(id).then(favorites => {
        this.favorites = favorites;
        this.messageService.addMessage('Park toegevoegd', 'Je hebt dit park toegevoegd aan je favoriete parken!');
      });
    } else {
      this.favoritesService.removeFavorite(id).then(favorites => {
        this.favorites = favorites;
        this.messageService.addMessage('Park verwijderd', 'Je hebt dit park verwijderd van je favoriete parken!');
      });
    }
  }

  public isFavorite(id: string): boolean {
    return this.favorites.includes(id);
  }
}
