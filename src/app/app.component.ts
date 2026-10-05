import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MessageComponent } from './components/message/message.component';
import { LoaderComponent } from './components/loader/loader.component';
import { StorageService } from '../interfaces/localStorage.service';
import { ColorMode } from '../enums/theme.enum';
import { AppTheme } from '../enums/theme.enum';
import { ThemeService } from './services/theme.service';
import { usePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import Lara from '@primeuix/themes/lara';
import Nora from '@primeuix/themes/nora';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, MessageComponent, LoaderComponent, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  isLoading: boolean = true;

  private readonly presets = {
    [AppTheme.AURA]: Aura,
    [AppTheme.LARA]: Lara,
    [AppTheme.NORA]: Nora
  }

  constructor(
    private storageService: StorageService,
    private library: FaIconLibrary,
    private themeService: ThemeService
  ) {
    this.library.addIconPacks(fas, far, fab);

    this.saveLastVisit();
    this.saveNumberOfVisits();

    this.themeService.colorMode$.subscribe((mode) => {
      this.applyColorMode(mode);
    });

    this.themeService.theme$.subscribe((theme) => {
      this.applyTheme(theme);
    });
  }

  public ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  private applyColorMode(mode: ColorMode): void {
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(mode === ColorMode.DARK ? 'dark-mode' : 'light-mode');
  }

  private applyTheme(theme: AppTheme): void {
    usePreset(this.presets[theme]);
    document.body.classList.remove('theme-aura', 'theme-lara', 'theme-nora');
    document.body.classList.add(`theme-${theme.toLowerCase()}`);
  }

  private saveLastVisit(): void {
    const date = new Date().toString();
    this.storageService.setItem<string>('lastVisit', date);
  }

  private saveNumberOfVisits(): void {
    const visits = this.storageService.getItem<number>('visits') || 0;
    this.storageService.setItem<number>('visits', visits + 1);
  }
}