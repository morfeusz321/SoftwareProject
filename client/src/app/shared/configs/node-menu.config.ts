import { ConditionalTypeEnum } from '@app/shared/enums/conditional-type.enum';
import { InsocialMethodsEnum, MethodsEnum } from '@app/shared/enums/methods.enum';
import { IActionNode } from '@app/shared/interfaces/node/node.interface';

export interface NodeConfig {
  method: ConditionalTypeEnum | MethodsEnum | InsocialMethodsEnum;
  limit?: number;
  action?: IActionNode;
}

export const NodeMenuConfig: NodeConfig[] = [
  {
    method: MethodsEnum.POST,
  },
  {
    method: MethodsEnum.PUT,
  },
  {
    method: MethodsEnum.GET,
  },
  {
    method: ConditionalTypeEnum.IF,
  },
  {
    method: ConditionalTypeEnum.FILTER,
  },
  {
    method: InsocialMethodsEnum.INVITE,
  },
  {
    method: ConditionalTypeEnum.MAP,
  }
];
