import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {SharedModule} from "@app/shared/shared.module";

import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {DashboardModule} from "./dashboard/dashboard.module";
import {RouterModule} from "@angular/router";

import {CoreModule} from "@app/dashboard/core/core.module";
import {ToastrModule, ToastrService} from "ngx-toastr";
import { HttpClientModule } from '@angular/common/http';
import { TranslocoRootModule } from './transloco-root.module';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    AppRoutingModule,
    NoopAnimationsModule,
    DashboardModule,
    RouterModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    TranslocoRootModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private toastr: ToastrService) {
    this.toastr.toastrConfig.positionClass = 'toast-bottom-left';
    this.toastr.toastrConfig.closeButton = true;
    this.toastr.toastrConfig.progressBar = true;
    this.toastr.toastrConfig.timeOut = 2000;
  }
}
