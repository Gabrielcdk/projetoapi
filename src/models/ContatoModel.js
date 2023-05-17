const mongoose = require('mongoose') //Chama o mongoose
const validator = require('validator')


const ContatoSchema = new mongoose.Schema({      //Define as propriedades dos dados que serão inseridos
    nome: {type: String, required: true},
    sobrenome: {type: String, required: false, default: ''},
    email: {type: String, required: false, default: ''},
    telefone: {type: String, required: false, default: ''},
    criadoEm: {type: Date, default: Date.now}
    
})

const ContatoModel = mongoose.model('Contato', ContatoSchema) //Cria a base de dados 'Home' com as propriedades do Schema 

function Contato(body) {
    this.body = body
    this.erros = []
    this.contato = null
}

Contato.prototype.register = async function() {
    this.valida()

    if(this.erros.length > 0) return
    this.contato = await ContatoModel.create(this.body)
}

Contato.prototype.valida = function() {
    //dados
    this.cleanUp()
    //email
    if(this.body.email && !validator.isEmail(this.body.email)) this.erros.push('E-mail inválido')
    //
    if(!this.body.nome) this.erros.push('Nome é um campo obrigatório')

    if(!this.body.telefone && !this.body.email) this.erros.push('Pelo menos um contato precisa ser enviado: email ou telefone')
   
 
}

Contato.prototype.cleanUp = function() { //Vai limpar os dados
    for(const key in this.body) { //pega cada valor do formulário
      if(typeof this.body[key] !== 'string') { //Se não foi string
        this.body[key]='' //Transforma em vazia
      }
    }
    this.body = {   //vai tirar tudo aquilo que não precisa do formulário (no caso o token)
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone
    }

}


Contato.prototype.edit = async function(id) {
    if(typeof id !== 'string') return
    this.valida()
    if(this.erros.length > 0) return
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true })

}

// Métodos estáticos (não usa o prototype nem this)

Contato.buscaPorId = async function(id) {
    if(typeof id !== 'string' )return
    const contato = await ContatoModel.findById(id)
    return contato
}

Contato.buscaContatos = async function() {
    const contatos = await ContatoModel.find() //Pode usar filtros {email}
     .sort({criadoEm: -1 }) //-1 ordem decrescente 1 ordem crescente
    return contatos
}

Contato.delete = async function(id) {
    if(typeof id !== 'string' )return
    const contato = await ContatoModel.findOneAndDelete({_id: id}) 
    return contato
}


module.exports = Contato 