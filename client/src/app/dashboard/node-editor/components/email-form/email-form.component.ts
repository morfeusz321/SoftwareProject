import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { INode } from '@app/shared/interfaces/node/node.interface';
import { MatOption } from '@angular/material/core';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import { nodeIdValidator } from '@app/shared/validators/form-validators';

/**
 * Component for the email form
 */
@UntilDestroy()
@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.scss'],
})
export class EmailFormComponent implements OnInit {
  @Input() formGroupName: string;

  emailForm: FormGroup;
  nodes: INode[];
  selectedNode: INode;
  @ViewChildren(MatOption) options: QueryList<MatOption>;
  nodesWithoutSelectedNode: INode[];

  /**
   * Constructor for the email form component
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
    this.emailForm = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.filterNodes();
  }

  /**
   * Getter for the arguments form array
   * @returns the arguments form array
   */
  arguments(): FormArray {
    return this.emailForm.get('arguments') as FormArray;
  }

  /**
   * Function to create a new argument form
   * @returns the new argument form
   */
  newArgument(): FormGroup {
    return this.fb.group({
      alias: new FormControl('', Validators.required),
      parentId: new FormControl('', [Validators.required, nodeIdValidator(this.graphEditorFacade)]),
      field: new FormControl('', Validators.required),
    });
  }

  /**
   * Function to filter the nodes in the select dropdown
   * @throws Error if no node is selected
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
   * @param nodeId - the id of the node to highlight
   */
  highlightNode(nodeId: string): void {
    this.options.forEach((option) => {
      option.setInactiveStyles(); // Remove focus styles from other options
    });
    this.graphEditorFacade.highlightNode(nodeId);
  }

  /**
   * Function to clear the highlighted node in the graph
   */
  clearHighlighted(): void {
    this.graphEditorFacade.clearHighlighted();
  }

  /**
   * Function to compare two nodes
   * @param n1 - the first node
   * @param n2 - the second node
   * @returns true if the nodes are equal, false otherwise
   */
  compareNodes(n1: INode, n2: INode) {
    if (n1 && n2) {
      return n1.id === n2.id;
    }
    return false;
  }
}
