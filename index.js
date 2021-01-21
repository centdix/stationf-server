const express = require('express');
const cors = require('cors');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const uri = process.env.DATABASE_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let db;
client.connect(err => {
	db = client.db("stationf_db");
});

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send("hello world");
})

app.get('/rooms', (req, res) => {
	fs.readFile('rooms.json', (err, data) => {
		if (err) throw err;
		let rooms = JSON.parse(data);
		res.json(rooms);
	});
});

app.get('/bookings', (req, res) => {
	// fs.readFile('bookings.json', (err, data) => {
	// 	if (err) throw err;
	// 	let bookings = JSON.parse(data);
	// 	res.json(bookings);
	// });
	db.collection("bookings").find().toArray((err, docs) => {
		if (err) throw err;
		res.json(docs);
	})
});

app.post('/book', (req, res) => {
	// data = {'bookings': []};
	// raw = fs.readFileSync('bookings.json');
	// old_data = JSON.parse(raw);
	// new_booking = req.body;
	// old_data.bookings.push(new_booking);
	// bookings = JSON.stringify(old_data, null, 2);
	// fs.writeFileSync('bookings.json', bookings);
	// res.json(JSON.parse(bookings));
	db.collection("bookings").insertOne(req.body, (err, result) => {
		if (err) throw err;
		res.json(result);
	})
});

app.delete('/bookings/:id', async (req, res) => {
	let id = new ObjectID(req.params.id);
	let doc = await db.collection("bookings").findOne({'_id': id});
	let result = await db.collection("bookings").deleteOne(doc);
	res.json(result);
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}!`)
});
