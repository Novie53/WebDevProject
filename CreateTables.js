const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('project.db')



db.run("CREATE TABLE users (pid INTEGER PRIMARY KEY, userName TEXT NOT NULL, password TEXT NOT NULL, accessLevel INTEGER)", (error) => {
    if (error) {
        console.log("Error when creating users table: ", error);
    }
    else {
        console.log("---> Table users created!")
    }

    const users = [
        {"id":0, "userName":"admin", "password":"pass","accessLevel":99},
        {"id":1, "userName":"user1", "password":"pass1","accessLevel":1},
        {"id":2, "userName":"user2", "password":"pass2","accessLevel":1},
        {"id":3, "userName":"user3", "password":"pass3","accessLevel":1},
        {"id":4, "userName":"user4", "password":"pass4","accessLevel":1},
        {"id":5, "userName":"user5", "password":"pass5","accessLevel":1}
    ]
    users.forEach((user) => {
        db.run("INSERT INTO users (pid, userName, password, accessLevel) VALUES (?, ?, ?, ?)", [
            user.id,
            user.userName,
            user.password,
            user.accessLevel], (error) => {
                if (error) {
                    console.log("Error when inserting user into users table: ", error)
                }
                else {
                    console.log("user added to users table")
                }
            }
        )
    })
})

db.run("CREATE TABLE businessPartners (bID INTEGER PRIMARY KEY, bName TEXT NOT NULL, bDesc TEXT NOT NULL, bImg TEXT NOT NULL)", (error) => {
    if (error) {
        console.log("Error when creating businessPartners table: ", error);
    }
    else {
        console.log("---> Table businessPartners created!")
    }

    const businessPartners = [
        {"bID":0, "bName": "IKEA", "bDesc":"IKEA is a Swedish multinational conglomerate that designs and sells ready-to-assemble furniture, kitchen appliances, decoration, home accessories, and various other goods and home services", "bImg": "/img/IKEA.png"},
        {"bID":1, "bName": "Volvo", "bDesc":"Volvo is a Swedish automotive company known for its safe and innovative cars, trucks, buses, and construction equipment. With a commitment to sustainability, Volvo aims to transition to a fully electric vehicle lineup by 2030.", "bImg": "/img/Volvo.png"},
        {"bID":2, "bName": "Saab", "bDesc":"Saab is a Swedish automobile company known for its unique design, engineering, and focus on safety. The brand also has a history of manufacturing military aircraft and commercial jets.", "bImg": "/img/Saab.png"},
        {"bID":3, "bName": "Trelleborg", "bDesc":"Trelleborg is a Swedish engineering company specializing in polymer technology and innovative solutions for industries like automotive, aerospace, healthcare, and more. They are known for their expertise in sealing solutions, engineered coatings, and fluid handling systems. With a commitment to research and development, Trelleborg provides global support and sustainable solutions to meet customer needs.", "bImg": "/img/Trelleborg.png"},
        {"bID":4, "bName": "Michelin", "bDesc":"Michelin is a renowned tire manufacturer known for its innovation, quality, and performance. With the iconic Michelin Man as its symbol, the company offers a wide range of tires for various vehicles. Michelin is also involved in travel guides and is committed to sustainability.", "bImg": "/img/Michelin.png"}
    ]
    businessPartners.forEach((businessPartner) => {
        db.run("INSERT INTO businessPartners (bID, bName, bDesc, bImg) VALUES (?, ?, ?, ?)", [
            businessPartner.bID,
            businessPartner.bName,
            businessPartner.bDesc,
            businessPartner.bImg], (error) => {
                if (error) {
                    console.log("Error when inserting businessPartner into businessPartners table: ", error)
                }
                else {
                    console.log("businessPartner added to businessPartners table")
                }
            }
        )
    })
})


db.run("CREATE TABLE products (pID INTEGER PRIMARY KEY, pName TEXT NOT NULL, pDesc TEXT NOT NULL, pImg TEXT NOT NULL)", (error) => {
    if (error) {
        console.log("Error when creating products table: ", error);
    }
    else {
        console.log("---> Table products created!")
    }

    const products = [
        {"pID":0, "pName": "11.2R46 Alliance 350 TL 141D", "pDesc":"Belastningsindex:141<br>Hastighetsindex:D<br>Bredd:11.2<br>Profil:<br>Diameter:46<br>Mönster:350 ROW CROP R1<br>Övrigt:TL 141D**** (270/95R46)<br>Däcktyp:Traktor Radial", "pImg": "/img/387.png"},
        {"pID":1, "pName": "12.5R20 Alliance 300 TL 132G", "pDesc":"Belastningsindex:132<br>Hastighetsindex:G<br>Bredd:12.5<br>Profil:<br>Diameter:20<br>Mönster:300 MPT<br>Övrigt:TL 12PR/132G<br>Däcktyp:Multipurpose", "pImg": "/img/370.png"},
        {"pID":2, "pName": "260/70R16 Trelleborg TM 700", "pDesc":"Dimension:260/70R16<br>märke:Trelleborg<br>Mönster:TM 700<br>Däcktyp:Traktor bakdäck", "pImg": "/img/386.png"},
        {"pID":3, "pName": "750/65R26 Michelin Megaxbib", "pDesc":"Belastningsindex:171<br>Hastighetsindex:A8<br>Bredd:750<br>Profil:65<br>Diameter:26<br>Mönster:MEGAXBIB <br>Övrigt:<br>Däcktyp:Traktor Radial", "pImg": "/img/371.png"},
        {"pID":4, "pName": "230/95R32 Trelleborg TM100", "pDesc":"Dimension:230/95R32<br>märke:Trelleborg<br>Mönster:TM100<br>Däcktyp:Traktor bakdäck", "pImg": "/img/372.png"}
    ]
    products.forEach((product) => {
        db.run("INSERT INTO products (pID, pName, pDesc, pImg) VALUES (?, ?, ?, ?)", [
            product.pID,
            product.pName,
            product.pDesc,
            product.pImg], (error) => {
                if (error) {
                    console.log("Error when inserting product into products table: ", error)
                }
                else {
                    console.log("product added to products table")
                }
            }
        )
    })
})