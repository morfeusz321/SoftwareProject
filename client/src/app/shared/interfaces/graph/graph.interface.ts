import {INode} from "@app/shared/interfaces/node/node.interface";

export interface IGraph {
  id: number;
  name: string;
  isDraft: boolean;
  isActive: boolean;
  schedule: string;
  nodes: INode[];
}
