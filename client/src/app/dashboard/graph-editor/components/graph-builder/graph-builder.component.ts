import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { GraphAreaComponent } from '@app/dashboard/graph-editor/components/graph-area/graph-area.component';
import { NodeConfig, NodeMenuConfig } from '@app/shared/configs/node-menu.config';
import { BasicNodeComponent } from '@app/dashboard/graph-editor/components/basic-node/basic-node.component';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { InsocialMethodsEnum, MethodsEnum } from '@app/shared/enums/methods.enum';
import { ConditionalTypeEnum } from '@app/shared/enums/conditional-type.enum';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';
import { ApiCustomNodeService } from '@app/dashboard/graph-editor/services/custom-node-api-service/custom-node-api.service';
import { IActionNode, ICustomNode } from '@app/shared/interfaces/node/node.interface';
import { MatDialog } from '@angular/material/dialog';
import { CreateNewCustomNodeDialogComponent } from '@app/dashboard/node-editor/components/new-node-dialog/create-new-custom-node-dialog.component';
import { IRequest } from '@app/shared/interfaces/request/request.interface';
import { ICoordinates } from '@app/shared/interfaces/coordinates/coordinates.interface';
import { UuidService } from '@app/shared/services/uuid-generator/uuid.service';
import { take } from 'rxjs';
import { AuthenticationTypeEnum } from '@app/shared/enums/authentication-type.enum';
import { IAuthentication } from '@app/shared/interfaces/auth/authentication.interface';
import { ToastrService } from 'ngx-toastr';
import { GraphExecutionAreaComponent } from '@app/dashboard/graph-editor/components/graph-execution-area/graph-execution-area.component';

/**
 * Component for the graph builder
 */
@UntilDestroy()
@Component({
  selector: 'app-graph-builder',
  templateUrl: './graph-builder.component.html',
  styleUrls: ['./graph-builder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphBuilderComponent implements OnInit {
  //possibly change to enum in the future
  readonly actionNodeConfig = NodeMenuConfig.filter((value) => value.method in MethodsEnum);
  readonly conditionalNodeConfig = NodeMenuConfig.filter((value) => value.method in ConditionalTypeEnum);
  readonly insocialNodeConfig = NodeMenuConfig.filter((value) => value.method in InsocialMethodsEnum);
  readonly nodeMenuConfig = NodeMenuConfig.filter((value) => value.method != ConditionalTypeEnum.TRIGGER);
  @ViewChild(GraphAreaComponent) graphArea: GraphAreaComponent;
  @ViewChild(GraphExecutionAreaComponent) graphExecutionArea: GraphExecutionAreaComponent;
  graph: IGraph;
  executionExpanded: boolean = false;
  loading: boolean;

  customNodes: ICustomNode[];

  /**
   * Constructor for the graph builder
   * @param graphEditorFacade - facade for the graph editor
   * @param basicNode - basic node component
   * @param customNodesService - service for the custom nodes
   * @param dialog - dialog for the custom nodes
   * @param uuid - uuid service
   * @param cdRef - change detector reference
   * @param messages - toastr service
   */
  constructor(
    private graphEditorFacade: GraphEditorFacade,
    private basicNode: BasicNodeComponent,
    private customNodesService: ApiCustomNodeService,
    public dialog: MatDialog,
    private uuid: UuidService,
    private cdRef: ChangeDetectorRef,
    private messages: ToastrService
  ) {}

  /**
   * Function to initialize the component
   */
  ngOnInit(): void {
    this.loading = true;
    this.customNodesService
      .getNodes()
      .pipe(untilDestroyed(this))
      .subscribe((nodes) => {
        this.customNodes = nodes;
        this.loading = false;
        this.cdRef.markForCheck();
      });
    this.graphEditorFacade.graph$.pipe(untilDestroyed(this)).subscribe((graph) => {
      this.graph = graph;
    });
  }

  /**
   * Function to create a node in the graph area
   * @param event - the event from the drop
   */
  drop(event: any): void {
    this.graphArea?.createNode(event.event.x, event.event.y, event.source.data as NodeConfig);
  }

  /**
   * Function to get the pressed action from the drag
   * @param event - the event from the drag
   */
  pressed(event: any): void {
    this.basicNode.dragStart(event);
  }

  /**
   *  Predicate function that doesn't allow items to be dropped into a list.
   *  @returns false
   * */
  noReturnPredicate(): boolean {
    return false;
  }

  dropCustom(event: any): void {
    const action = event.source.data.action as IActionNode;
    const config = { action, method: action.type } as NodeConfig;
    this.graphArea?.createNode(event.event.x, event.event.y, config);
  }

  /**
   * Function to open the dialog for the custom node
   * @param customNode - the custom node to open the dialog for
   */
  openDialog(customNode?: ICustomNode): void {
    const data = customNode
      ? customNode
      : ({
          action: {
            name: '',
            request: {
              body: '{}',
              url: '',
              method: MethodsEnum.GET,
              auth: {
                type: AuthenticationTypeEnum.NONE,
                token: '',
              } as IAuthentication,
            } as IRequest,
            arguments: [],
            id: this.uuid.generateUUID(),
            type: MethodsEnum.GET,
            position: {
              positionX: 0,
              positionY: 0,
              positionZ: 0,
            } as ICoordinates,
            neighbours: [],
          },
        } as ICustomNode);
    const dialogRef = this.dialog.open(CreateNewCustomNodeDialogComponent, {
      width: '400px',
      height: '600px',
      data,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && !customNode) {
        this.customNodesService
          .saveCustomNode(result)
          .pipe(take(1))
          .subscribe((res) => {
            this.customNodes = [...this.customNodes, res];
            this.messages.success('Node created successfully');
            this.cdRef.markForCheck();
          });
      } else if (result) {
        this.customNodesService
          .updateCustomNode(result)
          .pipe(take(1))
          .subscribe(() => {
            this.customNodes = [...this.customNodes.map((node) => (node.id === result.id ? result : node))];
            this.messages.success('Node updated successfully');
            this.cdRef.markForCheck();
          });
      }
    });
  }

  /**
   * Function to delete a custom node
   * @param $event - the id of the custom node to delete
   */
  deleteCustomNode($event: number): void {
    this.customNodesService
      .deleteNode($event)
      .pipe(take(1))
      .subscribe(() => {
        this.customNodes = this.customNodes.filter((node) => node.id !== $event);
        this.messages.success('Node deleted successfully');
        this.cdRef.markForCheck();
      });
  }

  /**
   * Function to handle the expanded changed event
   * @param $event - the event from the expanded changed
   */
  handleExpandedChanged($event: boolean): void {
    this.executionExpanded = $event;
  }
}
