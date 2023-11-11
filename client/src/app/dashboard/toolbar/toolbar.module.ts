import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SideMenuComponent } from '@app/dashboard/toolbar/components/side-menu/side-menu.component';
import { ToolbarComponent } from '@app/dashboard/toolbar/components/toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgForOf, UpperCasePipe } from '@angular/common';
import { TranslocoModule } from '@ngneat/transloco';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [SideMenuComponent, ToolbarComponent],
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterOutlet,
    NgForOf,
    RouterLink,
    TranslocoModule,
    MatButtonToggleModule,
    UpperCasePipe,
    MatSlideToggleModule,
    AsyncPipe,
  ],
  exports: [SideMenuComponent, ToolbarComponent],
})
export class ToolbarModule {}
