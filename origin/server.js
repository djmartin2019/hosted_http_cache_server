import http from 'http';

import { handleDevRoute } from './routes/dev.js';
import { handleOgRoute } from './routes/og.js';
import { handleProfilePage } from './routes/profilePage.js';

const PORT = 4000;

const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);

    try {
        if (url.pathname === '/') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`<h2>Origin server running at <strong>http://localhost:${PORT}</strong></h2>`);
        } else if (url.pathname.startsWith('/dev/')) {
            const response = await handleDevRoute(url);
            res.writeHead(response.statusCode, response.headers);
            return res.end(response.body);
        } else if (url.pathname.startsWith('/og/')) {
            const response = await handleOgRoute(url);
            res.writeHead(response.statusCode, response.headers);
            return res.end(response.body);
        } else if (url.pathname.startsWith('/u/')) {
            const response = await handleProfilePage(url, req);
            res.writeHead(response.statusCode, response.headers);
            return res.end(response.body);
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
    } catch (err) {
        console.error('[origin]', url.pathname, err);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Internal Server Error');
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Origin running at http://0.0.0.0:${PORT}`);
});
