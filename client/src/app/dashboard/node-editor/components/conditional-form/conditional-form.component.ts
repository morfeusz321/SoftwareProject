import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ConditionTypeEnum } from '@app/shared/enums/condition-type.enum';
import { GraphEditorFacade } from '@app/dashboard/core/state/graph-editor-store/graph-editor.facade';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IConditionNode, INode } from '@app/shared/interfaces/node/node.interface';
import { MatOption } from '@angular/material/core';
import { ExecutionTimeEnum } from '@app/shared/enums/execution-time.enum';
import { DateTypeEnum } from '@app/shared/enums/date-type.enum';
import { ComparisonOptionsEnum } from '@app/shared/enums/comparison-options.enum';
import { MatDialog } from '@angular/material/dialog';
import { ImageDisplayComponent } from '@app/dashboard/node-editor/components/image-display/image-display.component';

/**
 * Component for editing the conditional form a node
 */
@UntilDestroy()
@Component({
  selector: 'app-conditional-form',
  templateUrl: './conditional-form.component.html',
  styleUrls: ['./conditional-form.component.scss'],
})
export class ConditionalFormComponent implements OnInit {
  readonly executionTime = ExecutionTimeEnum;
  readonly dateType = DateTypeEnum;
  readonly comparisonType = ComparisonOptionsEnum;
  @Input() formGroupName: string;
  @Input() index: number;
  @ViewChildren(MatOption) options: QueryList<MatOption>;
  nodesWithoutSelectedNode: INode[];
  nodes: INode[];
  selectedNode: INode;
  conditionForm: FormGroup;
  conditions = Object.values(ConditionTypeEnum);
  conditionalFormText = 'nodeEditor.conditionForm.';
  datePickerEnabled: boolean;
  compareToField: ComparisonOptionsEnum;

  /**
   * Constructor for the conditional form component
   * @param rootFormGroup - The root form group
   * @param graphEditorFacade - The graph editor facade
   * @param dialog - The dialog handler
   */
  constructor(
    private rootFormGroup: FormGroupDirective,
    private graphEditorFacade: GraphEditorFacade,
    public dialog: MatDialog
  ) {}

