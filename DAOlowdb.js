const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// Set some defaults (required if your JSON file is empty)
db.defaults({
  "users": [
    {
      "pseudo": "defautl_user",
      "password": "0000",
      "id": 1,
      "friends": []
    }
  ],
      "count": 2
  }).write()

exports.getPseudo = function getPseudo(){   
    return db.get('pseudo')
            .value()        
}

exports.getUserFromName = function getUserFromName(newPseudo){   
    return db.get('users')
          .find({pseudo: newPseudo})
          .value()
}

exports.newUser = function newUser(newPseudo, newPassword){   
  var id = db.get('count')
            .value()

  db.get('users')
    .push({"pseudo": newPseudo, "password": newPassword, "id": id, "friends": []})
    .value()
      
  db.update('count', n => n + 1).write()
}

exports.login = function login(newPseudo, newPassword){

}