import { AddressInfo, createServer, Server as NetServer, Socket } from "net";
import { parseHead } from "./util";
import Request from "./request";

export default class Server {
  private instance: NetServer;

  constructor() {
    this.instance = createServer((socket: Socket) => {
      const onError = () => {};
      const onReadable = async () => {
        const { url, headers, method } = await parseHead(socket, () => {
          socket.removeListener('error', onError);
          socket.removeListener('readable', onReadable);
        });
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

  address(): string | AddressInfo | null {
    return this.instance.address();
  }

  listen(port: number, cb?: () => void) {
    this.instance.listen(port, cb);
    return this;
  }
}
