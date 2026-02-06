import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flights',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Flights</h1>
        <p>Manage flight schedules and routes</p>
      </div>
      <div class="coming-soon">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
        </svg>
        <h2>Coming Soon</h2>
        <p>Flight management features are under development</p>
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
export class FlightsComponent {}
