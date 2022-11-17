import { Observable, Subject } from "rxjs";

export enum AuthEvent {
  SIGN_IN,
  SIGN_OUT,
  TOKEN_REFRESh,
}
export abstract class AuthProvider {
  private _onAuthChange$: Subject<{ type: AuthEvent; data?: any }> =
    new Subject();

  get onAuthChange$(): Observable<{ type: AuthEvent; data?: any }> {
    return this._onAuthChange$.asObservable();
  }

  onSignin(data: any) {
    this._onAuthChange$.next({ type: AuthEvent.SIGN_IN, data });
  }

  onSignout(): void {
    this._onAuthChange$.next({ type: AuthEvent.SIGN_OUT });
  }

  onTokenRefresh(data: any) {
    this._onAuthChange$.next({ type: AuthEvent.TOKEN_REFRESh, data });
  }
}
