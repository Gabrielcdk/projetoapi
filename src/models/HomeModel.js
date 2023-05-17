const mongoose = require('mongoose') //Chama o mongoose
const HomeSchema = new mongoose.Schema({      //Define as propriedades dos dados que serão inseridos
    titulo: {type: String, required: true}, //Pode ser tipo string, number, bolean, etc
    descricao: String
})

const HomeModel = mongoose.model('Home', HomeSchema) //Cria a base de dados 'Home' com as propriedades do Schema 

module.exports = HomeModel //Exporta o modelo nesse caso para teste exportou poara o controller home