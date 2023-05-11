
require('dotenv').config();
class Controller {

    _allCookie = [];
    func(key, req, res, obj) {
        key = this[key];
        if('function' === typeof key) {
            return key(req, res, obj);
        }
    }
    getController(_, res) {
        res.end("Hello from getController");
    }

    postController(_, res) {
        res.end("Hello from postController");
    }

    anyController(_, res) {
        res.end("Hello from anyController");
    }

    getEnvController(_, res) {
        res.end(process.env.NODE_ENV);
    }

    postHeaderController(req, res) {
        let bodyHeader = '';
        req.on('data', chunk => {
            bodyHeader += chunk.toString();
        });

        req.on('end', () => {
            let body = JSON.parse(bodyHeader);

            console.log("header header header", body);

            res.setHeader(body.key, body.value) // ???????
            res.end();
        });
    }

    postCookieController(req, res, obj) {
        let cookiesBody = '';
        req.on('data', chunk => {
            cookiesBody += chunk.toString();
        });

        req.on('end', () => {
            let cookieBody = JSON.parse(cookiesBody);
            let checkDublicate = obj._allCookie.find(element => element === cookieBody.cookie);

            if (checkDublicate === undefined) {
                obj._allCookie.push(cookieBody.cookie);
            } else {
                res.writeHead(500);
                res.end("This cookie already exist");
            }

            res.writeHead(200, {'Set-Cookie': cookieBody.cookie, 'Content-Type': 'text/plain'})
            res.end();
        });
    }


    getCookiesController(_, res, obj) {
        if(obj._allCookie.length > 0 ) {
            res.writeHead(200, {'Set-Cookie': JSON.stringify(obj._allCookie), 'Content-Type': 'text/plain'})
            res.end();
        } else {
            res.writeHead(500)
            res.end("Cookies not exist");
        }
    }

    postRedirectController(_, res) {
        res.writeHead(302,  {Location: "http://localhost:8000/cookie/get-all"}); // ????
        res.end();
    }
    errController() {
        return "Invalid url parameters";
    }
}

module.exports = Controller