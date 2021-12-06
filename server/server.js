
var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    multipart = require('connect-multiparty'),
    mongoose = require('mongoose'),
    baucis = require('baucis'),
    cookieParser = require('cookie-parser'),
    http = require('http'),
    passport = require('passport'),
    mongodb_url = 'mongodb://localhost:27017,localhost:27018,localhost:27019/OmniFans?replicaSet=omnibridge',
    config = require('./server/modules/config.js');
var cors = require('cors');
var compression = require('compression');
var cron = require('node-cron');
var moment =require('moment');

const Web3 = require('web3');
const contract = require('truffle-contract');
//const artifacts = require('../OmniFan/build/contracts/OmniFan.json');

const block_url=config[process.env.MODE||'development'].block_url;

const web3 = new Web3(block_url);

require('./server/modules/owners/main.js');
require('./server/modules/tokens/main.js');
require('./server/modules/collectibles/main.js');




var publicweb = __dirname + '/../client/dist/omnifan';
//const OmniBridge = contract(artifacts);
/*OmniBridge.setProvider(web3.currentProvider);

async function initContract() {

}*/


process.env.MODE = process.env.MODE || 'development';
var port = process.env.PORT || config[process.env.MODE].port;
var connection = mongoose.connect((process.env.MONGODB_URI || config[process.env.MODE].database_url), { useNewUrlParser: true });
//autoIncrement.initialize(connection);



var app = express();
var corsOptions = {
    origin: function(origin, callback) {
        callback(null, true)
    },
    credentials: true
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(compression());

app.use(function(req, res, next) {

    const allowedOrigins = ['http://localhost:4200', 'https://omnibridge.app'];
    const origin = req.headers.origin;


    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.set('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, count, model");
    res.header("access-control-expose-headers", "Origin, X-Requested-With, Content-Type, Accept, count, model");
    
    //res.setHeader("Access-Control-Allow-Credentials", "true");
    //res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    //res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});
var uploadDir=path.join(__dirname, '/server/www/tmp');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/../client/dist/omnibridge'));
app.use(express.static(uploadDir));



var router = express.Router();

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

console.log(uploadDir);
app.use(multipart({
    uploadDir: uploadDir
}));




app.use('/api/v1', baucis());

let multer = require('multer');
let UPLOAD_FOLDER = './server/www/tmp';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        console.log(1,file);
        callback(null, uploadDir);
    },
    filename: (req, file, callback) => {
        var randomstring = require('randomstring');
        var code = randomstring.generate({
            length: 4,
            readable: true,
            capitalization: 'uppercase'
        });
        console.log(1,file);

        callback(null, code + '_' + file.originalname)
    }
})

const upload = multer({ storage: storage });



app.post('/api/v1/files', upload.single('files'), (req, res, next) => {
    const file = req.files;
    console.log(1,req.files);
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send({filename:file.file.path.substring(uploadDir.length + 1)});
});

app.all('/*', function(req, res, next) {
    if (req.url.indexOf('api') > -1) {
        res.send(404);
    } else if (req.url.indexOf('api') == "/#/") {
        res.send(404);
    } else {
        res.sendFile('index.html', { root: publicweb });
    }

});
app.use(function(req, res) {
    //res.redirect('/index.html', { root: __dirname+'/www-web' });
    res.send(404);
});




var httpServer = http.createServer(app);

httpServer.listen(port);

if (process.env.MODE === 'production') {
    process.on('uncaughtException', function(err) {
        console.error(err);
        console.log("Node NOT Exiting...");
    });
}

(async () => {
    console.log('before start');

    //await initContract();

    console.log('after start');
})();



////////////////////////////////////////////////

console.log('Omni Bridge Running on port ' + port);