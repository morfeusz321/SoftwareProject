import {AuthenticationTypeEnum} from "@app/shared/enums/authentication-type.enum";

export interface IAuthentication {
  type: AuthenticationTypeEnum;
  token: string;
}
