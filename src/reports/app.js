const axios = require('axios');
const express= require('express');
const http = require('http');
const morgan = require('morgan');

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

let ax = axios.create({
    baseURL: process.env.DATABASE_PROXY_URI || 'http://database-proxy:3000/'
});

// install route logging middleware
app.use(morgan('dev'));

// install json body parsing middleware
app.use(express.json());

// root route handler
app.get('/', (_, res) => {
  return res.send({ success: true, result: 'hello'});
});

// results route handler
app.get('/results', async (req, res) => {
  try {
    console.log('GET /results');
    let result = await ax.get('/results');
    console.log('resp: %j', result.data);
    // just passing response through
    res.send(result.data);
  } catch (err) {
    console.log('ERROR: GET /results: %s', err.message || err.response || err);
    res.status(500).send({ success: false, reason: 'internal error' });
  }
});

// initialize and start running
(async () => {
  try {
    server.listen(port, () => console.log(`listening on port ${port}`));
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
