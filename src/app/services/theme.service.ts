import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from '../../interfaces/localStorage.service';
import { ColorMode, AppTheme } from '../../enums/theme.enum';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly COLOR_MODE_KEY = 'colorMode';
  private readonly THEME_KEY = 'theme';

  private readonly DEFAULT_COLOR_MODE = ColorMode.LIGHT;
  private readonly DEFAULT_THEME = AppTheme.AURA;

  private _colorMode$: BehaviorSubject<ColorMode>;
  private _theme$: BehaviorSubject<AppTheme>;

  public colorMode$: Observable<ColorMode>;
  public theme$: Observable<AppTheme>;

  constructor(private storageService: StorageService) {
    this._colorMode$ = new BehaviorSubject<ColorMode>(this.getInitialColorMode());
    this._theme$ = new BehaviorSubject<AppTheme>(this.getInitialTheme());

    this.colorMode$ = this._colorMode$.asObservable();
    this.theme$ = this._theme$.asObservable();
  }

  private getInitialColorMode(): ColorMode {
    const storedColor = this.storageService.getItem<ColorMode>(this.COLOR_MODE_KEY);
    if (storedColor) {
      return storedColor;
    } else {
      return this.DEFAULT_COLOR_MODE;
    }
  }

  private getInitialTheme(): AppTheme {
    const storedTheme = this.storageService.getItem<AppTheme>(this.THEME_KEY);
    if (storedTheme) {
      return storedTheme;
    } else {
      return this.DEFAULT_THEME;
    }
  }

  public setColorMode(mode: ColorMode): void {
    this._colorMode$.next(mode);
    this.storageService.setItem<ColorMode>(this.COLOR_MODE_KEY, mode);
  }

  public setTheme(theme: AppTheme): void {
    this._theme$.next(theme);
    this.storageService.setItem<AppTheme>(this.THEME_KEY, theme);
  }

  public toggleColorMode(): void {
    const currentMode = this._colorMode$.value;
    const newMode = currentMode === ColorMode.LIGHT ? ColorMode.DARK : ColorMode.LIGHT;
    this.setColorMode(newMode);
  }
}