import { Component, OnInit, ViewChild } from '@angular/core';
import { SideMenuComponent } from '@app/dashboard/toolbar/components/side-menu/side-menu.component';
import { environment } from '@env/environment';
import { TranslocoService } from '@ngneat/transloco';
import { Observable } from 'rxjs';
import { ThemeService } from '@app/shared/services/theme-service/theme.service';

/**
 * Component for the toolbar
 */
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  readonly languages = environment.languages;
  @ViewChild(SideMenuComponent) sidenav: SideMenuComponent;

  isAccessibleMode: Observable<boolean>;

  /**
   * Constructor for the toolbar component
   * @param translocoService - transloco service
   * @param themeService - theme service
   */
  constructor(private translocoService: TranslocoService, private themeService: ThemeService) {}

  /**
   * Function to initialize the component
   */
  ngOnInit(): void {
    this.isAccessibleMode = this.themeService.isAccessibleMode;
  }

  /**
   * Function to toggle the side menu
   */
  toggleMenu(): void {
    this.sidenav.toggleMenu();
  }

  /**
   * Function to toggle the accessible mode
   * @param checked - whether the accessible mode is checked
   */
  toggleAccessibleMode(checked: boolean): void {
    this.themeService.setAccessibleTheme(checked);
  }

  /**
   * Function to change the language
   * @param language - the language to change to
   */
  changeLang(language: string): void {
    this.translocoService.setActiveLang(language);
  }

  /**
   * Getter for the current language
   * @returns the current language
   */
  get currentLanguage(): string {
    return this.translocoService.getActiveLang();
  }
}
