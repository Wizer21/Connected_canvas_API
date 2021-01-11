// Imports
const http = require('http')
const my_lowdb = require('./DAOlowdb.js')
const url = require('url')

console.log("--- API IS STARTING ---")
let ONLINE_USERS = []
let ROOMS = {}

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
  
                    login(checked_pseudo)
                }
                else{
                    answer.end("false")                
                }
            }
            else if (url_parts === '/logout' || url_parts === '/logout/') // LOGOUT --
            {
                const url_query = url.parse(request.url, true).query  
                const checked_pseudo = url_query["pseudo"]

                logout(checked_pseudo)
                answer.end(checked_pseudo, " logged out")    
            }
            else if (url_parts === '/friendlist' || url_parts === '/friendlist/') // FRIENDLIST --
            {
                const url_query = url.parse(request.url, true).query  
                const checked_pseudo = url_query["pseudo"]

                const user = my_lowdb.getUserFromName(checked_pseudo)
                answer.end(user["friends"].toString())    
            }
            else if (url_parts === '/onlineusers' || url_parts === '/onlineusers/') // ONLINEUSERS --
            {
                console.log("new request");
                console.log(ONLINE_USERS);
                answer.end(ONLINE_USERS.toString())    
            }
            else if (url_parts === '/createroom' || url_parts === '/createroom/') // CREATEROOM --
            {
                const url_query = url.parse(request.url, true).query  

                console.log("IN");
                console.log(url_query);
                const name = url_query["name"]                
                if (name in ROOMS){
                    console.log("Name not avaible");
                    answer.end("Name not avaible") 
                    return
                }
                const isLock = url_query["lock"]
                const password = url_query["pass"]
                
                let newRoom = {
                    isPublic: isLock,
                    Password: password, 
                    Layers: []
                }

                ROOMS[name] = newRoom
                console.log(ROOMS);
                answer.end("done")    
            }
        }
    })

server.listen(8080);

function login(userName){
    if (!ONLINE_USERS.includes(userName)){
        ONLINE_USERS.push(userName)
        console.log("LOGIN " + userName);
    }
}
function logout(userName){
    if (ONLINE_USERS.includes(userName)){
        for( var i = 0; i < ONLINE_USERS.length; i++){     
            if (ONLINE_USERS[i] === userName) {         
                ONLINE_USERS.splice(i, 1); 
                console.log("LOGOUT " + userName);
                return
            }        
        }        
    }
}
console.log("--- API IS NOW RUNNING ---")