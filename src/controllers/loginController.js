const Login = require('../models/LoginModel')//Pega a classe Login do model

exports.index = (req, res) => {
    if (req.session.user) return res.render('login-logado')
    res.render('login') //Mostra a página
}
exports.register = async function(req, res) {
    try{
    const login = new Login(req.body) //Vai mandar os dados do formulário
    await login.register() //chama a função registro

    if(login.erros.length > 0) { //Busca por erros para exibir na tela
        req.flash('erros', login.erros) //Cria mensagens flash de erros
        req.session.save(function(){ //Salva a sessão
            return res.redirect('/login/index') //Volta para página de login
        })
        return
    }
    req.flash('success', 'Seu usuário foi criado com sucesso') // Cria mensagem de sucesso
        req.session.save(function(){
            return res.redirect('/login/index')
        })
    

    }catch(e) {
        console.log(e);
        res.render('404') //Se houver erros manda para a página 404
    }   
    
}

exports.login = async function(req, res) {
    try{
    const login = new Login(req.body) //Vai mandar os dados do formulário
    await login.login() //chama a função registro

    if(login.erros.length > 0) { //Busca por erros para exibir na tela
        req.flash('erros', login.erros) //Cria mensagens flash de erros
        req.session.save(function(){ //Salva a sessão
            return res.redirect('/login/index') //Volta para página de login
        })
        return
    }
    req.flash('success', 'Você logou com sucesso') // Cria mensagem de sucesso
        req.session.user = login.user
        req.session.save(function(){
            return res.redirect('/')
        })
    

    }catch(e) {
        console.log(e);
        res.render('404') //Se houver erros manda para a página 404
    }   
    
}

exports.logout = function(req, res) {      
    
    req.session.destroy()
    res.redirect('/')
    
     
    
    
    
}