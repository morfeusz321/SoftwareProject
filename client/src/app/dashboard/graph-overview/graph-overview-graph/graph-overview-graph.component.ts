import { Component, Input, OnInit } from '@angular/core';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';
import { GraphListFacade } from '@app/dashboard/core/state/graph-list-store/graph-list.facade';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogueWindowComponent } from '@app/dashboard/graph-overview/dialogue-window/dialogue-window-component';

/**
 * Component to display the graph in the overview
 */
@Component({
  selector: 'app-graph-overview-graph',
  templateUrl: './graph-overview-graph.component.html',
  styleUrls: ['./graph-overview-graph.component.scss'],
})
export class GraphOverviewGraphComponent implements OnInit {
  @Input() graph: IGraph;
  isActiveString: string;

  /**
   * Constructor
   * @param graphListFacade - Facade for the graph list store
   * @param router - Router
   * @param dialog - Dialog
   */
  constructor(private graphListFacade: GraphListFacade, private router: Router, private dialog: MatDialog) {}

  /**
   * Function to initialize the component
   */
  ngOnInit(): void {
    this.isActiveString = this.graph.isActive ? 'graphs.enabled' : 'graphs.disabled';
  }

  /**
   * Function to update the active state of the graph
   */
  updateActive(): void {
    this.graphListFacade.updateGraph({ id: this.graph.id, isActive: !this.graph.isActive } as IGraph);
  }

  /**
   * Function to navigate to the builder to edit the graph
   */
  editGraph(): void {
    this.router.navigate(['/builder', { id: this.graph.id }]);
  }

  /**
   * Function to delete the graph
   */
  deletePopOut(): void {
    this.dialog
      .open(DialogueWindowComponent, {
        data: {
          title: 'deleteTitle',
          messageOnConfirm: 'delete',
          messageOnCancel: 'cancel',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.graphListFacade.deleteGraph(this.graph.id);
        } else {
          this.dialog.closeAll();
        }
      });
  }

  /**
   * Function to rename the graph
   */
  renameGraph(): void {
    this.dialog
      .open(DialogueWindowComponent, {
        data: {
          title: 'renameTitle',
          messageOnConfirm: 'rename',
          messageOnCancel: 'cancel',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.graphListFacade.updateGraph({ id: this.graph.id, name: result } as IGraph);
        } else {
          this.dialog.closeAll();
        }
      });
  }
}
