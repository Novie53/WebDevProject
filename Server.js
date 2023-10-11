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
app.get('/products', (req, res) => {
    res.render('products');
});
app.use(function(req, res) {
    res.status(404).render('404');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
