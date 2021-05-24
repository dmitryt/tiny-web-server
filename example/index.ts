import {AddressInfo} from 'net';
import Server from '../lib/server';

const app = new Server();

app.listen(8081, () => {
  console.log('opened on', app.address());
});

