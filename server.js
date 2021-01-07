// Imports
const http = require('http');
const my_lowdb = require('./DAOlowdb.js')

console.log("--- API IS STARTING ---")

// Quick HTTP server creation
var server = http.createServer(
    async function(request, answer)
    {
        if(request.method === 'GET')
        {
            if(request.url === '/pseudo' || request.url === '/pseudo/')
            {
                const data = await my_lowdb.getPseudo();
                console.log(data)
                answer.end(JSON.stringify(data));
            }
        }
    });
server.listen(8080);

console.log("--- API IS NOW RUNNING ---")