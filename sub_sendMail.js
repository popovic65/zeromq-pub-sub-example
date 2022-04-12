const zmq = require('zeromq');
const nodemailer = require('nodemailer');
require('dotenv').config();

const sock = new zmq.Subscriber();

const main = async () => {
	try {
		sock.connect(process.env.socket_address_subscriber);

		sock.subscribe();
		for await (const [topic, msg] of sock) {
			const message = JSON.parse(msg.toString());
			console.log(
				'Sending email to:',
				message.email,
				', Process id:',
				process.pid,
				', Date:',
				Date.now()
			);
			await sendEmail(message.email);
		}
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};
main();

async function sendEmail(recipient) {
	try {
		let transporter = nodemailer.createTransport({
			service: 'hotmail',
			port: 587,
			secure: false,
			auth: {
				user: process.env.EMAIL_ID,
				pass: process.env.PASSWORD,
			},
		});

		let info = await transporter.sendMail({
			from: `${process.env.EMAIL_ID}`,
			to: recipient,
			subject: 'Hello ✔',
			text: 'Hello there?',
			html: '<b>Hello there?</b>',
		});

		console.log('Message sent: %s', info.messageId);
	} catch (error) {
		console.error(error);
	}
}
