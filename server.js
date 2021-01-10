// Imports
const http = require('http')
const my_lowdb = require('./DAOlowdb.js')
const url = require('url')

console.log("--- API IS STARTING ---")
let ONLINE_USERS = []

// Quick HTTP server creation
var server = http.createServer(
    async function(request, answer)
    {
        const url_parts = url.parse(request.url, true).pathname //  /create
        if(request.method === 'GET')
        {
            if(url_parts === '/create' || url_parts === '/create/') // CREATE ACCOUNT --
            {   
                const url_query = url.parse(request.url, true).query  //  url query:  [Object: null prototype] { pseudo: 'simon', pass: '1234' }
                const checked_pseudo = url_query["pseudo"]

                const userDetails = await my_lowdb.getUserFromName(checked_pseudo)
                if (userDetails == null){
                    my_lowdb.newUser(checked_pseudo, url_query["pass"])
                    answer.end("done")
                                   
                    login(checked_pseudo)
                }
                else{
                    answer.end("Nickname not avaible")                    
                }
            }
            else if (url_parts === '/login' || url_parts === '/login/') // LOGIN -- 
            { 
                const url_query = url.parse(request.url, true).query  
                const checked_pseudo = url_query["pseudo"]

                const userDetails = await my_lowdb.getUserFromName(checked_pseudo)
                if (userDetails != null && userDetails['password'] === url_query["pass"]){
                    answer.end("true") 

                    console.log("CONNECTION SUCCES")    
                    login(checked_pseudo)
                }
                else{
                    answer.end("false")    
                    console.log("CONNECTION FAILED")                
                }
            }
            else if (url_parts === '/logout' || url_parts === '/logout/') // LOGOUT --
            {
                const url_query = url.parse(request.url, true).query  
                const checked_pseudo = url_query["pseudo"]

                console.log("LOGOUT GET ", checked_pseudo)
                logout(checked_pseudo)
                answer.end(checked_pseudo, " out")    
            }
            else if (url_parts === '/showonline' || url_parts === '/showonline/') // LOGOUT --
            {
                answer.end("User connected: " + ONLINE_USERS)    
            }
        }
    })
server.listen(8080);

function login(userName){
    if (!ONLINE_USERS.includes(userName)){
        ONLINE_USERS.push(userName)
        console.log("NEW CONNECTION", ONLINE_USERS);
    }
}
function logout(userName){
    if (ONLINE_USERS.includes(userName)){
        for( var i = 0; i < ONLINE_USERS.length; i++){     
            if (ONLINE_USERS[i] === userName) {         
                ONLINE_USERS.splice(i, 1); 
                console.log(userName, " DISCONNECTED");
                console.log(ONLINE_USERS);
                return
            }
        
        }
        
    }
}
console.log("--- API IS NOW RUNNING ---")