import {Socket} from "net";
import { HttpHeaders, NL_CHAR } from "./util";
import HttpCodes from './httpCodes';

export default class Response {
  private socket: Socket;
  private isHeadersSent = false;
  private headers: HttpHeaders;
  private _status = 200;

  constructor(socket: Socket) {
    this.socket = socket;
    this.headers = {};
  }

  status(status: number) {
    this._status = status;
    return this;
  }

  set(headers: HttpHeaders) {
    this.headers = {
      ...this.headers,
      ...headers,
    };
    return this;
  }

  write(msg: string) {
    if (!this.isHeadersSent) {
      const status = this._status || 200;
      let content = `HTTP/1.1 ${status} ${HttpCodes[String(status)]}` + NL_CHAR;
      const headers = Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join(NL_CHAR);
      if (headers) {
        content += headers + NL_CHAR;
      }
      this.socket.write(content + NL_CHAR);
      this.isHeadersSent = true;
    }
    this.socket.write(Buffer.from(msg));
    return this;
  }

  send(msg: string) {
    this.write(msg).end()
  }

  json(msg: Record<string, unknown>) {
    this.set({'Content-Type': 'application/json'})
      .write(JSON.stringify(msg))
      .end();
  }

  end() {
    this.socket.end();
  }
}
