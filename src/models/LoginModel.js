const mongoose = require('mongoose') 
const validator = require('validator') //Validador de email - Instalado com npm i validator 
const bcryptjs = require('bcryptjs') //Cripografia de senha - Instalado com npm i bcryptjs

const LoginSchema = new mongoose.Schema({      //Cria o esquema de dados do BD
    email: {type: String, required: true},
    password: {type: String, required: true}
})

const LoginModel = mongoose.model('Login', LoginSchema) //Cria a base de dados 'Login' com as propriedades do Schema 

class Login {            //Cria a classe Login
    constructor(body) {
        this.body = body
        this.erros = []
        this.user = null
    }

    async login() {
        this.valida()
        if(this.erros.length >0) return
        this.user = await LoginModel.findOne({email: this.body.email})

        if(!this.user) {
            this.erros.push('Usuário não cadastrado')
            return
        }

        if(!bcryptjs.compareSync(this.body.password, this.user.password)) {
            this.erros.push('Senha inválida')
            this.user = null
            return
        }
    }

    async register() { //É chamada la no Controller 

        this.valida() //Valida os dados do formulário
        if(this.erros.length >0) return

        await this.userExists() //Valida se o email já está cadastrado
        if(this.erros.length >0) return

        const salt = bcryptjs.genSaltSync() //Encripta a senha
        this.body.password = bcryptjs.hashSync(this.body.password, salt)

        this.user = await LoginModel.create(this.body) //Cria o dado no BD          

    }

    async userExists(){ //Valida se o email já está cadastrado
       this.user = await LoginModel.findOne({email: this.body.email})

       if(this.user) this.erros.push('Usuário já cadastrado')

    }

    valida() {
        //dados
        this.cleanUp()
        //email
        if(!validator.isEmail(this.body.email)) this.erros.push('E-mail inválido')
        //senha
       if(this.body.password.length < 3 || this.body.password.length > 20){
          this.erros.push('A senha precisa ter entre 3 e 20 caracteres')
        }
    }
    cleanUp() { //Vai limpar os dados
        for(const key in this.body) { //pega cada valor do formulário
          if(typeof this.body[key] !== 'string') { //Se não foi string
            this.body[key]='' //Transforma em vazia
          }
        }
        this.body = {   //vai tirar tudo aquilo que não precisa do formulário (no caso o token)
            email: this.body.email,
            password: this.body.password
        }

    }

}

module.exports = Login //Exporta a Classe Login