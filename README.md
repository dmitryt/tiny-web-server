# Tiny Web Server 🚀

This is a pretty tiny clone of Express.js. It can be used as library and was written for educational purposes only.

It supports:
* parameterized routing;

## Example

1. Start example app

```console
yarn example
```
2. Send requests via curl:

GET /items
```console
curl http://localhost:8080/items -H 'content-type: application/json'
```

GET /items/:id
```console
curl 'http://localhost:8080/items/11bf5b37-e0b8-42e0-8dcf-dc8c4aefc001' -H 'content-type: application/json'
```

POST /items
```console
curl -XPOST 'http://localhost:8080/items' -d '{"title": "123", "content": "234"}' -H 'content-type: application/json'
```

PUT /items/:id
```console
curl -XPUT 'http://localhost:8080/items/11bf5b37-e0b8-42e0-8dcf-dc8c4aefc001' -d '{"title": "123", "content": "111"}' -H 'content-type: application/json'
```

DELETE /items/:id
```console
curl -XDELETE 'http://localhost:8080/items/11bf5b37-e0b8-42e0-8dcf-dc8c4aefc001'
```
