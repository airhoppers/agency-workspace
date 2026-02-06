import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Categories</h1>
        <p>Manage travel package categories</p>
      </div>
      <div class="coming-soon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
        </svg>
        <h2>Coming Soon</h2>
        <p>Category management features are under development</p>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;

      h1 {
        font-size: 28px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 8px 0;
      }

      p {
        font-size: 15px;
        color: #6b7280;
        margin: 0;
      }
    }

    .coming-soon {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      text-align: center;

      svg {
        color: #9ca3af;
        margin-bottom: 24px;
      }

      h2 {
        font-size: 20px;
        font-weight: 600;
        color: #374151;
        margin: 0 0 8px 0;
      }

      p {
        font-size: 15px;
        color: #6b7280;
        margin: 0;
      }
    }
  `]
})
export class CategoriesComponent {}
