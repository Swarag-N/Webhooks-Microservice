const http = require("http");
// const qs = require("querystring");

const requestListener = function (req, res) {
    
	console.log(req.hostname);
	let body = "";
	req.on("data", chunk => {
		body += chunk.toString(); // convert Buffer to string
	});
	req.on("end", () => {
		// console.log(qs.parse(body))
		console.table(JSON.parse(body));
	});
	res.writeHead(200);
	res.end("Hello, World!");
};


const server0 = http.createServer(requestListener);
server0.listen(4000);

const server1 = http.createServer(requestListener);
server1.listen(4001);

const server2 = http.createServer(requestListener);
server2.listen(4002);

const server3 = http.createServer(requestListener);
server3.listen(4003);

const server4 = http.createServer(requestListener);
server4.listen(4004);
