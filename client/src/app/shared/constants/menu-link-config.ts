import { RouteConfigEnum } from '@app/shared/enums/routing.enum';

export const MenuLinkConfig = [
  { name: 'graphs', link: `/${RouteConfigEnum.OVERVIEW}` },
  { name: 'builder', link: `/${RouteConfigEnum.BUILDER}` },
  { name: 'execution', link: `/${RouteConfigEnum.EXECUTION}` },
];
