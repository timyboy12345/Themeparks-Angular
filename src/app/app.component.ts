import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {environment} from '../environments/environment';
import {AuthService} from './_services/auth/auth.service';
import {MessageService} from './_services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({opacity: 0}),
            animate('0.1s ease-out',
              style({opacity: 1}))
          ]
        ),
        transition(
          ':leave',
          [
            style({opacity: 1}),
            animate('0.1s ease-in',
              style({opacity: 0}))
          ]
        )
      ]
    )
  ]
})
export class AppComponent implements OnInit {
  title = 'Angular-Themeparks';
  public menuOpen = false;
  public version: string = environment.version;

  constructor(private router: Router,
              public authService: AuthService,
              public messageService: MessageService) {
  }

  ngOnInit(): void {
    // Scroll to the top of the page on navigation change
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  public login(): void {
    this.authService.getAuthUrl()
      .then(value => {
        window.location.href = value;
      })
      .catch(reason => {
        console.error(reason);
        window.alert('Er ging iets mis bij het ophalen van de URL, probeer het later opnieuw.');
      });
  }

  public logout(): void {
    this.menuOpen = false;
    this.authService.logout();
  }
}
