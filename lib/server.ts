import { AddressInfo, createServer, Server as NetServer, Socket } from "net";
import { HttpMethod, parseHead } from "./util";
import Request from "./request";
import Router from "./router";

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
        //TODO: add Router
        //TODO: add Response
        const req = new Request({ headers, url, method });
        console.log(`REQUEST: ${req.method} ${req.url} ${JSON.stringify(req.headers)}`);
      };
      socket.on("error", onError);
      socket.on("readable", onReadable);
    });

    this.instance.on("error", (err) => {
      throw err;
    });
  }

  get(route: string, handler: (req: Request) => void) {
    this.router.addRoute('GET', route, handler);
  }

  post(route: string, handler: (req: Request) => void) {
    this.router.addRoute('POST', route, handler);
  }

  address(): string | AddressInfo | null {
    return this.instance.address();
  }

  listen(port: number, cb?: () => void) {
    this.instance.listen(port, cb);
    return this;
  }
}
