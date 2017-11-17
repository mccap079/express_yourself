var http = require('https');
var fs = require('fs');
var url = require('url');

var options = {
    key: fs.readFileSync('my-key.pem'),
    cert: fs.readFileSync('my-cert.pem')
};

function handleIt(req, res) {
    console.log("The URL is: " + req.url);

    var parsedUrl = url.parse(req.url);
    console.log("They asked for " + parsedUrl.pathname);

    var path = parsedUrl.pathname;
    if (path == "/") {
        path = "index.html";
    }

    fs.readFile(__dirname + path,

        // Callback function for reading
        function(err, fileContents) {
            // if there is an error
            if (err) {
                res.writeHead(500);
                return res.end('Error loading ' + req.url);
            }
            // Otherwise, send the data, the contents of the file
            res.writeHead(200);
            res.end(fileContents);
        }
    );

    // Send a log message to the console
    console.log("Got a request " + req.url);
}

// Call the createServer method, passing in an anonymous callback function that will be called when a request is made
var httpServer = http.createServer(options, handleIt);

// Tell that server to listen on port 8081
httpServer.listen(9999);

console.log('Server listening on port 9999');

//////////////////////////
var isGettingFaces = false;

var path = "api/faces.json";
var data = {};
data.images = [];
// data.success = "undefined";
// data.status = "undefined";
updateFile(path, data);

var clients = [];

var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
    // We are given a websocket object in our function
    function(socket) {
        console.log("We have a new client: " + socket.id);

        socket.on('isGettingFaces', function(_isGettingFaces) {
            isGettingFaces = _isGettingFaces;
            console.log("isGettingFaces set to " + isGettingFaces);
        });

        socket.on('newFace', function(faceObj) {
            console.log("adding this face:" + JSON.stringify(faceObj));
            data.images.push(faceObj); //push latest face into images array
            updateFile(path, data); //rewrite the .json file with latest array
        });

        socket.on('getLastFace', function() {
            if (data.images.length > 0) {
                var lastFace = data.images[data.images.length - 1];
                io.sockets.emit('getLastFace', lastFace);
            } else {
                var error = "There are no faces!";
                io.sockets.emit('getLastFace', error);
            }
        });

        socket.on('deleteLastFace', function() {
            data.images.pop(); //delete latest face from array
            updateFile(path, data); //rewrite the .json file
        });
    }
);

function updateFile(path, content) {
    fs.writeFile(path, JSON.stringify(content), function(err) { //https://stackoverflow.com/a/36856643/1757149
        if (err) throw err;
        console.log('File updated: \n' + JSON.stringify(content));
    });
}

// function toBuffer(ab) { //from array buffer to buffer; https://stackoverflow.com/a/12101012/1757149
//     var buf = new Buffer(ab.byteLength);
//     var view = new Uint8Array(ab);
//     for (var i = 0; i < buf.length; ++i) {
//         buf[i] = view[i];
//     }
//     return buf;
// }