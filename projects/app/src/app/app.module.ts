import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CoreModule } from "@tailormap-viewer/core";
import { SharedModule } from "@tailormap-viewer/shared";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from '../environments/environment';
import { provideHttpClient, withInterceptorsFromDi, withXsrfConfiguration } from '@angular/common/http';
import { TailormapApiConstants } from '@tailormap-viewer/api';
import { PlanmonitorWonenModule } from '@b3p/planmonitor-wonen';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule.forRoot({
      production: environment.production,
      viewerBaseUrl: environment.viewerBaseUrl,
    }),
    BrowserAnimationsModule,
    SharedModule,
    PlanmonitorWonenModule,
    ...environment.imports,
  ],
  providers: [
    provideHttpClient(
      withInterceptorsFromDi(),
      withXsrfConfiguration({
        cookieName: TailormapApiConstants.XSRF_COOKIE_NAME,
        headerName: TailormapApiConstants.XSRF_HEADER_NAME,
      }),
    ),
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
