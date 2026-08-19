import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, of, tap } from 'rxjs';
import { IUser } from '../../interfaces/IUser';
import { UserApiService } from './user-api.service';
import { LoaderService } from './loader.service';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _users$ = new BehaviorSubject<IUser[]>([]);

  constructor(
    private userApiService: UserApiService,
    private loaderService: LoaderService,
    private messageService: MessageService
  ) { }

  public setUsers(users: IUser[]): void {
    this._users$.next(users);
  }

  public getUsers(): Observable<IUser[]> {
    return this._users$.asObservable();
  }

  public loadUsers(): Observable<IUser[]> {
    this.loaderService.showLoader();

    return this.userApiService.getUsers().pipe(
      tap((users) => this.setUsers(users)),
      catchError(() => {
        this.messageService.showError('Не удалось загрузить пользователей');
        this.setUsers([]);
        return of([]);
      }),
      finalize(() => this.loaderService.hideLoader())
    );
  }
}