import { Component, HostBinding, Input } from '@angular/core';
import { NodeConfig } from '@app/shared/configs/node-menu.config';

/**
 * Component to display a node in the menu
 */
@Component({
  selector: 'app-menu-node',
  templateUrl: './menu-node.component.html',
  styleUrls: ['./menu-node.component.scss'],
})
export class MenuNodeComponent {
  @Input()
  menuNode: NodeConfig;

  @Input()
  disabled: boolean;

  @HostBinding('class') get class() {
    return `menu-node--${this.menuNode.method.toString().toLowerCase()}`;
  }

  @HostBinding('class.menu-node--disabled') get disabledClass() {
    return this.disabled;
  }
}
