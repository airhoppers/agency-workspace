import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/homepage/homepage.component').then(m => m.HomepageComponent)
      },
      {
        path: 'pricing',
        loadComponent: () => import('./pages/pricing/pricing.component').then(m => m.PublicPricingComponent)
      },
      {
        path: 'support',
        loadComponent: () => import('./pages/support/support.component').then(m => m.PublicSupportComponent)
      },
      {
        path: 'features',
        loadComponent: () => import('./pages/features/features.component').then(m => m.PublicFeaturesComponent)
      },
      {
        path: 'documentation',
        loadComponent: () => import('./pages/documentation/documentation.component').then(m => m.PublicDocumentationComponent)
      },
      {
        path: 'guides',
        loadComponent: () => import('./pages/guides/guides.component').then(m => m.PublicGuidesComponent)
      },
      {
        path: 'blog',
        loadComponent: () => import('./pages/blog/blog.component').then(m => m.PublicBlogComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.component').then(m => m.PublicAboutComponent)
      },
      {
        path: 'careers',
        loadComponent: () => import('./pages/careers/careers.component').then(m => m.PublicCareersComponent)
      },
      {
        path: 'press',
        loadComponent: () => import('./pages/press/press.component').then(m => m.PublicPressComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./pages/contact/contact.component').then(m => m.PublicContactComponent)
      },
      {
        path: 'privacy-policy',
        loadComponent: () => import('./pages/privacy-policy/privacy-policy.component').then(m => m.PublicPrivacyPolicyComponent)
      },
      {
        path: 'terms-of-service',
        loadComponent: () => import('./pages/terms-of-service/terms-of-service.component').then(m => m.PublicTermsOfServiceComponent)
      },
      {
        path: 'cookie-policy',
        loadComponent: () => import('./pages/cookie-policy/cookie-policy.component').then(m => m.PublicCookiePolicyComponent)
      }
    ]
  }
];
