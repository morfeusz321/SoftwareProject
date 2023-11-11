import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICustomNode } from '@app/shared/interfaces/node/node.interface';

/**
 * Component to display the custom menu node
 */
@Component({
  selector: 'app-custom-menu-node',
  templateUrl: './custom-menu-node.component.html',
  styleUrls: ['./custom-menu-node.component.scss'],
})
export class CustomMenuNodeComponent {
  @Output()
  editNode: EventEmitter<ICustomNode> = new EventEmitter<ICustomNode>();

  @Output()
  deleteNode: EventEmitter<number> = new EventEmitter<number>();

  @Input()
  customNode: ICustomNode;

  constructor() {}

  /**
   * Emit the edit node event
   */
  emitEditNode(): void {
    this.editNode.emit(this.customNode);
  }

  /**
   * Emit the delete node event
   */
  emitDeleteNode(): void {
    this.deleteNode.emit(this.customNode.id);
  }
}
