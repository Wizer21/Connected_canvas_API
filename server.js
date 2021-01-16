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
            console.log('IN IN IN ' + url_parts);
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

                const name = url_query["name"]                
                if (name in ROOMS){
                    console.log("Name not avaible");
                    answer.end("Name not avaible") 
                    return
                }
                const password = url_query["pass"]
                
                let newRoom = {
                    Password: password, 
                    Layers: {}
                }

                ROOMS[name] = newRoom
                console.log(ROOMS);
                answer.end("done")    
            }
            else if (url_parts === '/roomlistpass' || url_parts === '/roomlistpass/')
            {
                let passwordList = {}
                for (roomName in ROOMS){
                    passwordList[roomName] = ROOMS[roomName]["Password"].toString()
                }
                
                answer.end(JSON.stringify(passwordList))
            }
            else if (url_parts === '/roomlist' || url_parts === '/roomlist/')
            {
                answer.end(JSON.stringify(ROOMS))
            }
            else if (url_parts === '/leaveroom' || url_parts === '/leaveroom/')
            {
                const url_query = url.parse(request.url, true).query  
                let room = url_query["room"]
                let user = url_query["user"]

                if (user in ROOMS[room]["Layers"]){
                    delete ROOMS[room]["Layers"][user]
                    console.log(user + " leaved " + room);
                    answer.end(user + " leaved " + room)
                }
                else{
                    answer.writeHead(404)
                    answer.end(user + " not found")                    
                }                
                if (Object.keys(ROOMS[room]["Layers"]).length == 0){
                    delete ROOMS[room]
                }
            }
        }
        else if (request.method === 'POST'){
            if(url_parts === '/updateroom' || url_parts === '/updateroom/') // UPDATE ROOM --
            {   
                const url_query = url.parse(request.url, true).query 
                const room = url_query["room"]
                const user = url_query["user"]
                const iterator = url_query["it"]
                console.log("UPDATE " + room);
                let newMap = ""
                request.on('data', function (chunk) {
                    newMap += chunk;
                });

                request.on('end', function () {
                    if (room in ROOMS){ // IF ROOM EXIST
                        if (ROOMS[room]["Layers"][user]){ // IF PLAYER EXIST 
                            if (ROOMS[room]["Layers"][user]["iterator"] !== iterator){  // IF HIS ITERATOR CHANGED                                         
                                ROOMS[room]["Layers"][user]["map"] = newMap // UPDATE MAP 
                                ROOMS[room]["Layers"][user]["iterator"] = iterator // UPDATE ITERATOR 
                            }   
                        }
                        else{
                            let userCanvas = {
                                map: newMap,
                                iterator: iterator
                            }                                        
                            ROOMS[room]["Layers"][user] = userCanvas // CREATE HIS MAP
                        }             
                        answer.writeHead(200);
                        answer.end(JSON.stringify(ROOMS[room]["Layers"]))
                    }
                    else{
                        answer.writeHead(404);
                        answer.end("Room not found")                    
                    }
                });

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