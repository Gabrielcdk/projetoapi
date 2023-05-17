//INICIAR O EXPRESS
const express = require('express')
const app = express()

//CONEXÃO COM O BANCO DE DADOS(BD) - MONGOOSE
require('dotenv').config() //Chama o dotenv(.env) que vai guardar as senhas
const mongoose = require('mongoose')
mongoose.connect(process.env.connectionString) //conecta ao BD com a senha do .env
.then(()=> {
    app.emit('ready') //Flag que demonstra que banco de dados foi conectado
    console.log('Conexão com banco de dados com SUCESSO')
})
.catch(e=> console.log(e))

//CONEXÃO COM SESSION
//SERVE PARA GUARDAR DADOS DURANTE UM TEMPO PARA ACESSA-LOS MAIS RAPIDAMENTE
const session = require('express-session');//Cria a sessão
const MongoStore = require('connect-mongo');//Onde vai ficar as sessões
const flash = require('connect-flash'); //Mensagens que se 'destroem' quando acessadas


const sessionOptions = session({
    secret: 'PODEMOS ESCREVER QUALQUER COISA',
    store: MongoStore.create({ mongoUrl: process.env.connectionString }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, //7 dias a sessão
      httpOnly: true
    }
  });
  app.use(sessionOptions);
  app.use(flash());
  //CRIAMOS UM TESTE NO HOMECONTROLLER QUE VAI SALVAR OS DADOS DA SESSÃO POR 7 DIAS

//CRIA AS ROTAS DO SISTEMA
const routes = require('./routes')
const path = require('path') //Pega os caminhos dos arquivos ou diretório

//INSTALANDO O HELMET E CSRF (SÃO RELACIONADOS À SEGURANÇA) - USAR SOMENTE EM PRODUÇÃO
const { checkCsrfError, csrfMiddleware, middlewareGlobal} = require('./src/middlewares/middleware')
const helmet = require('helmet')
const csrf = require('csurf')
app.use(helmet())

//OUTRAS EXTENÇÕES IMPORTANTES DO EXPRESS
app.use(express.urlencoded({extended: true})) //Usado para ler formulários,
app.use(express.json())//Usado para ler jsons

app.use(express.static(path.resolve(__dirname, 'public'))) //Usado para criar conteúdos estáticos como imagens, css, etc que podem ser acessado pela / de endereço http://localhost:3000/teste.txt.

//USADO VARA USAR AS VIEWS
app.set('views', path.resolve(__dirname, 'src', 'views')) //Usado para ver páginas pode usar tb ('./src/views'), mas é mais seguro usar o path
app.set('view engine', 'ejs') //Tem que instalar via terminal npm install ejs


app.use(csrf()) //CHAMA O CSRF 
//NOSSOS PRÓPRIOS MIDDLEWARES
app.use(middlewareGlobal);
app.use(checkCsrfError)
app.use(csrfMiddleware)
app.use(routes)

/*app.use('/frontend/assets/', express.static(path.join(__dirname, 'frontend/assets'), {
  headers: {
    'Content-Type': 'text/javascript'
  }
}))
*/

app.on('ready', () => { //Só vai iniciar o servidor depois de conectar ao BD
    app.listen(3000, () => {
    console.log('Server executado na porta 3000')
    console.log('Acesse: http://localhost:3000');
    })})


//PARA INSTALAR HELMET E CSRF
//npm i helmet 
//npm i csurf