import Router from "./router";

describe('Router', () => {
  it('should find route correctly', () => {
    const router = new Router();
    const handler = () => {};
    router.addRoute("GET", "/items", handler);
    expect(router.findHandler('GET', '/items')).toEqual(expect.objectContaining({ handler }));
    expect(router.findHandler('GET', '/items/123')).toEqual(expect.objectContaining({ handler: undefined }));
  });

  it('should find parameterized route correctly', () => {
    const router = new Router();
    const handler = () => {};
    router.addRoute("GET", "/items/:id", handler);
    expect(router.findHandler('GET', '/items')).toMatchObject({ handler: undefined });
    expect(router.findHandler('GET', '/items/123')).toMatchObject({ handler });
  });

  it('should collect params correctly', () => {
    const router = new Router();
    const handler = () => {};
    router.addRoute("GET", "/items/:id", handler);
    expect(router.findHandler('GET', '/items/123')).toMatchObject({ params: { id: '123' } });
  });
});
