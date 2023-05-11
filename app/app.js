const http = require("http");

const host = 'localhost';
const port = 8000;

const jsonData = require('./routing.json');
const controller = require("./controller.js")

const routingMap = new Map(Object.entries(jsonData));

let objController = new controller;
const requestListener = function (req, res) {

    let rout = routingMap.get(req.url);

    if (rout === undefined) {
        res.writeHead(500);
        res.end(objController.errController());

        return
    }

    let key = rout.controller;

    if (rout.method.includes(req.method)) {
        objController.func(key, req, res, objController)
    } else {
        res.writeHead(500);
        res.end(objController.errController());
    }
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});