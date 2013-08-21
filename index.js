var express = require('express'),
	app = express(),
	_ = require('lodash'),
	request = require('request'),
	xml2js = require('xml2js'),
	parser = new xml2js.Parser();

//xDomain
app.options('*', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "content-Type, X-Requested-With");
	res.send("PARSE PROXY\n", {
		"Allow": "OPTIONS, GET",
		"Content-Type": "text/plain, application/json"
	}, 200);
});
var website_regex =  /^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/;

app.get('/parse', function (req, res) {
	function sendError(err) {
		return res.send(400, {
			error: 'Invalid query. Please provide a valid RSS feed URL as the ?url= query',
			request: req.query
		});
	}
	var url = (req.query) ? req.query.url : false;

	if(!url || url.match(website_regex) === undefined) {
		return sendError();
	}
	request.get('http://' + url, function (err, raw, data) {
		if(err) return sendError(err);
		parser.parseString(data.toString(), function(err, parsed) {
			if(err) return sendError(err);
			res.send(parsed);
		});
	});
});
app.listen(process.env.PORT || 8080, function() {
	console.log('Listening on port ' + process.env.PORT || 8080);
});