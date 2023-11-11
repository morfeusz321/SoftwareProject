import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ActivatedRoute } from '@angular/router';
import { FormDropListComponent } from '@app/dashboard/node-editor/components/form-drop-list/form-drop-list.component';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@ngneat/transloco';

/**
 * Component for the node edit menu
 */
@UntilDestroy()
@Component({
  selector: 'app-node-edit-menu',
  templateUrl: './node-edit-menu.component.html',
  styleUrls: ['./node-edit-menu.component.scss'],
})
export class NodeEditMenuComponent implements OnInit {
  opened: boolean = false;
  newGraph: boolean;
  isDirty: boolean;
  changesWarning: boolean;
  isLoading$ = this.graphEditorFacade.isLoading$;
  @ViewChild(FormDropListComponent) formDropList: FormDropListComponent;

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    if (this.isDirty) event.returnValue = true;
  }

  /**
   * Constructor for the node edit menu component
   * @param graphEditorFacade - graph editor facade
   * @param route - route
   * @param messages - toastr service
   * @param cdr - change detector ref
   * @param transloco - transloco service
   */
  constructor(
    private graphEditorFacade: GraphEditorFacade,
    private route: ActivatedRoute,
    private messages: ToastrService,
    private cdr: ChangeDetectorRef,
    private transloco: TranslocoService
  ) {}

  /**
   * Function to initialize the component with the selected node
   */
  ngOnInit(): void {
    this.route.params.pipe(untilDestroyed(this)).subscribe((params) => {
      if (params['id']) {
        this.graphEditorFacade.updateIsLoading(true);
        this.graphEditorFacade.loadGraph(params['id']);
        this.newGraph = false;
      } else {
        this.newGraph = true;
      }
    });
    this.graphEditorFacade.selectedNode$.pipe(untilDestroyed(this)).subscribe((node) => {
      this.opened = node !== null;
      this.changesWarning = false;
    });
    this.graphEditorFacade.isDirty$.pipe(untilDestroyed(this)).subscribe((isDirty) => {
      this.isDirty = isDirty;
    });
  }

  /**
   * Function to deselect currently selected node
   */
  deselectNode(): void {
    this.graphEditorFacade.deselectNode();
  }

  /**
   * Function to save the graph
   */
  handleBackdropClick(): void {
    if (this.formDropList.isDirty() && !this.changesWarning) {
      this.messages.warning(
        this.transloco.translate('messages.warnings.changes'),
        this.transloco.translate('messages.warnings.warning')
      );
      this.changesWarning = true;
    } else {
      this.changesWarning = false;
    }
    this.cdr.detectChanges();
  }
}
