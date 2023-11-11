import {IGraph} from "@app/shared/interfaces/graph/graph.interface";
import {INode} from "@app/shared/interfaces/node/node.interface";

export interface IUser {
  id: string;
  graphs: IGraph[];
  savedNodes?: INode[];
}
