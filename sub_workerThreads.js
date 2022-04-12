const { Worker } = require('worker_threads');
const zmq = require('zeromq');
require('dotenv').config();
const sock = new zmq.Subscriber();

const main = async () => {
	try {
		sock.connect(process.env.socket_address_subscriber);
		sock.subscribe('1');
		for await (const [topic, msg] of sock) {
			console.log('Date:', Date.now());
			workerThread();
		}
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};
main();

function workerThread() {
	const worker = new Worker('./worker.js');
	worker.on('message', (data) => {
		console.log(
			'Sum is :',
			data,
			', Process id:',
			process.pid,
			', Date:',
			Date.now()
		);
	});
}
