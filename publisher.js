const express = require('express');
const zmq = require('zeromq');
const bodyparser = require('body-parser');
require('dotenv').config();

const PORT = process.env.PORT;
const app = express();
const sock = new zmq.Publisher();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.post('/', async (req, res) => {
	await sock.send(['1', JSON.stringify(req.body)]);
	return res.send(req.body);
});

const main = async () => {
	try {
		await sock.bind(process.env.socket_address_publisher);
		app.listen(PORT, () => {
			console.log('Listening on port', PORT);
		});
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};
main();
