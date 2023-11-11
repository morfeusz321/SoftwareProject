import { ConditionTypeEnum } from '@app/shared/enums/condition-type.enum';
import { ComparisonOptionsEnum } from '@app/shared/enums/comparison-options.enum';
import {ExecutionTimeEnum} from "@app/shared/enums/execution-time.enum";

export interface IExpression {
  firstFieldValue: string;
  firstFieldNodeId: string;
  // = / < / > / etc...
  comparisonType: ConditionTypeEnum;
  // User input / Node value
  compareTo: ComparisonOptionsEnum;
  // Value from the node
  secondFieldUserValue: string;
  // Value from the user
  secondFieldNodeValue: string;
  // Node id of the second value
  secondFieldNodeId: string;
  // How many days/months/years from the specified date
  secondFieldTimeDays: number;
  secondFieldTimeMonths: number;
  secondFieldTimeYears: number;
  // Date to compare to
  secondFieldTimeDate: string;
  // Before/ After/ exactly
  secondFieldTimeExecutionTime: ExecutionTimeEnum;
}

export interface IMapExpression {
  fieldName: string;
  parentNodeId: string;
  mappedFieldName: string;
}
