import { Component, ViewChild } from '@angular/core';
import { MenuLinkConfig } from '@app/shared/constants/menu-link-config';
import { MatSidenav } from '@angular/material/sidenav';

/**
 * Component for the side menu
 */
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent {
  @ViewChild('sidenav') sidenav: MatSidenav;

  protected readonly ROUTES = MenuLinkConfig;

  /**
   * Toggles the side menu
   */
  toggleMenu(): void {
    this.sidenav.toggle();
  }
}
