import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { IAuth, ILoginRequest, IUserAuth, ITokens } from '../models/auth.model';
import { switchMap } from 'rxjs';

const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly url = 'https://dummyjson.com/auth';

  private _user$ = new BehaviorSubject<IUserAuth | null>(null);
  user$ = this._user$.asObservable();
  isLoggedIn$ = this.user$.pipe(map((user) => !!user));

  private loadRole(user: IUserAuth): Observable<IUserAuth> {
    return this.http
      .get<{ role: string }>(`https://dummyjson.com/users/${user.id}?select=role`)
      .pipe(
        map((res) => ({ ...user, role: res.role })),
        catchError(() => of(user)),
      );
  }

  login(data: ILoginRequest): Observable<IUserAuth> {
    return this.http.post<IAuth>(`${this.url}/login`, data).pipe(
      tap((response) => {
        this.saveTokens(response.accessToken, response.refreshToken);
      }),
      switchMap((response) => this.loadRole(response)),
      tap((user) => this._user$.next(user)),
    );
  }

  initAuth(): Observable<unknown> {
    if (this.getAccessToken() === null) {
      return of(null);
    } else {
      return this.http.get<IUserAuth>(`${this.url}/me`).pipe(
        switchMap((user) => this.loadRole(user)),
        tap((user) => this._user$.next(user)),
        catchError(() => of(null)),
      );
    }
  }

  refreshToken(): Observable<ITokens> {
    return this.http
      .post<ITokens>(`${this.url}/refresh`, { refreshToken: this.getRefreshToken() })
      .pipe(tap((response) => this.saveTokens(response.accessToken, response.refreshToken)));
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
