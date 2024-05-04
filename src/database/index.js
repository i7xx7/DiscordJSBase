const db =  require('mongoose')
require('dotenv').config()

try {
    db.connect(process.env.MONGODB_URL)
    console.log('[DATABASE] Conexão realizada com exitô!')
} catch (err){
    console.log(`[DATABASE] Houve um erro na conexão: ${err}`)
}