const express = require('express');
const { engine } = require('express-handlebars');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectSqlite3 = require('connect-sqlite3')

const port = 80;
const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));

//--------------
// POST Forms
//--------------
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//-------------
// SESSIONS
//-------------
const SQLiteStore = connectSqlite3(session);

app.use(session({
    store: new SQLiteStore({db: "session-db.db"}),
    saveUninitialized: false,
    resave: false,
    secret: "This123IsASecret678Sentence"
}));

//-----------
// DB
//-----------
const db = new sqlite3.Database('project.db');



//---------------------------------------------------------------------------


app.use((req, res, next) => {
    console.log("Req. URL: ", req.url);
    next();
});



app.get('/', (req, res) => {
    const model = {
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
    };
    res.render('home.handlebars', model);
});
app.get('/about', (req, res) => {
    const model = {
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
    };
    res.render('about.handlebars', model);
});
app.get('/contact', (req, res) => {
    const model = {
        isLoggedIn: req.session.isLoggedIn,
        name: req.session.name,
        isAdmin: req.session.isAdmin
    };
    res.render('contact.handlebars', model);
});
app.get('/login', (req, res) => {
    const model ={};
    res.render('login.handlebars', model);
});
app.post('/login', (req, res) => {
    const un = req.body.un;
    const pw = req.body.pw;
    //console.log("LOGIN: ", un);
    //console.log("PASSWORD: ", pw);
    if (un=="abc" && pw=="abcd") {
        console.log("login succsessfull");
        req.session.isAdmin = true;
        req.session.isLoggedIn = true;
        req.session.name = "Abc";
        res.redirect('/');
    }
    else {
        console.log("Login failed");
        req.session.isAdmin = false;
        req.session.isLoggedIn = false;
        req.session.name = "";
        res.redirect('/login');
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        console.log("Error while destroying the session: ", err);
    });
    res.redirect('/');
});
app.get('/partners', (req, res) => {
    db.all("SELECT * FROM businessPartners", (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Server Error'});
        }
        else {
            const model = {
                isLoggedIn: req.session.isLoggedIn,
                name: req.session.name,
                isAdmin: req.session.isAdmin,
                partnerList: rows
            };
            res.render('partners', model);
        }
    });
});
app.get('/products', (req, res) => {
    db.all("SELECT * FROM products", (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Server Error'});
        }
        else {
            const model = {
                isLoggedIn: req.session.isLoggedIn,
                name: req.session.name,
                isAdmin: req.session.isAdmin,
                productList: rows
            };
            res.render('products', model);
        }
    });
});
app.get('/product/:id', function(req, res) {
    const id = req.params.id;
    db.get("SELECT * FROM products WHERE pID = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: 'Server Error'});
        }
        else if (row) {
            const model = {
                isLoggedIn: req.session.isLoggedIn,
                name: req.session.name,
                isAdmin: req.session.isAdmin,
                productData: row
            };
            res.render("product", model);
        }
        else {
            res.status(404).render('404');
        }
    });
});

app.use(function(req, res) {
    res.status(404).render('404');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
