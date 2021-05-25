import { set } from 'lodash';
import Request from "./request";
import Response from "./response";
import {HttpHeaders, HttpMethod} from "./util";

type RouteHandler = (req: Request, res: Response) => void

type RouteLevel = {
  [route: string] : {
    route: string;
    children: RouteLevel;
    handler?: RouteHandler;
  }
}

type Routes = {
  [key in HttpMethod]: RouteLevel
}

export default class Router {
  private routes: Routes

  constructor() {
    this.routes = {} as Routes;
  }

  addRoute(method: HttpMethod, route: string, handler: RouteHandler) {
    set(
      this.routes,
      `${route.split('/').join('.children.')}.handler`,
      handler
    );
  }

  findHandler(method: HttpMethod, route: string): RouteHandler {

  }
}
