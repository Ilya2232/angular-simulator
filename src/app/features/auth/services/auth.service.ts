import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { IAuth, ILoginRequest, IUserAuth, ITokens } from '../models/auth.model';

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly url = 'https://dummyjson.com/auth';

  private _user$ = new BehaviorSubject<IUserAuth | null>(null);
  public user$ = this._user$.asObservable();
  public isLoggedIn$ = this.user$.pipe(map(user => !!user));

  login(data: ILoginRequest): Observable<IAuth> {
    return this.http.post<IAuth>(`${this.url}/login`, data).pipe(
      tap(response => {
        this.saveTokens(response.accessToken, response.refreshToken);
        this._user$.next(response)
      })
    )
  }

  initAuth(): Observable<unknown> {
    if (this.getAccessToken() === null) {
      return of(null);
    } else {
      return this.http.get<IUserAuth>(`${this.url}/me`).pipe(
        tap(user => this._user$.next(user)),
        catchError(() => of(null))
      );
    }
  }

  refreshToken(): Observable<ITokens> {
    return this.http.post<ITokens>(`${this.url}/refresh`, { refreshToken: this.getRefreshToken() }).pipe(
      tap(response => this.saveTokens(response.accessToken, response.refreshToken))
    );
  }

  logout(): void {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    this._user$.next(null);
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  }

  private saveTokens(access: string, refresh: string): void {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  }
}