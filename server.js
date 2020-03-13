const openfinLauncher = require('hadouken-js-adapter');
const express = require('express');
const portfinder = require('portfinder');
const app = express();
let serverUrl = "";
let serverPort = 3200;

// Express Routes
app.use(express.static(__dirname ));

initExpress();

async function initExpress(serverPortArray){
    console.log("Starting a new server");
    const port = await portfinder.getPortPromise()
    .catch((err) => {
         console.log("Unable to discover a free port: " + err);
         console.log("-- Exiting --");
         reject("Unable to discover a free port: " + err);
    });
    console.log("Port Discovered: " + port);

    serverUrl = "http://localhost:" + port;
    app.listen(port, () =>{
        serverPort = port;
        console.log("New Server Started at: " + serverUrl);
        openfinLauncher.launch({manifestUrl: serverUrl + "/app.json?manifest=" + encodeURI(JSON.stringify(buildManifest("./springboard.json")))});
    });
}

// JSON relfector: returns the manifest passed in as a query String (?manifest=)
app.get('/app.json', (req, res) => {
    var manifest = JSON.parse(req.query.manifest);
    console.log("Serving Manifest:");
    console.log(manifest);
    res.send(manifest);
});

function buildManifest(appPath){
    var manifest = require(appPath);
    manifest.startup_app.applicationIcon = serverUrl + "/favicon";
    manifest.startup_app.url = serverUrl + "/springboard.html";
    manifest.startup_app.customData = serverPort;
    //manifest.shortcut.icon = serverUrl + "/favicon";
    return JSON.stringify(manifest);
};
