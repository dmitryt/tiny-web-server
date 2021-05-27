import {HttpHeaders, HttpMethod} from "./util";

interface RequestOptions {
  readonly headers: HttpHeaders;
  readonly method: HttpMethod;
  readonly url: string;
  readonly body: any;
}

export default class Request {
  headers: HttpHeaders;
  url: string;
  method: HttpMethod;
  private _body: any;
  private _params: any;

  constructor({ url, method, headers, body }: RequestOptions) {
    this.method = method;
    this.url = url;
    this.headers = headers;
    this.body = body;
  }

  accepts(key: string): boolean {
    const hash: {[key: string]: string} = {
      'json': 'application/json',
    };
    if (!hash[key]) {
      return false;
    }
    return this.headers['content-type'] === hash[key];
  }

  set params(params: any) {
    this._params = params;
  }

  get params() {
    return this._params;
  }

  set body(body: any) {
    this._body = body;
  }

  get body() {
    let body = this._body;
    if (this.accepts('json')) {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {}
      }
    }
    return body;
  }
}
