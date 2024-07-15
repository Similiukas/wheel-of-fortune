/* eslint-disable @typescript-eslint/no-var-requires */
const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url === '/wheel' && req.method === 'GET') {
        console.log('Incoming GET /wheel request');
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify({ POSITION: Math.floor(Math.random() * 4) }));
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('404 Not Found');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
