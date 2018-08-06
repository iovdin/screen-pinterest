/* eslint consistent-return:0 */

const express = require('express');
const logger = require('./util/logger');
const https = require('https');
const fs = require('fs');
const fetch = require('node-fetch');
const URL = require('url');


const argv = require('./util/argv');
const port = require('./util/port');
const setup = require('./middlewares/frontendMiddleware');
const { resolve } = require('path');

const app = express();

let cache = {};

app.use('/api/fetch', async (req, res) => {
  const parsed = URL.parse(req.url, true)
  const board = parsed.pathname.substr(1)
  console.log(board, req.url)
  if (cache[board]) {
    return res.send({ pins: cache[board]})
  }
  // do cache after initial fetch, as pinterest easily goes on "too many requests"
  const urlObj = {
    protocol: 'https:',
    hostname: 'api.pinterest.com',
    pathname: `/v1/boards/${board}/pins/`,
    query: { access_token: parsed.query.access_token, fields: "id,image,note" }
  };

  let pins = [];
  let resp = await fetch(URL.format(urlObj));
  resp = await resp.json();
  if (resp.data) {
    pins = pins.concat(resp.data)
  } else if (resp.message) { 
    return res.send({ err: resp.message });
  }
  let numReqs = 0 

  while (resp.page && resp.page.next && numReqs < 4) {
    resp = await fetch(resp.page.next)
    resp = await resp.json()
    if (resp.data) {
      pins = pins.concat(resp.data)
    }
    numReqs++
  }

  cache[board] = pins

  res.send({ pins: cache[board] })
});

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';
const secure = process.env.NODE_ENV === 'development';

const onStartCallback = (err) => {
  if (err) {
    return logger.error(err.message);
  }
  logger.appStarted(port, prettyHost, secure);
};

let server = app;

// run dev server with https
if (secure) {
  const httpsOptions = {
    key: fs.readFileSync('./config/key.pem'),
    cert: fs.readFileSync('./config/cert.pem')
  };
  server = https.createServer(httpsOptions, app);
}

server.listen(port, host, onStartCallback);
