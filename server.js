const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = 'F:\\LUXURY WATCHES';

const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; img-src 'self' data: https://www.google-analytics.com https://www.google.com; connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
};

const MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.json': 'application/json',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
    let url = req.url.split('?')[0];
    if (url === '/') url = '/index.html';
    if (url === '/checkouts') url = '/checkouts.html';

    const filePath = path.join(ROOT, url);
    const ext = path.extname(filePath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            const notFoundPath = path.join(ROOT, '404.html');
            fs.readFile(notFoundPath, (err2, data2) => {
                if (err2) {
                    res.writeHead(404, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
                    res.end('Not found');
                    return;
                }
                res.writeHead(404, { 'Content-Type': 'text/html', ...SECURITY_HEADERS });
                res.end(data2);
            });
            return;
        }
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', ...SECURITY_HEADERS });
        res.end(data);
    });
});

server.listen(8000, () => {
    console.log('Server running on http://localhost:8000');
});
