import { constructHead } from "./util";

describe("util", () => {

  describe("constructHead", () => {
    it("should parse head correctly", () => {
      const items = [
        {
          input: `GET /items HTTP/1.1\r\nHost: example.local\r\nAccept: text/html`,
          output: {
            method: 'GET',
            url: '/items',
            protocol: 'HTTP/1.1',
            headers: {
              host: 'example.local',
              accept: 'text/html',
            }
          }
        },
        {
          input: `POST /users HTTP/1.1\r\nContent-type: application-json\r\nAccept: text/html`,
          output: {
            method: 'POST',
            url: '/users',
            protocol: 'HTTP/1.1',
            headers: {
              'content-type': 'application-json',
              accept: 'text/html',
            }
          }
        }
      ];
      for (let item of items) {
        expect(constructHead(item.input)).toEqual(item.output);
      }
    });
  });
});