  /**
   * Function to initialize the component with the correct form
   */
  ngOnInit(): void {
    this.conditionForm = this.rootFormGroup.control.get(this.formGroupName) as FormGroup;
    this.graphEditorFacade.selectedNode$.pipe(untilDestroyed(this)).subscribe((node) => {
      this.selectedNode = node;
    });
    this.graphEditorFacade.nodes$.pipe(untilDestroyed(this)).subscribe((nodes) => {
      this.nodes = nodes;
    });
    this.conditionForm
      .get('secondFieldTimeDateType')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        this.showCalendar(value);
      });
    this.conditionForm
      .get('compareTo')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        this.compareToField = value;
        this.tabChange(value);
        this.showCalendar(this.conditionForm.get('secondFieldTimeDateType').value);
      });
    this.compareToField = (this.selectedNode as IConditionNode).expression.compareTo;
    this.showCalendar(this.conditionForm.get('secondFieldTimeDateType').value);
    this.filterNodes();
  }

  /**
   * Function to filter the nodes in the dropdown
   */
  filterNodes(): void {
    if (this.selectedNode) {
      this.nodesWithoutSelectedNode = this.nodes.filter((node) => node.id !== this.selectedNode.id);
    } else {
      throw new Error('No node selected');
    }
    this.options?.forEach((option) => {
      option.setInactiveStyles();
    });
  }

  /**
   * Function to highlight the node in the graph
   * @param nodeId - The id of the node to highlight
   */
  highlightNode(nodeId: string): void {
    this.options.forEach((option) => {
      option.setInactiveStyles(); // Remove focus styles from other options
    });
    this.graphEditorFacade.highlightNode(nodeId);
  }

  /**
   * Function to clear the highlighted node
   */
  clearHighlighted(): void {
    this.graphEditorFacade.clearHighlighted();
  }

  /**
   * Function to handle dialog changes
   * @param value - The tab option
   */
  tabChange(value: string): void {
    switch (value) {
      case ComparisonOptionsEnum.USER_VALUE:
        this.enableValueFromUser();
        break;
      case ComparisonOptionsEnum.NODE_VALUE:
        this.enableValueFromNode();
        break;
      case ComparisonOptionsEnum.TIME_VALUE:
        this.enableValueFromCalendar();
        break;
    }
  }

  /**
   * Function to disable user value option
   */
  disableUserValue(): void {
    this.conditionForm.get('secondFieldUserValue').disable();
  }

  /**
   * Function to enable user value option
   */
  enableUserValue(): void {
    this.conditionForm.get('secondFieldUserValue').enable();
  }

  /**
   * Function to disable node value option
   */
  disableNodeValue(): void {
    this.conditionForm.get('secondFieldNodeValue').disable();
    this.conditionForm.get('secondFieldNodeId').disable();
  }

  /**
   * Function to enable node value option
   */
  enableNodeValue(): void {
    this.conditionForm.get('secondFieldNodeValue').enable();
    this.conditionForm.get('secondFieldNodeId').enable();
  }

  /**
   * Function to disable calendar option
   */
  disableTimeValue(): void {
    this.conditionForm.get('secondFieldTimeDays').disable();
    this.conditionForm.get('secondFieldTimeMonths').disable();
    this.conditionForm.get('secondFieldTimeYears').disable();
    this.conditionForm.get('secondFieldTimeExecutionTime').disable();
    this.conditionForm.get('secondFieldTimeDateType').disable();
    this.conditionForm.get('secondFieldTimeDate').disable();
  }

  /**
   * Function to enable calendar option
   */
  enableTimeValue(): void {
    this.conditionForm.get('secondFieldTimeDays').enable();
    this.conditionForm.get('secondFieldTimeMonths').enable();
    this.conditionForm.get('secondFieldTimeYears').enable();
    this.conditionForm.get('secondFieldTimeExecutionTime').enable();
    this.conditionForm.get('secondFieldTimeDateType').enable();
    this.conditionForm.get('secondFieldTimeDate').enable();
  }

  /**
   * Function to enable node value option
   */
  enableValueFromNode(): void {
    this.disableTimeValue();
    this.disableUserValue();
    this.enableNodeValue();
  }

  /**
   * Function to enable user value option
   */
  enableValueFromUser(): void {
    this.disableTimeValue();
    this.disableNodeValue();
    this.enableUserValue();
  }

  enableValueFromCalendar(): void {
    this.disableUserValue();
    this.disableNodeValue();
    this.enableTimeValue();
  }

  /**
   * Function to compare two nodes
   * @param n1 - The first node
   * @param n2 - The second node
   * @returns - True if the nodes are the same, false otherwise
   */
  compareNodes(n1: INode, n2: INode): boolean {
    if (n1 && n2) {
      return n1.id === n2.id;
    }
    return false;
  }

  /**
   * Function to show the date tip
   */
  showTip(): void {
    this.dialog.open(ImageDisplayComponent, {
      data: { imagePath: 'assets/images/image.svg' },
      width: '500px',
      height: '160px',
    });
  }

  /**
   * Function to show the date picker
   * @param value - The type of condition
   */
  showCalendar(value: string): void {
    this.datePickerEnabled = false;
    if (value === this.dateType.EXECUTION_DATE) {
      this.conditionForm.get('secondFieldTimeDate').clearValidators();
      this.conditionForm.get('secondFieldTimeDate').setValidators(Validators.required);
      this.conditionForm.get('secondFieldTimeDate').setValue(this.dateType.EXECUTION_DATE);
    } else if (value === this.dateType.CUSTOM_DATE) {
      if (this.conditionForm.get('secondFieldTimeDate').value === this.dateType.EXECUTION_DATE) {
        this.conditionForm.get('secondFieldTimeDate').setValue(null);
      }
      this.datePickerEnabled = true;
    }
  }
}
