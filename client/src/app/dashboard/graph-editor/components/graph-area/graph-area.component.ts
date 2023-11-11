import {
  AfterViewInit,
  Component,
  NgZone,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import { ICoordinates } from '@app/shared/interfaces/coordinates/coordinates.interface';
import { INode } from '@app/shared/interfaces/node/node.interface';
import { NodeConfig } from '@app/shared/configs/node-menu.config';
import { BasicNodeComponent } from '@app/dashboard/graph-editor/components/basic-node/basic-node.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, take } from 'rxjs';
import { ConditionalTypeEnum } from '@app/shared/enums/conditional-type.enum';
import { ToastrService } from 'ngx-toastr';
import { LeaderLineService } from '@app/shared/services/leader-line-service/leader-line.service';
import { TranslocoService } from '@ngneat/transloco';

export interface Edge {
  from: string;
  to: string;
}

/**
 * Component used to display the graph builder area
 */
@UntilDestroy()
@Component({
  selector: 'app-graph-area',
  templateUrl: './graph-area.component.html',
  styleUrls: ['./graph-area.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GraphAreaComponent implements AfterViewInit {
  readonly triggerNodeType = ConditionalTypeEnum.TRIGGER;

  @ViewChild('graphDiv', { read: ViewContainerRef }) graphDiv!: ViewContainerRef;
  @ViewChildren(BasicNodeComponent) nodeComponents: QueryList<BasicNodeComponent>;

  nodes$ = this.graphEditorFacade.nodes$;
  edges$ = this.graphEditorFacade.edges$;
  highlightedNode$ = this.graphEditorFacade.highlighted$;

  private nodeWidth = 140;
  private nodeHeight = 100;

  linkLines: any[] = [];
  drag = false;
  lastNode: INode;

  selectedSourceNode: string | null = null;
  selectedTargetNode: string | null = null;

  /**
   * Constructor for the graph area component
   * @param graphEditorFacade - facade for the graph editor
   * @param basicNode  - basic node component
   * @param zone - zone
   * @param messages - toastr service
   * @param leaderLineService - leader line service
   * @param transloco - transloco service
   */
  constructor(
    private graphEditorFacade: GraphEditorFacade,
    private basicNode: BasicNodeComponent,
    private zone: NgZone,
    private messages: ToastrService,
    private leaderLineService: LeaderLineService,
    private transloco: TranslocoService
  ) {}

  /**
   * Function to add the edge to the graph area
   * @param edge - the edge to add
   */
  addEdge(edge: Edge): void {
    const fromNode = this.nodeComponents.find((node) => node.node.id === edge.from);
    const toNode = this.nodeComponents.find((node) => node.node.id === edge.to);
    if (fromNode && toNode) {
      const line = this.leaderLineService.createLeaderLine(fromNode.nodeContainer, toNode.nodeContainer);
      this.linkLines.push(line);
    }
  }

  /**
   * Function to create a node in the graph area
   * @param x - the x position of the mouse
   * @param y - the y position of the mouse
   * @param nodeConfig - the node config to create the node with
   */
  createNode(x: number, y: number, nodeConfig: NodeConfig): void {
    const graphBounds = this.graphDiv.element.nativeElement.getBoundingClientRect();
    if (
      x - this.nodeWidth >= graphBounds.left &&
      x + this.nodeWidth <= graphBounds.right &&
      y - this.nodeHeight >= graphBounds.top &&
      y + this.nodeHeight <= graphBounds.bottom
    ) {
      const position: ICoordinates = {
        positionX: Math.ceil(x - graphBounds.left - this.basicNode.getX()),
        positionY: Math.ceil(y - graphBounds.top - this.basicNode.getY()),
        positionZ: 0,
      };
      this.graphEditorFacade.addNode(nodeConfig, position);
    }
  }

  /**
   * Function to update position with the div's left, top, bottom, right coordinates.
   * we don't need to check if it is inbounds because of the drag bounds in html
   * @param id - the id of the node to update
   */
  updatePos(id: string): void {
    this.drag = false;
    const graphBounds = this.graphDiv.element.nativeElement.getBoundingClientRect();
    const nodeBounds = document.getElementById(id.toString())?.getBoundingClientRect();
    if (nodeBounds!) {
      this.graphEditorFacade.updateNodePosition(id, {
        positionX: Math.ceil(nodeBounds.x - graphBounds.x),
        positionY: Math.ceil(nodeBounds.y - graphBounds.y),
        positionZ: 0,
      });
    }
    this.updateEdgePositions();
  }

  /**
   * Function to select a node
   * @param id - the id of the node to select
   */
  selectNode(id: string): void {
    this.graphEditorFacade.selectNode(id);
  }

  /**
   * Function to update the edge positions, move the svg lines form the body to the graph area and reposition them
   */
  updateEdgePositions(): void {
    this.resetEdges();
    this.edges$.pipe(take(1)).subscribe((edges) => {
      edges.forEach((edge) => {
        this.addEdge(edge);
      });
    });
    document.querySelectorAll('.leader-line').forEach((line) => {
      this.graphDiv.element.nativeElement.appendChild(line);
    });
    this.repositionEdges();
  }

  /**
   * Function to reposition the edges using the graph area's bounds
   */
  repositionEdges(): void {
    const graphBounds = this.graphDiv?.element.nativeElement.getBoundingClientRect();
    this.zone.runOutsideAngular(() => {
      document.querySelectorAll('.leader-line').forEach((line) => {
        (line as HTMLElement).style.setProperty(
          'left',
          `${parseFloat((line as HTMLElement).style.left) - graphBounds.x}px`
        );
        (line as HTMLElement).style.setProperty(
          'top',
          `${parseFloat((line as HTMLElement).style.top) - graphBounds.y}px`
        );
      });
    });
  }

  /**
   * Function to select a node to connect
   * @param id - the id of the node to connect
   * @param isTriggerNode - whether the node is a trigger node or not
   */
  selectNodeToConnect(id: string, isTriggerNode: boolean): void {
    if (this.selectedSourceNode === id) {
      this.selectedSourceNode = null;
      return;
    }
    if (!this.selectedSourceNode) {
      this.selectedSourceNode = id;
    } else if (!this.selectedTargetNode) {
      if (isTriggerNode) {
        this.messages.error(
          this.transloco.translate('messages.errors.cannotConnectToSchedule'),
          this.transloco.translate('messages.errors.error')
        );
        return;
      }
      this.selectedTargetNode = id;
      this.edges$.pipe(take(1)).subscribe((edges) => {
        const existingEdge = edges.find((ed) => ed.from == this.selectedSourceNode && ed.to == this.selectedTargetNode);
        if (existingEdge) {
          this.graphEditorFacade.disconnectNodes(this.selectedSourceNode, this.selectedTargetNode);
        } else {
          this.graphEditorFacade.connectNodes(this.selectedSourceNode, this.selectedTargetNode);
        }
      });
      this.selectedSourceNode = null;
      this.selectedTargetNode = null;
    }
  }

  /**
   * Function to reset the edges
   */
  resetEdges(): void {
    this.linkLines = [];

    this.zone.runOutsideAngular(() => {
      document.querySelectorAll('.leader-line').forEach((line) => line.parentNode.removeChild(line));
    });
  }

  /**
   * Function to trigger the drag of a node
   * @param node - the node that is being dragged
   */
  triggerDrag(node: INode): void {
    this.lastNode = node;
    this.drag = true;
  }

  /**
   * Function to delete a node
   * @param nodeId
   */
  deleteNode(nodeId: string): void {
    this.graphEditorFacade.removeNode(nodeId);
    this.graphEditorFacade.deselectNode();
    this.messages.success('Node deleted successfully', 'Success');
  }

  /**
   * Function initialize component after viewed
   */
  ngAfterViewInit(): void {
    this.edges$
      .pipe(
        untilDestroyed(this),
        filter((edges) => !!edges)
      )
      .subscribe((edges) => {
        this.resetEdges();
        edges.forEach((edge) => {
          this.addEdge(edge);
        });
        document.querySelectorAll('.leader-line').forEach((line) => {
          document.getElementsByClassName('graph-area')[0].appendChild(line);
        });
        this.repositionEdges();
      });
  }
}
