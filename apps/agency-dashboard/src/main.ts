import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Handle chunk loading failures (happens after new deployments)
window.addEventListener('error', (event) => {
  const isChunkLoadError =
    event.message?.includes('Failed to fetch dynamically imported module') ||
    event.message?.includes('Loading chunk') ||
    event.message?.includes('ChunkLoadError');

  if (isChunkLoadError) {
    // Prevent infinite reload loop - only reload once per session
    const hasReloaded = sessionStorage.getItem('chunk-reload');
    if (!hasReloaded) {
      sessionStorage.setItem('chunk-reload', 'true');
      console.log('Chunk loading error detected. Reloading to get latest version...');
      window.location.reload();
    }
  }
});

// Also handle unhandled promise rejections for dynamic imports
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason?.message || String(event.reason);
  const isChunkLoadError =
    reason.includes('Failed to fetch dynamically imported module') ||
    reason.includes('Loading chunk') ||
    reason.includes('ChunkLoadError');

  if (isChunkLoadError) {
    const hasReloaded = sessionStorage.getItem('chunk-reload');
    if (!hasReloaded) {
      sessionStorage.setItem('chunk-reload', 'true');
      console.log('Chunk loading error detected. Reloading to get latest version...');
      window.location.reload();
    }
  }
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
