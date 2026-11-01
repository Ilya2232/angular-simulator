import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private _isLoading$ = new BehaviorSubject<boolean>(false);

  isLoading$: Observable<boolean> = this._isLoading$.asObservable();

  showLoader() {
    this._isLoading$.next(true);
  }

  hideLoader() {
    this._isLoading$.next(false);
  }
}
