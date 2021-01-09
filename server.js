// Imports
const http = require('http')
const my_lowdb = require('./DAOlowdb.js')
const url = require('url')

console.log("--- API IS STARTING ---")

// Quick HTTP server creation
var server = http.createServer(
    async function(request, answer)
    {
        const url_parts = url.parse(request.url, true).pathname //  /create
        if(request.method === 'GET')
        {
            if(url_parts === '/pseudo' || url_parts === '/pseudo/')
            {
                const data = await my_lowdb.getPseudo()
                answer.end(JSON.stringify(data))
            }
            else if(url_parts === '/create' || url_parts === '/create/')  // CHECK IS THE PSEUDO ALREADY EXIST
            {   
                const url_query = url.parse(request.url, true).query  //  url query:  [Object: null prototype] { pseudo: 'simon', pass: '1234' }
                const checked_pseudo = url_query["pseudo"]
                console.log("CHECK FOR :", checked_pseudo);

                const userList = await my_lowdb.doPseudoExists(checked_pseudo)
                console.log(JSON.stringify(userList))
                if (userList == null){
                    my_lowdb.newUser(checked_pseudo, url_query["pass"])
                    answer.end("done")
                }
                else{
                    answer.end("Nickname not avaible")                    
                }
            }
        }
    })
server.listen(8080);

console.log("--- API IS NOW RUNNING ---")