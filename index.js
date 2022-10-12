const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')
const app = express()
const conn = require('./db/conn')
// const { Store } = require('express-session')
//Models
const Tought = require('./models/Tought')
const User = require('./models/User')
// import Routes
const toughtsRoutes = require('./routes/toughtsRoutes')
const authRoutes = require('./routes/authRoutes')
// const { ppid } = require('process')
//import controller
const ToughtsController = require('./controllers/ToughtController')
//template
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
//receber resposta do form
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())
//session middleware -> informa onde o express salvará as seções
app.use(
    session({
        name:'session',
        secret:'nosso_secret',
        resave: false, //Se cair a conexao (por tempo limite, por exemplo) irá desconectar
        saveUninitialized: false, //Salva sessões não iniciadas, por isso está 'false'
        store: new FileStore({ //salva seções em arquivos
            logFn: function(){ //função de logs    
            },//           aponta o diretório
            path: require('path').join(
                //informa um diretório temporário
                require('os').tmpdir(), 'sessions' //--> no caso, o 'sessions'
                )
        }),
        cookie: {
            secure: false,
            maxAge: 360000, //tempo máximo de acesso
            expires:new Date(Date.now() + 360000), //tempo para expirar
            httpOnly: true, //por ser local, sem certificado, deve-se usar o http ao invés do https
        }
    })
)
//flash messages -> Feedback do sistema de acordo com cada ação
app.use(flash())
//public path -> Assets do projeto (imagens, CSS e etc)
app.use(express.static('public'))
//sessão de resposta -> Lógica para o sistema dar andamento ou não dependendo da ação realizada
app.use((req, res, next)=>{
    if(req.session.userId){
        res.locals.session = req.session //-> Caso haja um userId (sessão de usuário), é ela que será usada.
    }
    next()
})
//Routes
app.use('/toughts', toughtsRoutes)
app.use('/', authRoutes)
app.get('/', ToughtsController.showToughts)

//servidor
conn.sync({
//    force: true//Forçou a atualização das tabelas do banco após a criação do relacionamento nos models
}).then(()=>{
    app.listen(3000)
}).catch((e)=>{
    console.log(e)
})