const User = require('../models/User')
const bcrypt = require('bcryptjs')//
const { EmptyResultError } = require('sequelize')

module.exports = class AuthController {
    static login(req, res){
        res.render('auth/login')
    }

    static register(req, res){
        res.render('auth/register')
    }

    static async registerPost(req, res){
        try {
            
            const {name, email, password, confirmpassword} = req.body
            //valida senha
            if(password != confirmpassword){
                //retorno para o front -> similar ao res.render
                //Criar elemento HTML para exibição das mensagens (main.handlebars)
                //     identificador   mensagem
                req.flash('message','Senhas não conferem, tente novamente!')
                res.render('auth/register')
                console.log('ERRO SENHA')
                return
            }
            
            //checando se user existe
            const checkIfUserExists = await User.findOne({where: {email: email}})

            if(checkIfUserExists){
                req.flash('message','O E-mail informado já está em uso!')
                res.render('auth/register')
            return
            }
            //Gera o hash
            const salt = bcrypt.genSaltSync(10)
            //encriptação
            const hashedPassword = bcrypt.hashSync(password, salt)
            console.log('PASSS'+password)
            console.log('SAALLT'+salt)
            console.log('HASSSHH'+hashedPassword)
            const user = {
                name,
                email,
                password: hashedPassword
            }
            try {
                const createdUser = await User.create(user)

                //inicia sessao
                req.session.userId = createdUser.id 


                req.flash('message','Cadastro realizado com sucesso!')
                req.session.save(()=>{
                    res.redirect('/')
                })
            } catch (error) {
                
            }
        } catch (error) {
                console.log('ERRO FORM: '+error)
        }
    }
}