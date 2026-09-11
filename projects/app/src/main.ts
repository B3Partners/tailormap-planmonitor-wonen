import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowser } from '@angular/platform-browser';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const main = async () => {
  try {
    await platformBrowser().bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()] });
  } catch (error) {
    console.error(error);
  }
};

if (environment.production) {
  enableProdMode();
}

main();
