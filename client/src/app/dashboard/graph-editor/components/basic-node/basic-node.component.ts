import { Component, ElementRef, EventEmitter, HostBinding, Input, Output, ViewChild } from '@angular/core';
import { IActionNode, INode } from '@app/shared/interfaces/node/node.interface';
import { ConditionalTypeEnum } from '@app/shared/enums/conditional-type.enum';
import { TranslocoService } from '@ngneat/transloco';
import { ToastrService } from 'ngx-toastr';
import { MethodsEnum } from '@app/shared/enums/methods.enum';
import { take } from 'rxjs';
import { HttpResponseDialogComponent } from '@app/dashboard/node-editor/components/http-response-dialog/http-response-dialog.component';
import { ApiGraphExecutionService } from '@app/dashboard/graph-execution/services/graph-list-api-service/graph-execution-api-service';
import { MatDialog } from '@angular/material/dialog';

/**
 * Component for displaying a node in the builder
 */
@Component({
  selector: 'app-basic-node',
  templateUrl: './basic-node.component.html',
  styleUrls: ['./basic-node.component.scss'],
})
export class BasicNodeComponent {
  readonly triggerNodeType = ConditionalTypeEnum.TRIGGER;
  protected readonly MethodsEnum = MethodsEnum;
  @Input() node: INode;
  @Input() selectedAsSource: boolean = false;
  @Input() shadowNode: boolean = false;
  @Input() highlighted: boolean = false;

  @Output() deleteNode = new EventEmitter<string>();
  @Output() editNode = new EventEmitter<string>();
  @Output() selectNode = new EventEmitter<string>();

  @ViewChild('nodeContainer') nodeContainer: ElementRef;

  @HostBinding('class') get class() {
    if (!this.node && !this.shadowNode) return '';
    if (this.shadowNode) return 'basic-node--shadow';

    return {
      [`basic-node--${this.node.type.toString().toLowerCase()}`]: true,
      'basic-node--selected': this.selectedAsSource || this.highlighted,
    };
  }

  private xPressed: number;
  private yPressed: number;

  constructor(
    public transloco: TranslocoService,
    private messages: ToastrService,
    private executionService: ApiGraphExecutionService,
    private dialog: MatDialog
  ) {}

  /**
   * Function to offset the node position when dragging by the position of the mouse on the node
   * @param event - the event that triggered the drag
   */
  dragStart(event: any): void {
    const rect = event.target.getBoundingClientRect();
    this.xPressed = event.clientX - rect.left;
    this.yPressed = event.clientY - rect.top;
  }

  /**
   * Function to get the x position of the mouse on the node
   */
  getX(): number {
    return this.xPressed;
  }

  /**
   * Function to get the y position of the mouse on the node
   */
  getY(): number {
    return this.yPressed;
  }

  /**
   * Function to emit edit event
   */
  editNodeClicked(): void {
    this.editNode.emit(this.node.id);
  }

  /**
   * Function to emit delete event
   */
  deleteNodeClicked(): void {
    this.deleteNode.emit(this.node.id);
  }

  /**
   * Function to emit select event
   */
  selectNodeClicked(): void {
    this.selectNode.emit(this.node.id);
  }

  /**
   * Function to execute the node request
   */
  executeNode(): void {
    if (!this.validateGetNode()) return;
    this.executionService
      .executeNode(this.node)
      .pipe(take(1))
      .subscribe(
        (response) => {
          this.dialog.open(HttpResponseDialogComponent, {
            data: {
              response: JSON.stringify(response, null, 2),
              title: this.transloco.translate('graphArea.nodes.messages.request-success'),
            },
          });
        },
        (error) => {
          const errorResponse = {
            status: error?.error?.status,
            detail: error?.error?.detail,
          };
          this.dialog.open(HttpResponseDialogComponent, {
            data: { response: JSON.stringify(errorResponse, null, 2), title: error?.error?.title },
          });
        }
      );
  }

  /**
   * Function to validate the node request
   */
  validateGetNode(): boolean {
    if (this.node.type !== MethodsEnum.GET) return false;
    const node = this.node as IActionNode;
    if (!node.request?.url) {
      this.messages.error(this.transloco.translate('graphArea.nodes.messages.noUrl'));
      return false;
    }
    return true;
  }
}
