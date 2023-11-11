import {MethodsEnum} from "@app/shared/enums/methods.enum";
import {IAuthentication} from "@app/shared/interfaces/auth/authentication.interface";

export interface IRequest {
  method: MethodsEnum;
  body: string;
  url: string;
  auth: IAuthentication;
}
