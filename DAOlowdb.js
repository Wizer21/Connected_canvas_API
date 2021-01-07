const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({id: 0, pseudo: "new_user"}).write()
    
// Increment count
db.update('id', n => n + 1).write()

exports.getPseudo = function getPseudo(){   
    return db.get('pseudo')
            .value()        
}