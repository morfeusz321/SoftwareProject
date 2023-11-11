import { ConditionalTypeEnum } from '@app/shared/enums/conditional-type.enum';
import { IArgument } from '@app/shared/interfaces/argument/argument.interface';
import { IRequest } from '@app/shared/interfaces/request/request.interface';
import { ICoordinates } from '@app/shared/interfaces/coordinates/coordinates.interface';
import { InsocialMethodsEnum, MethodsEnum } from '@app/shared/enums/methods.enum';
import { IExpression, IMapExpression } from '@app/shared/interfaces/condition/condition.interface';
import { InviteConfiguration } from '@app/shared/interfaces/invites/invite.interface';

export interface INode {
  name: string;
  id: string;
  neighbours: string[];
  position: ICoordinates;
  type: InsocialMethodsEnum | ConditionalTypeEnum | MethodsEnum;
}

export interface IConditionNode extends INode {
  expression: IExpression;
}

export interface IActionNode extends INode {
  request: IRequest;

  arguments: IArgument[];
}

export interface IInsocialNode extends INode {
  request: IRequest;
  inviteConfiguration?: InviteConfiguration;
  arguments: IArgument[];
  email: IArgument;
}

export interface ITriggerNode extends INode {
  schedule: string;
}

export interface ICustomNode {
  id?: number;
  userId?: number;
  action: IActionNode;
}

export interface IMapNode extends INode {
  mapExpression: IMapExpression;
}
