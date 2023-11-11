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
  selector: 'app-arg-form',
  templateUrl: './arg-form.component.html',
  styleUrls: ['./arg-form.component.scss'],
})
export class ArgFormComponent implements OnInit {
  @Input() formGroupName: string;

  argForm: FormGroup;
  nodes: INode[];
  selectedNode: INode;
  @ViewChildren(MatOption) options: QueryList<MatOption>;
  nodesWithoutSelectedNode: INode[];

  public argFormText = 'nodeEditor.argForm.';

  /**
   * Constructor for the arg form component
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
    this.argForm = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
  }

  /**
   * Getter for the arguments form array
   * @returns arguments form array
   */
  arguments(): FormArray {
    return this.argForm.get('arguments') as FormArray;
  }

  /**
   * Function to create a new argument form
   * @returns new argument form
   */
  newArgument(): FormGroup {
    return this.fb.group({
      alias: new FormControl('', Validators.required),
      parentId: new FormControl('', [Validators.required, nodeIdValidator(this.graphEditorFacade)]),
      field: new FormControl('', Validators.required),
    });
  }

  /**
   * Function to add an argument to the form array
   */
  addArgument(): void {
    this.arguments().push(this.newArgument());
  }

  /**
   * Function to remove an argument from the form array
   * @param argIndex - index of the argument to remove
   */
  removeArgument(argIndex: number): void {
    this.arguments().removeAt(argIndex);
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
   * @param nodeId - id of the node to highlight
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
}
