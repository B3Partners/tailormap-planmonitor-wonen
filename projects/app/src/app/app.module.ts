import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CoreModule } from "@tailormap-viewer/core";
import { SharedModule } from "@tailormap-viewer/shared";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { environment } from '../environments/environment';
import { PlanmonitorWonenModule } from '@b3p/planmonitor-wonen';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule.forRoot({
      production: environment.production,
      viewerBaseUrl: environment.viewerBaseUrl,
    }),
    SharedModule,
    PlanmonitorWonenModule,
    ...environment.imports,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
