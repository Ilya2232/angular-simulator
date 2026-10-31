import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable, map } from 'rxjs';
import { IUser } from '../../../interfaces/IUser';
import { UserService } from '../../services/user.service';
import { UserCardComponent } from '../../components/user-card/user-card.component';
import { UserCreateComponent } from '../../components/user-create/user-create.component';
import { UsersFilterComponent } from '../../components/users-filter/users-filter.component';
import { PluralPipe } from '../../pipes/plural.pipe';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe, UserCardComponent, UserCreateComponent, UsersFilterComponent, PluralPipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UsersComponent implements OnInit {
  users$: Observable<IUser[]>;

  private _searchTerm$ = new BehaviorSubject<string>('');
  private userService = inject(UserService);

  filteredUsers$: Observable<IUser[]>;

  constructor() {
    this.users$ = this.userService.getUsers();

    this.filteredUsers$ = combineLatest([this.users$, this._searchTerm$]).pipe(
      map(([users, searchTerm]) => {
        if (!searchTerm) {
          return users;
        } else {
          return users.filter((user) => user.name.toLowerCase().includes(searchTerm));
        }
      }),
    );
  }

  ngOnInit(): void {
    this.userService.loadUsers().subscribe();
  }

  onDeleteUser(id: number): void {
    this.userService.deleteUser(id);
  }

  onCreateUser(user: IUser): void {
    this.userService.addUser(user);
  }

  onFilterChange(searchTerm: string) {
    this._searchTerm$.next(searchTerm);
  }
}
