module.exports.checkAuth = function(req, res, next ){
 
    const userId = req.session.userId
    //Protegendo as rotas com autenticação
    if(!userId){
        res.redirect('/login')
    }

    next()
}