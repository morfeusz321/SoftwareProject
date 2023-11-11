import {NgModule} from "@angular/core";
import {HttpClientModule} from "@angular/common/http";
import { FormCardComponent } from '@app/shared/components/form-card/form-card.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoRootModule } from '@app/transloco-root.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoaderComponent } from '@app/shared/components/loader/loader.component';
@NgModule({
  declarations: [
    FormCardComponent,
    LoaderComponent
  ],
  imports: [HttpClientModule, MatExpansionModule, MatIconModule, TranslocoRootModule, MatTooltipModule],
  exports: [FormCardComponent, LoaderComponent],
  providers: [],
})
export class SharedModule { }
