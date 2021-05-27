import { AddressInfo, createServer, Server as NetServer, Socket } from "net";
import { parseBody, parseHead } from "./util";
import Request from "./request";
import Router from "./router";
import Response from "./response";

export default class Server {
  private instance: NetServer;
  private router: Router;

  constructor() {
    this.router = new Router();
    this.instance = createServer((socket: Socket) => {
      const onError = () => {};
      const onReadable = async () => {
        const { url, headers, method } = await parseHead(socket, () => {
          socket.removeListener('error', onError);
          socket.removeListener('readable', onReadable);
        });
        const body = await parseBody(socket);

        const req = new Request({ headers, url, method, body });
        const res = new Response(socket);
        const {params, handler} = this.router.findHandler(method, url);
        req.params = params;
        (handler || this.router.notFoundHandler)(req, res);
      };
      socket.on("error", onError);
      socket.on("readable", onReadable);
    });

    this.instance.on("error", (err) => {
      throw err;
    });
  }

  get(route: string, handler: (req: Request, res: Response) => void) {
    this.router.addRoute('GET', route, handler);
  }

  post(route: string, handler: (req: Request, res: Response) => void) {
    this.router.addRoute('POST', route, handler);
  }

  put(route: string, handler: (req: Request, res: Response) => void) {
    this.router.addRoute('PUT', route, handler);
  }

  delete(route: string, handler: (req: Request, res: Response) => void) {
    this.router.addRoute('DELETE', route, handler);
  }

  address(): string | AddressInfo | null {
    return this.instance.address();
  }

  listen(port: number, cb?: () => void) {
    this.instance.listen(port, cb);
    return this;
  }
}
