import {HttpHeaders, HttpMethod} from "./util";

interface RequestOptions {
  readonly headers: HttpHeaders;
  readonly method: HttpMethod;
  readonly url: string;
}

export default class Request {
  headers: HttpHeaders;
  url: string;
  method: HttpMethod;


  constructor({ url, method, headers }: RequestOptions) {
    this.method = method;
    this.url = url;
    this.headers = headers;
  }
}
