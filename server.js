const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Force production unless you explicitly opt into dev
const dev = process.env.FORCE_DEV === '1' ? true : false;
const app = next({ dev, dir: '.' }); // dir: '.' ensures correct base
const handle = app.getRequestHandler();

const port = process.env.PORT || 8080; // Azure uses 8080

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port} (dev=${dev}) NODE_ENV=${process.env.NODE_ENV}`);
  });
});