const zmq = require('zeromq');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

require('dotenv').config();

const sock = new zmq.Subscriber();

const main = async () => {
	try {
		sock.connect(process.env.socket_address_subscriber);
		sock.subscribe('1');
		for await (const [topic, msg] of sock) {
			const message = JSON.parse(msg.toString());

			console.log(
				'Sending SMS to:',
				message.number,
				', Process id:',
				process.pid,
				', Date:',
				Date.now()
			);
			sendSms(message.number);
		}
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};
main();

function sendSms(number) {
	try {
		client.messages
			.create({
				body: 'Hello there!',
				from: process.env.TWILIO_NUMBER,
				to: number,
			})
			.then((message) => console.log(message.sid));
	} catch (error) {
		console.error(error);
	}
}
