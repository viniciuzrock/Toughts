const User = require('../models/User')
const bcrypt = require('bcryptjs')//
const { where } = require('sequelize')
// const { EmptyResultError } = require('sequelize')

module.exports = class AuthController {
    static login(req, res){
        res.render('auth/login')
    }

    static async loginPost(req, res){

        const {email, password } = req.body
        
        //find user
        const user = await User.findOne({where: {email: email}})
        //check e-mail
        if(!user){
            req.flash('message','Usuário não encontrado, tente novamente!')
            res.render('auth/login')

            return
        }
        //check password
        const passwordMatch = bcrypt.compareSync(password, user.password)

        if(!passwordMatch){
            req.flash('message','Senha inválida, tente novamente!')
            res.render('auth/login')

            return
        }

        req.session.userId = user.id 

        req.flash('message','Autenticação realizada com sucesso!')
        req.session.save(()=>{
            res.redirect('/')
        })
        // res.render('auth/login')
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

    static logout(req, res){

        req.session.destroy()
        res.redirect('/login')

    }
}