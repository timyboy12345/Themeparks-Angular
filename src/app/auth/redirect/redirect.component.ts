import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AuthService} from '../../_services/auth/auth.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {
  public route?: ParamMap;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    this.route = this.activatedRoute.snapshot.queryParamMap;

    const state = this.route.get('state');
    const code = this.route.get('code');

    if (state !== localStorage.getItem('oauth_state')) {
      alert(`Codes did not match! (${state} / ${localStorage.getItem('oauth_state')})`);
      return;
    }

    this.authService.getTokenFromAuthorizationCode(<string> code).then(value => {
      console.log(value);
      this.router.navigate(['/home']);
    });
  }
}
