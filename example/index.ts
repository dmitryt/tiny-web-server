import { uuid } from 'uuidv4';

import Request from '../lib/request';
import Response from '../lib/response';
import Server from '../lib/server';

const app = new Server();

let items = [
  {id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc001', title: 'test title1', content: 'test content1'},
  {id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc002', title: 'test title2', content: 'test content2'},
  {id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc003', title: 'test title3', content: 'test content3'},
  {id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefc004', title: 'test title4', content: 'test content4'},
];

app.get('/items', (req: Request, res: Response) => {
  res.json({ data: items });
});

app.get('/items/:id', (req: Request, res: Response) => {
  const item = items.find(item => item.id === req.params.id);
  if (item) {
    res.json({ data: item });
  } else {
    res.json({ data: item });
  }
});

app.post('/items', (req: Request, res: Response) => {
  const item = {...req.body, id: uuid() };
  items.push(item);
  res.json({ data: item });
});

app.put('/items/:id', (req: Request, res: Response) => {
  let data = {};
  items = items.map((item) => {
    if (item.id !== req.params.id) {
      return item;
    }
    data = {...item, ...req.body};
    return data as any;
  });
  res.json({ data });
});

app.delete('/items/:id', (req: Request, res: Response) => {
  items = items.filter(item => item.id !== req.params.id);
  res.json({ ok: true });
});

app.listen(8081, () => {
  console.log('opened on', app.address());
});

