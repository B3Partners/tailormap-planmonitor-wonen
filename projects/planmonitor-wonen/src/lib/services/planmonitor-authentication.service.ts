import { BehaviorSubject, map } from 'rxjs';
import { AuthenticatedUserService } from '@tailormap-viewer/api';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef, Injectable } from '@angular/core';
import { SecurityPropertyModel } from '@tailormap-viewer/api';

export interface PlanmonitorUserModel {
  isAuthenticated: boolean;
  isGemeenteGebruiker: boolean;
  isProvincieGebruiker: boolean;
  gemeente: string | null;
}

const ANON_USER: PlanmonitorUserModel = {
  isAuthenticated: false,
  isGemeenteGebruiker: false,
  isProvincieGebruiker: false,
  gemeente: null,
};

@Injectable({
  providedIn: 'root',
})
export class PlanmonitorAuthenticationService {

  public static readonly TYPE_GEBRUIKER_KEY = 'typeGebruiker';
  public static readonly GEMEENTE_KEY = 'gemeente';
  public static readonly TYPE_GEBRUIKER_GEMEENTE = 'gemeente';
  public static readonly TYPE_GEBRUIKER_PROVINCIE = 'provincie';

  private gebruikersDataSubject = new BehaviorSubject<PlanmonitorUserModel>(ANON_USER);

  public gebruiker$ = this.gebruikersDataSubject.asObservable();
  public isGemeenteGebruiker$ = this.gebruiker$
    .pipe(map(gebruiker => gebruiker.isAuthenticated && gebruiker.isGemeenteGebruiker));
  public isProvincieGebruiker$ = this.gebruiker$
    .pipe(map(gebruiker => gebruiker.isAuthenticated && gebruiker.isProvincieGebruiker));
  public ingelogdeGebruikerGemeente$ = this.gebruiker$
    .pipe(map(gebruiker => gebruiker.isAuthenticated && gebruiker.isGemeenteGebruiker ? gebruiker.gemeente || null : null));

  constructor(
    private authenticatedUserService: AuthenticatedUserService,
    private destroyRef: DestroyRef,
  ) {
    this.authenticatedUserService.getUserDetails$()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(details => {
      const isGemeenteGebruiker = PlanmonitorAuthenticationService.isTypeGebruiker(details.groupProperties, PlanmonitorAuthenticationService.TYPE_GEBRUIKER_GEMEENTE);
      const gemeente = isGemeenteGebruiker
        ? details.groupProperties?.find(p => p.key === PlanmonitorAuthenticationService.GEMEENTE_KEY)?.value
        : null;
      this.gebruikersDataSubject.next({
        isAuthenticated: details.isAuthenticated,
        isGemeenteGebruiker,
        isProvincieGebruiker: PlanmonitorAuthenticationService.isTypeGebruiker(details.groupProperties, PlanmonitorAuthenticationService.TYPE_GEBRUIKER_PROVINCIE),
        gemeente: typeof gemeente === 'string' ? gemeente : null,
      });
    });
  }

  private static isTypeGebruiker(props: SecurityPropertyModel[] | undefined | null, type: string) {
    if (props === null || typeof props === 'undefined') {
      return false;
    }
    return props.some(p => {
      return p.key === PlanmonitorAuthenticationService.TYPE_GEBRUIKER_KEY && p.value === type;
    });
  }

}
