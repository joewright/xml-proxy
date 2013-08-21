var cluster = require('cluster'),
	numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
	// Fork workers.
	for (var i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on('exit', function(worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died');
	});
} else {
	// In this case its a HTTP server
	require('./index');
}