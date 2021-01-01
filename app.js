export default function appSrc(express, bodyParser, createReadStream, crypto, http, mongo) {
const app = express();
const CORS = {
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,OPTIONS,DELETE»',
'Content-Type': 'text/plain; charset=utf-8'
};
const login = "artskadin";
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
