export default function appSrc(express, bodyParser, createReadStream, crypto, http, mongo) {
    const app = express();
    const CORS = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS,DELETE»',
        'Content-Type': 'text/plain; charset=utf-8'
    };
    const login = "itmo182954";
    app
        .use(bodyParser.urlencoded({ extended: true }))
        .all('/insert/', (req, res) => {
            res.set(CORS);
            if (!!req.body.URL && !!req.body.login && !!req.body.password) {
                const {MongoClient} = mongo;
                const client = new MongoClient(req.body.URL, { useNewUrlParser: true, useUnifiedTopology: true });

                async function run() {
                    try {
                        await client.connect();
                        const result = await client.db().collection('users').insertOne({
                            login: req.body.login.toString(),
                            password: req.body.password.toString()
                        })
                        await client.close();
                        res.send(result);
                    } catch (err) {
                        res.send(`Something went wrong: ${err}`);
                    } finally {
                        await client.close();
                        res.send();
                    }
                }
                run().catch();
            } else {
                res.send(login);
            }
        })
        .get('/login/', (req, res) => {
            res.set(CORS);
            res.send(login);
        })
        .get('/code/', (req, res) => {
            res.set(CORS);
            const chunks = [];
            const readStream = createReadStream(import.meta.url.substring(7));
            readStream.on('data', chunk => chunks.push(chunk));
            readStream.on('end', () => res.send(Buffer.concat(chunks).toString('utf8')));
        })
        .all('/req/', (req, res) => {
            res.set(CORS);
            const url = req.method === "GET" ? req.query.addr : req.body.addr;
            if (!!url) {
                http.get(url, response => {
                    var chunks = [];
                    response.on('data', chunk => chunks += chunk);
                    response.on('end', () => res.send(chunks));
                });
            } else {
                res.send(login);
            }
        })
        .get('/sha1/:input/', (req, res) => {
            res.set(CORS);
            const hash = crypto.createHash('sha1')
                .update(req.params.input)
                .digest('hex')
            res.send(hash);
        })
        .all('/*', (req, res) => {
            res.set(CORS);
            res.send(login);
        })
    return app;
}
