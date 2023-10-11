const express = require('express');
const { engine } = require('express-handlebars');
const fs = require("fs");

const port = 80;
const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'));
app.use((req, res, next) => {
    console.log("Req. URL: ", req.url);
    next();
});

const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('project.db')







app.get('/', (req, res) => {
    res.render('home');
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/contact', (req, res) => {
    res.render('contact');
});
app.get('/partners', (req, res) => {
    db.all("SELECT * FROM businessPartners", (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Server Error'});
        }
        else {
            const model = {partnerList: rows};
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
            const model = {productList: rows};
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
            const model = row;
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
