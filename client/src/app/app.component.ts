import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import { ToastrService } from 'ngx-toastr';
import { GraphListFacade } from '@app/dashboard/core/state/graph-list-store/graph-list.facade';
import { ThemeService } from '@app/shared/services/theme-service/theme.service';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
@UntilDestroy()
export class AppComponent implements OnInit {
  isDarkTheme: Observable<boolean>;
  title = 'client';

  constructor(
    private graphEditorFacade: GraphEditorFacade,
    private graphListFacade: GraphListFacade,
    private messages: ToastrService,
    private themeService: ThemeService,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    this.graphEditorFacade.error$.pipe(untilDestroyed(this)).subscribe((error) => {
      if (error != '') {
        this.messages.error(error, this.transloco.translate('messages.errors.error'));
        this.graphEditorFacade.resetError('');
      }
    });
    this.graphListFacade.error$.pipe(untilDestroyed(this)).subscribe((error) => {
      if (error != '') {
        this.messages.error(error, this.transloco.translate('messages.errors.error'));
        this.graphListFacade.resetError('');
      }
    });
    this.isDarkTheme = this.themeService.isAccessibleMode;
  }
}
