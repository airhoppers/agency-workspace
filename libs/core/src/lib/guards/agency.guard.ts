import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AgencyService } from '../services/agency.service';
import { map, catchError, of, switchMap, timer } from 'rxjs';

export const agencyGuard: CanActivateFn = (route, state) => {
  const agencyService = inject(AgencyService);
  const router = inject(Router);

  // Check if agency is already loaded
  const currentAgency = agencyService.getCurrentAgency();
  if (currentAgency) {
    return true;
  }

  // Try to load from storage
  const agencyId = localStorage.getItem('current_agency_id');
  if (agencyId) {
    // First, wait a brief moment for the agency to potentially be loaded by dashboard layout
    return timer(50).pipe(
      switchMap(() => {
        // Check again after the delay
        const loadedAgency = agencyService.getCurrentAgency();
        if (loadedAgency) {
          return of(true);
        }

        // If still not loaded, fetch it ourselves
        return agencyService.getAgencyById(agencyId).pipe(
          map(agency => {
            agencyService.setCurrentAgency(agency);
            return true;
          }),
          catchError(() => {
            localStorage.removeItem('current_agency_id');
            router.navigate(['/dashboard/agencies']);
            return of(false);
          })
        );
      })
    );
  }

  router.navigate(['/dashboard/agencies']);
  return false;
};
