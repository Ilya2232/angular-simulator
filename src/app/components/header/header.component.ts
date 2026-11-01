import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ThemeService } from '../../services/theme.service';
import { AppTheme, ColorMode } from '../../../enums/theme.enum';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AuthService } from '../../features/auth/services/auth.service';
import { inject } from '@angular/core';

interface INavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule,
    ToggleSwitch,
    AsyncPipe,
    FormsModule,
    SelectButtonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);

  navLinks: INavLink[] = [
    { label: 'Главная', path: '/' },
    { label: 'Пользователи', path: '/users' },
    { label: 'Посты', path: '/posts' },
  ];

  ColorMode = ColorMode;
  AppTheme = AppTheme;
  private auth = inject(AuthService);
  user$ = this.auth.user$;

  themeOptions = [
    { label: 'Aura', value: AppTheme.AURA },
    { label: 'Nora', value: AppTheme.NORA },
    { label: 'Lara', value: AppTheme.LARA },
  ];

  colorMode$: Observable<ColorMode>;
  theme$: Observable<AppTheme>;

  constructor() {
    this.colorMode$ = this.themeService.colorMode$;
    this.theme$ = this.themeService.theme$;
  }

  currentDateTime = '';
  clickCount = 0;
  taskFour = true;
  clockIntervalId: ReturnType<typeof setInterval> | null = null;

  onToggleColorMode(): void {
    this.themeService.toggleColorMode();
  }

  onSetTheme(theme: AppTheme): void {
    this.themeService.setTheme(theme);
  }

  onLogout(): void {
    this.auth.logout();
  }

  ngOnInit(): void {
    this.startClock();
  }

  ngOnDestroy(): void {
    if (this.clockIntervalId) {
      clearInterval(this.clockIntervalId);
    }
  }

  private startClock(): void {
    this.currentDateTime = new Date().toLocaleString('ru-RU');
    this.clockIntervalId = setInterval(() => {
      this.currentDateTime = new Date().toLocaleString('ru-RU');
    }, 1000);
  }

  increment(): void {
    this.clickCount += 1;
  }

  decrement(): void {
    if (this.clickCount > 0) {
      this.clickCount -= 1;
    }
  }

  toggleTask(): void {
    this.taskFour = !this.taskFour;
  }
}
