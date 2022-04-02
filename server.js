var https = require('https');
var http = require('http');
var fs = require('fs');

const next = require('next');
const port = parseInt(process.env.PORT) || 3000;
const httpsPort = parseInt(process.env.PORT) || 3443;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

var options = {
    key: fs.readFileSync('cert/key.pem'),
    cert: fs.readFileSync('cert/cert.pem'),
};

app.prepare().then(() => {
    http.createServer(options, (req, res) => {
        return handle(req, res);
    }).listen(port, err => {
        if (err) throw err;
        console.log(`> Ready on https://localhost:${port}`);
    });
    https
        .createServer(options, (req, res) => {
            return handle(req, res);
        })
        .listen(httpsPort, err => {
            if (err) throw err;
            console.log(`> Ready on https://localhost:${httpsPort}`);
        });
});
