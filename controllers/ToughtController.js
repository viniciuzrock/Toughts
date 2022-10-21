// const { RAW } = require('sequelize/types/query-types')
const Tought = require('../models/Tought')
const User = require('../models/User')
const { Op } = require('sequelize')//Habilita o uso de operadores

module.exports = class ToughtsController {
    static async showToughts(req, res){
        
        let search = '' //configurando campo de busca
        //'search' pois é termo usado na URL ao fazer o submit no form
        if(req.query.search){
            search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order === 'old'){
            order = 'ASC'
        } else {
            order = 'DESC'
        }



        const toughtsData = await Tought.findAll({//busca todos os dados do banco
            include: User,//Busca o usuário vinculado a essas informações
            where:{
                title: {//uso do operador like
                    [Op.like]: `%${search}%` //recebe o que foi digitado na campo de pesquisa
                }
            },
            order: [['createdAt', order]]
        })
//                                                         1 - atriuto que todos os objetos tem
        const toughts = toughtsData.map((result)=>result.get({plain:true}))
//                                                         2 - Junta todos no mesmo array
        let toughtsQty = toughts.length
        if(toughtsQty === 0){
            toughtsQty = false
        }
        res.render('toughts/home', {toughts, search, toughtsQty})
    }

    static async dashboard(req,res){
        const userId = req.session.userId
        const user = await User.findOne({
            where: {
                id: userId,
            },
            include: Tought, //Ao buscar o usuário, e informações do model Toughts criadas por ele
            plain: true

        })
        // check if user exists
        if(!user){
            res.redirect('/login')
        }
        const toughts = user.Toughts.map((result)=> result.dataValues)        
        let emptyToughts = false

        if(toughts.length === 0){
            emptyToughts = true
        }
        res.render('toughts/dashboard', {toughts, emptyToughts})
    }

    static createTought(req, res){
        res.render('toughts/create')
    }

    static async createToughtSave(req, res){
        const tought = {
            title: req.body.title,
            UserId: req.session.userId,
        }
        try {
            await Tought.create(tought)
            req.flash('message', 'Pensamento criado com sucesso!')
            req.session.save(()=>{
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log(error);
        }
    }

    static async removeTought(req, res){
        const id = req.body.id
        const UserId = req.session.userId
        console.log(id)
        console.log(UserId)
        try {
            await Tought.destroy({
                where:{
                    id: id,
                    UserId: UserId,
                }
            })           
            req.flash('message','Pensamento removido com sucesso!')
            req.session.save(()=>{
                res.redirect('/toughts/dashboard')
            })

        } catch (error) {
            console.log(error);
        }

    }

    static async updateTought(req, res){
        const id = req.params.id
        const tought = await Tought.findOne({
            where: {
                id:id
            },
            raw: true
        })
        res.render('toughts/edit',{ tought })
    }

    static async updateToughtSave(req, res){
        const id = req.body.id
        const tought = {
            title: req.body.title,
        }
        console.log('VVVVVVVVVVVV')
        try {            
            //                  Objeto que será atualizado no banco 
            await Tought.update(tought,{
                where:{
                    id: id
                }
            })
            console.log('AAAAAAA')
            req.flash('message', 'Pensamento atualizado com sucesso!')
            req.session.save(()=>{
                res.redirect('/toughts/dashboard')
            })
        } catch (error) {
            console.log('[ERRO]: '+error)
        }
    }
}