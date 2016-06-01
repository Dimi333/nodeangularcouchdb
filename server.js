var express = require("express");
var bodyParser = require("body-parser");
var mylib = require("nano")("http://localhost:5984").use("mylibrary")
var app = express();

/*
//vlozi hlavicky, ktore dovoľujú cross-origin požiadavky
app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});*/

app.use(express.static('public')); //zložka pre statické veci ako html
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

app.get('/domov', function (req, res) {
	//zavolanie view - vypis vsetky knhihy podla ISBN
	var isbn = "978-0553380163";
	mylib.view("mylibrary", "books_by_isbn", function (err, body, header) {
		if (err) {
			res.writeHead(500, { "Content-Type": "text/plain" });
			res.end("Querying books failed. " + err + "\n"); }
		else {
			res.writeHead(200, { "Content-Type": "text/plain" });
			res.end("Books queried. Response: " + JSON.stringify(body, null, 4) + "\n");
		}
	});
});

app.post('/vloz', function (req, res) {
	//vlozenie objektu
	/*var book = {
        Title: "A Brief History of Time",
        Author: "Stephen Hawking",
        Type: "Paperback – Unabridged, September 1, 1998",
        ISBN: "978-0553380163"
    };

    mylib.insert(book, book.ISBN, function(err, body, header) {
        if(err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Inserting book failed. " + err + "\n");
        } else {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Book inserted. Response: " + JSON.stringify(body, null, 4) + "\n");
        }
    });*/
	 res.send(req.body.nazov);
});

app.get('/update', function (req, res) {
	//update objektu podla ISBN
	var isbn = "978-0553380163";
	mylib.view("mylibrary", "books_by_isbn", function (err, body, header) {
	    mylib.get(isbn, function (error, existing) {
	        if (!error) {
	            existing.Author = "Tanzim Saqib";
	            mylib.insert(existing, isbn, function (err, body, header) {
	                if (!err) {
	                    res.writeHead(200, { "Content-Type": "text/plain" });
	                    res.end("Book updated. Response: " + JSON.stringify(body, null, 4) + "\n");
	                }
	            })
	        }
	    });
	});
});

app.get('/zmaz', function (req, res) {
	//zmazanie objektu podla ISBN
	var isbn = "978-0553380163";
	mylib.view("mylibrary", "books_by_isbn", function (err, body, header) {
	    mylib.get(isbn, function (error, existing) {
	        if (!error) {
	            mylib.destroy(isbn, existing._rev, function (err, body, header) {
	                if (!error) {
	                    res.writeHead(200, { "Content-Type": "text/plain" });
	                    res.end("Book deleted. Response: " + JSON.stringify(body, null, 4) + "\n");
	                }
	            })
	        }
	    });
	});
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
