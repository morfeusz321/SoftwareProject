import {IConditionNode, INode} from '@app/shared/interfaces/node/node.interface';
import { ConditionalTypeEnum } from '@app/shared/enums/conditional-type.enum';
import { InsocialMethodsEnum, MethodsEnum } from '@app/shared/enums/methods.enum';
import { IGraph } from '@app/shared/interfaces/graph/graph.interface';
import {ConditionTypeEnum} from "@app/shared/enums/condition-type.enum";
import {IExpression} from "@app/shared/interfaces/condition/condition.interface";

export const node1: INode = {
  id: '1',
  name: 'test',
  neighbours: [],
  position: {
    positionX: 0,
    positionY: 0,
    positionZ: 0,
  },
  type: ConditionalTypeEnum.IF,
};

export const node2: INode = { ...node1, id: '2', type: MethodsEnum.POST };
export const node3: INode = { ...node1, id: '3', neighbours: ['2', '4'], type: MethodsEnum.GET };
export const node4: INode = { ...node1, id: '4', type: InsocialMethodsEnum.INVITE };
export const node5: INode = { ...node1, id: '5', neighbours: ['3'], type: ConditionalTypeEnum.TRIGGER };
export const node6: IConditionNode = {
  id: '1',
  name: 'test',
  neighbours: [],
  position: {
    positionX: 0,
    positionY: 0,
    positionZ: 0,
  },
  type: ConditionalTypeEnum.IF,
  expression: {
    firstFieldValue: '',
    firstFieldNodeId: '',
    comparisonType: ConditionTypeEnum.EQUAL,
    compareTo: null,
    secondFieldUserValue: '',
    secondFieldNodeValue: '',
    secondFieldNodeId: '',
    secondFieldTimeDays: 0,
    secondFieldTimeMonths: 0,
    secondFieldTimeYears: 0,
    secondFieldTimeDate: '',
    // Before/ After/ exactly
    secondFieldTimeExecutionTime: null,
  } as IExpression
};

export const graph1: IGraph = {
  id: 1,
  name: 'graph1',
  nodes: [node1],
  isDraft: true,
  isActive: true,
  schedule: '1*111',
};

export const graph2: IGraph = {
  id: 2,
  name: 'graph2',
  nodes: [node1, node2, node3, node4, node5],
  isDraft: false,
  isActive: false,
  schedule: '1*111',
};

export const testLog = {
  logs: [
    "Executing Trigger: ",
    "7591caed-7dde-4a63-8eff-8170df396d0d",
    "Executing GET Action: ",
    "5070ef2a-3f43-4434-9692-8db2f1ccc75d",
    "URL evaluated to https://jsonplaceholder.typicode.com/todos/1",
    "Body evaluated to ",
    "Step result evaluated to: {\"userId\":1,\"id\":1,\"title\":\"delectus aut autem\",\"completed\":false}",
    "Executing POST Action: ",
    "c6751519-a593-4e07-9a53-70d7440b71c9",
    "URL evaluated to https://jsonplaceholder.typicode.com/posts",
    "Body evaluated to {\"test\": 1}",
    "Step result evaluated to: {\"test\":1,\"id\":101}"
  ],
};

export const expectedLog = [
  {
    graphName: 'graph1',
    logs: [
      {
        nodeId: '7591caed-7dde-4a63-8eff-8170df396d0d',
        nodeInfo: 'Executing Start',
        evaluatedTo: [],
      },
      {
        nodeId: '5070ef2a-3f43-4434-9692-8db2f1ccc75d',
        nodeInfo: 'Executing GET Action',
        evaluatedTo: [
          'URL evaluated to https://jsonplaceholder.typicode.com/todos/1',
          'Body evaluated to ',
          'Step result evaluated to: ',
          `{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}`
        ],
      },
      {
        nodeId: 'c6751519-a593-4e07-9a53-70d7440b71c9',
        nodeInfo: 'Executing POST Action',
        evaluatedTo: [
          'URL evaluated to https://jsonplaceholder.typicode.com/posts',
          "Body evaluated to {\"test\": 1}",
          'Step result evaluated to: ',
          `{
  "test": 1,
  "id": 101
}`
        ],
      },
    ],
  },
];
