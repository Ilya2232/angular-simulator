import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { IUser } from '../../../interfaces/IUser';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UsersComponent implements OnInit {
  public users$: Observable<IUser[]>;

  constructor(private userService: UserService) {
    this.users$ = this.userService.getUsers();
  }

  public ngOnInit(): void {
    this.userService.loadUsers().subscribe();
  }
}