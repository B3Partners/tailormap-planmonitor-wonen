import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { environment } from './environments/environment';
import { provideHttpClient, withXhr, withInterceptorsFromDi, withXsrfConfiguration } from '@angular/common/http';
import { TailormapApiConstants } from '@tailormap-viewer/api';
import { provideCore } from '@tailormap-viewer/core';
import { AppComponent } from './app/app.component';
import { planmonitorWonenProvider } from '@b3p/planmonitor-wonen';

const main = async () => {
  try {
    await bootstrapApplication(AppComponent, {
      providers: [
        ...environment.providers,
        planmonitorWonenProvider(),
        provideCore({
          production: environment.production,
          viewerBaseUrl: environment.viewerBaseUrl,
        }),
        provideHttpClient(withXhr(), withInterceptorsFromDi(), withXsrfConfiguration({
            cookieName: TailormapApiConstants.XSRF_COOKIE_NAME,
            headerName: TailormapApiConstants.XSRF_HEADER_NAME,
        })),
      ],
    });
  } catch (error) {
    console.error(error);
  }
};

if (environment.production) {
  enableProdMode();
}

main();
