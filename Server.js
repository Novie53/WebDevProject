const express = require('express');
const { engine } = require('express-handlebars');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const session = require('express-session');
const connectSqlite3 = require('connect-sqlite3')
const bcrypt = require('bcrypt');

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

    db.get("SELECT * FROM users WHERE userName = ?", [un], (error, user) =>{
        if (error) {
            res.status(500).send({ error: "Server Error"});
        } else if (!user) {
            req.session.isAdmin = false;
            req.session.isLoggedIn = false;
            req.session.name = "";
            res.render('login.handlebars', { loginFailed: true });
        }
        else {
            if (bcrypt.compareSync(pw, user.passwordHash)) {
                req.session.isLoggedIn = true;
                req.session.name = user.displayName;
                req.session.isAdmin = user.accessLevel >= 10;
                res.redirect('/');
            }
            else {
                req.session.isAdmin = false;
                req.session.isLoggedIn = false;
                req.session.name = "";
                res.render('login.handlebars', { loginFailed: true });
            }
        }
    });
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Error while destroying the session: ", err);
        }
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
app.get('/product/delete/:id', (req, res) => {
    const id = req.params.id;
    if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
        db.run("DELETE FROM products WHERE pID = ?", [id], function (error, theProduct) {
            if (error) {
                console.log("Error when trying to delete product with id ", id, " from products table: ", error);
                res.redirect('/products');
            }
            else {
                res.redirect('/products');
            }
        });
    }
    else {
        console.log("somebody without authentication tried to delete a product");
        res.redirect('/');
    }
});
app.get('/products/new', (req, res) => {
    if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
        const model = {
            isLoggedIn: req.session.isLoggedIn,
            name: req.session.name,
            isAdmin: req.session.isAdmin,
        };
        res.render('newproduct.handlebars', model);
    }
    else {
        console.log("somebody without authentication tried to open the new product webpage");
        res.redirect('/');
    }
});
app.post('/products/new', (req, res) => {
    if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
        const newProd = [req.body.prodName, req.body.prodDesc, req.body.prodImg];

        db.run("INSERT INTO products (pName, pDesc, pImg) VALUES (?, ?, ?)", [newProd], (error) => {
            if (error) {
                console.log("Error when trying to insert new product: ", error);
            }
            else {
                console.log("a new product has been added to the products table!");
            }
        });
        res.redirect('/products');
    }
    else {
        console.log("somebody without authentication tried to create a new product");
        res.redirect('/');
    }
});
app.get('/product/update/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM products WHERE pid = ?", [id], function (error, theProduct) {
        if (error) {
            console.log("Error: ", error)
            res.redirect('/');
        }
        else {
            //console.log("MODIFY: ", JSON.stringify(theProduct));
            //console.log("MODIFY: ", theProduct);
            const model = {
                isLoggedIn: req.session.isLoggedIn,
                name: req.session.name,
                isAdmin: req.session.isAdmin,
                product: theProduct
            }
            res.render("modifyProduct.handlebars", model);
        }
    });
});
app.post('/product/update/:id', (req, res) => {
    if (req.session.isLoggedIn == true && req.session.isAdmin == true) {
        const id = req.params.id;
        const modifiedProd = [req.body.prodName, req.body.prodDesc, req.body.prodImg, id];
        db.run("UPDATE products SET pName = ?, pDesc = ?, pImg = ? WHERE pID = ?", [modifiedProd], (error) => {
            if (error) {
                console.log("Error: ", error);
            } else {
                console.log("Product updated!");
            }
            res.redirect('/products');
        });
    }
    else {
        console.log("somebody without authentication tried to modify a product");
        res.redirect('/');
    }
});












app.use(function(req, res) {
    res.status(404).render('404');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
