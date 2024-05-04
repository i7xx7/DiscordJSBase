const db =  require('mongoose')

let userSchema = new db.Schema({
    idU: { type: Number },
    idS: { type: Number }
})

module.exports = db.model("Users", userSchema)