import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  constructor(private httpClient: HttpClient,
              private authService: AuthService) {
  }

  public getFavorites(): Promise<string[]> {
    return this.httpClient.get<string[]>(`${environment.API_URL}/api/favorites`).toPromise();
  }

  public setFavorites(favorites: string[]): Promise<string[]> {
    return this.httpClient.put<string[]>(`${environment.API_URL}/api/favorites`, {favorites})
      .toPromise()
      .then((value: string[]) => {
        return value;
      });
  }

  public addFavorites(favorites: string[]): Promise<string[]> {
    return this.getFavorites().then(existingFavorites => {
      return this.httpClient.put<string[]>(`${environment.API_URL}/api/favorites`, {
        favorites: existingFavorites.concat(favorites)
      })
        .toPromise()
        .then((value: string[]) => {
          return value;
        });
    });
  }

  public addFavorite(favorite: string): Promise<string[]> {
    return this.addFavorites([favorite]);
  }

  public removeFavorite(id: string): Promise<string[]> {
    return this.getFavorites().then(favorites => {
      favorites.splice(favorites.indexOf(id), 1);

      return this.setFavorites(favorites);
    });
  }
}
