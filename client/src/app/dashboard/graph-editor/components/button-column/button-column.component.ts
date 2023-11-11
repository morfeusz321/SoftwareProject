import { Component, Input } from '@angular/core';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';

/**
 * Component for button column in the menu
 */
@Component({
  selector: 'app-button-column',
  templateUrl: './button-column.component.html',
  styleUrls: ['./button-column.component.scss'],
})
export class ButtonColumnComponent {
  /**
   * Constructor
   * @param graphEditorFacade - facade for graph editor
   */
  constructor(private graphEditorFacade: GraphEditorFacade) {}
  @Input() name: string;
  @Input() isActive: boolean;

  /**
   * Function to save the graph
   */
  saveGraph(): void {
    this.graphEditorFacade.updateIsDraft(false);
    this.graphEditorFacade.updateName(this.name);
    this.graphEditorFacade.updateIsActive(this.isActive);
    this.graphEditorFacade.saveGraph();
  }
}
