const zmq = require('zeromq');
const { fork } = require('child_process');
require('dotenv').config();
const sock = new zmq.Subscriber();

const main = async () => {
	try {
		sock.connect(process.env.socket_address_subscriber);
		sock.subscribe('1');
		for await (const [topic, msg] of sock) {
			console.log('Date:', Date.now());
			forkProcess();
		}
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};
main();

function forkProcess() {
	const child = fork('./longtask.js');
	child.send('start');
	child.on('message', (sum) => {
		console.log(
			'Sum is :',
			sum,
			', Process id :',
			process.pid,
			', Date:',
			Date.now()
		);
	});
}
