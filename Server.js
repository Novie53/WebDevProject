const express = require('express')
const fs = require("fs");


const app = express()
app.use(express.static('public'))
const port = 80

const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('project.db')




app.get('/', (req, res) => {
    fs.readFile("main.html", (error, data) => {
        res.status(200).type("html").send(data);
    });
})
app.get('/products', (req, res) => {
    fs.readFile("products.html", (error, data) => {
        res.status(200).type("html").send(data);
    });
})
app.get('/about', (req, res) => {
    fs.readFile("about.html", (error, data) => {
        res.status(200).type("html").send(data);
    });
})
app.get('/contact', (req, res) => {
    fs.readFile("contact.html", (error, data) => {
        res.status(200).type("html").send(data);
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
