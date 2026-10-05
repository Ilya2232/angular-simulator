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

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, FontAwesomeModule, ToggleSwitch, AsyncPipe, FormsModule, SelectButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  navLinks: NavLink[] = [
    { label: 'Главная', path: '/' },
    { label: 'Пользователи', path: '/users' }
  ]
  public ColorMode = ColorMode;
  public AppTheme = AppTheme;

  public themeOptions = [
    { label: 'Aura', value: AppTheme.AURA },
    { label: 'Nora', value: AppTheme.NORA },
    { label: 'Lara', value: AppTheme.LARA }
  ]

  public colorMode$: Observable<ColorMode>;
  public theme$: Observable<AppTheme>;

  constructor(private themeService: ThemeService) {
    this.colorMode$ = this.themeService.colorMode$;
    this.theme$ = this.themeService.theme$;
  }

  currentDateTime: string = '';
  clickCount: number = 0;
  taskFour: boolean = true;
  clockIntervalId: any;

  public onToggleColorMode(): void {
    this.themeService.toggleColorMode();
  }

  public onSetTheme(theme: AppTheme): void {
    this.themeService.setTheme(theme);
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

  public increment(): void {
    this.clickCount += 1;
  }

  public decrement(): void {
    if (this.clickCount > 0) {
      this.clickCount -= 1;
    }
  }

  public toggleTask(): void {
    this.taskFour = !this.taskFour;
  }
}