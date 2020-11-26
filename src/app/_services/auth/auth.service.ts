import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../../_interfaces/user.interface';
import {environment} from '../../../environments/environment';
import {MessageService} from '../message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  get isLoggedIn(): boolean {
    return localStorage.getItem('oauth_token') !== null && localStorage.getItem('refresh_token') !== null;
  }

  constructor(private httpClient: HttpClient,
              private messageService: MessageService) {
    if (this.isLoggedIn) {
      this.getUserInfo().then(value => {
        this.user = value;
      });
    }
  }

  private static chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  public user?: User;

  private static async generateCodeChallenge(codeVerifier: string): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256',
      new TextEncoder().encode(codeVerifier));

    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  private static random_string(length: number, chars: string = this.chars): string {
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  public logout(): void {
    this.user = undefined;
    localStorage.removeItem('oauth_token');
    localStorage.removeItem('refresh_token');

    this.messageService.addMessage('Uitgelogd', 'Je bent nu uitgelogd!');
  }

  public async getAuthUrl(): Promise<string> {
    const url = environment.API_URL;

    const state = AuthService.random_string(40, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
    localStorage.setItem('oauth_state', state);

    const codeVerifier = AuthService.random_string(128);
    localStorage.setItem('oauth_code_verifier', codeVerifier);

    const codeChallenge = await AuthService.generateCodeChallenge(codeVerifier);
    localStorage.setItem('oauth_code_challenge', codeChallenge);

    console.log(codeVerifier);
    console.log(codeChallenge);

    const clientId = environment.OAUTH_PUBLIC_KEY;
    const redirectUri = encodeURIComponent(`${environment.APP_URL}/auth/redirect`);
    const responseType = 'code';
    const scope = '*';

    const codeChallengeMethod = 'S256';

    return `${url}/oauth/authorize?state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`;
  }

  public async getTokenFromAuthorizationCode(authorizationCode: string): Promise<User | void> {
    const codeVerifier = localStorage.getItem('oauth_code_verifier');

    return await this.httpClient.post<User>(`${environment.API_URL}/oauth/token`, {
      grant_type: 'authorization_code',
      client_id: environment.OAUTH_PUBLIC_KEY,
      redirect_uri: `${environment.APP_URL}/auth/redirect`,
      code_verifier: codeVerifier,
      code: authorizationCode,
    }).toPromise()
      .then(async (value: any) => {
        localStorage.removeItem('oauth_code_verifier');
        localStorage.removeItem('oauth_code_challenge');

        localStorage.setItem('oauth_token', value.access_token);
        localStorage.setItem('refresh_token', value.refresh_token);

        this.messageService.addMessage('Ingelogd', 'Je bent succesvol ingelogd!');

        return await this.getUserInfo().then((u: User) => {
          this.user = u;
          return u;
        });
      })
      .catch(reason => {
        window.alert('Er ging iets fout met het inlogproces');
      });
  }

  public getUserInfo(): Promise<User> {
    return this.httpClient.get<User>(`${environment.API_URL}/api/user`, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('oauth_token')}`
      })
    }).toPromise();
  }

  public getAuthToken(): string {
    return localStorage.getItem('oauth_token') as string;
  }

  public getRefreshToken(): string {
    return localStorage.getItem('refresh_token') as string;
  }
}
