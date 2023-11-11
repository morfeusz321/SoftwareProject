import { Component, OnInit } from '@angular/core';
import { GraphListFacade } from '@app/dashboard/core/state/graph-list-store/graph-list.facade';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Component to display the graph overview
 */
@Component({
  selector: 'app-graph-overview',
  templateUrl: './graph-overview.component.html',
  styleUrls: ['./graph-overview.component.scss'],
})
export class GraphOverviewComponent implements OnInit {
  graphs$: Observable<IGraph[]>;

  /**
   * Constructor
   * @param graphListFacade - Facade for the graph list store
   * @param router - Router
   */
  constructor(private graphListFacade: GraphListFacade, private router: Router) {}

  /**
   * Function to initialize the component
   */
  ngOnInit(): void {
    this.graphListFacade.loadGraphs();
    this.graphs$ = this.graphListFacade.graphs$;
  }

  /**
   * Function to navigate to the builder
   */
  newGraph(): void {
    this.router.navigate(['/builder']);
  }
}
