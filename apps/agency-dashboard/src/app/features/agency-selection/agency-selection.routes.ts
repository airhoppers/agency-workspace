import { Routes } from '@angular/router';
import { AgencySelectionComponent } from './agency-selection.component';

export const AGENCY_SELECTION_ROUTES: Routes = [
  {
    path: '',
    component: AgencySelectionComponent
  },
  {
    path: 'create',
    loadComponent: () => import('./create-agency/create-agency.component').then(m => m.CreateAgencyComponent)
  }
];
