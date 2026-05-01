import http from 'http';
import { cacheManager } from './cache/cacheManager.js';

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    const response = await cacheManager(req);

    res.writeHead(response.statusCode, response.headers);
    res.end(response.body);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});
