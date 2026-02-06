import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from '@workspace/shared-ui';
import { AuthService, AgencyService } from '@workspace/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  template: `
    <router-outlet></router-outlet>
    <app-toast-container></app-toast-container>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private agencyService = inject(AgencyService);

  ngOnInit(): void {
    this.bootstrapFromUrlParams();
  }

  private bootstrapFromUrlParams(): void {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const refreshToken = params.get('refreshToken');
    const agencyId = params.get('agencyId');

    if (token && refreshToken) {
      this.authService.setTokens(token, refreshToken);
      this.authService.reloadUserProfile();

      if (agencyId) {
        this.agencyService.getAgencyById(agencyId).subscribe({
          next: (agency) => this.agencyService.setCurrentAgency(agency),
          error: () => {}
        });
      }

      // Clean URL params
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }
  }
}
