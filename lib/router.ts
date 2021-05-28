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

type FindHandlerResults = {
  params: {[key: string]: any};
  handler?: RouteHandler;
}

export default class Router {
  private routes: Routes

  constructor() {
    this.routes = {} as Routes;
  }

  addRoute(method: HttpMethod, route: string, handler: RouteHandler) {
    set(
      this.routes,
      `${method}.${route.split('/').slice(1).join('.children.')}.handler`,
      handler
    );
  }

  findHandler(method: HttpMethod, route: string): FindHandlerResults {
    const result: FindHandlerResults = {
      handler: undefined,
      params: {},
    };
    const routeArr = route.split('/').slice(1);
    let level: RouteLevel | null = this.routes[method];
    let depth = 0;
    while (level) {
      // Move all keys with ':' to the end of list
      const levelName: string | undefined = Object.keys(level || {})
        .sort((a) => a.startsWith(':') ? 1 : -1)
        .find(key => key === routeArr[depth] || key.startsWith(':'));

      if (levelName) {
        if (levelName.startsWith(':')) {
          result.params[levelName.slice(1)] = routeArr[depth];
        }
        if (depth === routeArr.length - 1) {
          return {
            ...result,
            handler: level[levelName].handler,
          };
        }
        level = level[levelName].children;
      } else {
        level = null;
      }
      depth++;
    }
    return result;
  }

  notFoundHandler(req: Request, res: Response) {
    res.status(404).write('Not Found').end()
  }
}
