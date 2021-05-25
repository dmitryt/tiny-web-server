import Router from "./router";

describe('Router', () => {

  it('should find route correctly', () => {
    const router = new Router();
    const handler = () => {};
    router.addRoute("GET", "/items/:id", handler);
    expect(router.findHandler('GET', '/items/123')).toBe(handler);
  });
});
