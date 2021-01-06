// Imports
const http = require('http');
const lowdb = require('./lowdb.js')

console.log("--- API IS STARTING ---")

// Quick HTTP server creation
var server = http.createServer(
    async function(request, answer)
    {
        if(request.method === 'GET')
        {
            if(request.url === '/temperature' || request.url === '/temperature/')
            {
                const temperature = await lowdb.listerTemperatures();
                answer.end(JSON.stringify(temperature));
            }
        }
    });
server.listen(8080);

console.log("--- API IS NOW RUNNING ---")