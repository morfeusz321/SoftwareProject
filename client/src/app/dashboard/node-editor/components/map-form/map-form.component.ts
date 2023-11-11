import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { nodeIdValidator } from '@app/shared/validators/form-validators';
import { INode } from '@app/shared/interfaces/node/node.interface';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatOption } from '@angular/material/core';

/**
 * Component for editing the arguments form of a node
 */
@UntilDestroy()
@Component({
  selector: 'app-map-form',
  templateUrl: './map-form.component.html',
  styleUrls: ['./map-form.component.scss'],
})
export class MapFormComponent implements OnInit {
  @Input() formGroupName: string;

  mapForm: FormGroup;
  nodes: INode[];
  selectedNode: INode;
  @ViewChildren(MatOption) options: QueryList<MatOption>;
  nodesWithoutSelectedNode: INode[];

  /**
   * Constructor for the map form component
   * @param fb - form builder
   * @param rootFormGroup - root form group
   * @param graphEditorFacade - graph editor facade
   */
  constructor(
    private fb: FormBuilder,
    private rootFormGroup: FormGroupDirective,
    private graphEditorFacade: GraphEditorFacade
  ) {}

  /**
   * Function to initialize the component with the correct form
   */
  ngOnInit(): void {
    this.graphEditorFacade.nodes$.pipe(untilDestroyed(this)).subscribe((nodes) => {
      this.nodes = nodes;
    });
    this.graphEditorFacade.selectedNode$.pipe(untilDestroyed(this)).subscribe((node) => {
      this.selectedNode = node;
    });
    this.mapForm = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
  }

  /**
   * Function to filter the nodes in the select dropdown
   */
  filterNodes(): void {
    if (this.selectedNode) {
      this.nodesWithoutSelectedNode = this.nodes.filter((node) => node.id !== this.selectedNode.id);
    } else {
      throw new Error('No node selected');
    }
    this.options.forEach((option) => {
      option.setInactiveStyles();
    });
  }

  /**
   * Function to highlight a node in the graph
   * @param nodeId
   */
  highlightNode(nodeId: string): void {
    this.options.forEach((option) => {
      if (option.value === nodeId) {
        option.focus();
      } else {
        option.setInactiveStyles(); // Remove focus styles from other options
      }
    });
    this.graphEditorFacade.highlightNode(nodeId);
  }

  /**
   * Function to clear the highlighted node in the graph
   */
  clearHighlighted(): void {
    this.graphEditorFacade.clearHighlighted();
  }
}
