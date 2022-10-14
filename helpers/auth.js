module.exports.checkAuth = function(req, res, next ){
 
    const userId = req.sesion.userId

    if(!userId){
        res.redirec('/login')
    }

    next()
}