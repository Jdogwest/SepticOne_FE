import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './parts/app/app.component';
import { appConfig } from './parts/app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
