
// Importando os módulos necessárioss
const express = require('express'); // Importando o Express
const bodyParser = require('body-parser'); // Importando o Body Parser
const axios = require('axios'); // Importando o Axios
const multer = require('multer'); // Importando o Multer
const session = require("express-session"); // Importando o Express Session
const { Op } = require('sequelize'); // Importando o operador Sequelize
const { raw } = require('mysql2'); // Importando o Raw MySQL2
const { where } = require('sequelize'); // Importando o Where Sequelize

// Iniciando o Express
const app = express(); 
exports.app = app;

// Configurando o Body Parser para lidar com dados codificados no formato URL
app.use(bodyParser.urlencoded({ extended: false }));

// Configurando o Express para utilizar EJS como mecanismo de visualização
app.set('view engine', 'ejs');

// Importando arquivos de banco de dados

const DB = require('./ServerModules/DatabaseModels/DatabaseModels')
const connection = require('./Database/database');


// Configurando o Express para servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Configurando o armazenamento do Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
exports.upload = upload;

// Criando uma instância de roteador do Express
const router = express.Router();

//Criando uma sessão
app.use(session({
    secret: 'Cuidadoso',//É uma string que representa a chave secreta usada para assinar os cookies de sessão. Essa chave é usada para criptografar e descriptografar os dados armazenados na sessão, garantindo que apenas o servidor possa ler e escrever os dados da sessão. A chave secreta deve ser uma sequência de caracteres difícil de ser adivinhada e deve ser mantida em sigilo.
    resave: false, //É um valor booleano que indica se a sessão deve ser salva no servidor mesmo que não tenha sido modificada durante a requisição. Quando resave é false, a sessão só será salva se os dados da sessão foram modificados. Isso ajuda a evitar gravações desnecessárias no servidor e melhora a eficiência.
    saveUninitialized: true,//É um valor booleano que indica se a sessão deve ser salva no servidor, mesmo que não tenha sido inicializada. Quando saveUninitialized é true, a sessão será salva mesmo se ainda não tiver sido modificada, garantindo que uma sessão vazia seja criada para cada cliente. Isso é útil para evitar a criação de cookies desnecessários em algumas situações, mas você pode definir como false para economizar recursos se não precisar de sessões vazias.
    cookie: {
        expires: false //  É um objeto que permite definir configurações específicas para o cookie da sessão. Neste exemplo, estamos usando cookie.expires: false para fazer com que o cookie expire quando o navegador for fechado. Quando o navegador é fechado, o cookie é excluído e, portanto, a sessão também é invalidada. Se não definirmos essa propriedade ou atribuirmos uma data/hora de expiração, o cookie será armazenado em uma sessão de navegador (que geralmente dura até o usuário fechar o navegador) e a sessão permanecerá ativa mesmo que o usuário navegue para outras páginas e volte ao site.
    }
}));

const mesesDoAno = {
    1: { nome: "Janeiro", dias: 31 },
    2: { nome: "Fevereiro", dias: 29 }, // Pode atualizar este valor para 29 em anos bissextos
    3: { nome: "Março", dias: 31 },
    4: { nome: "Abril", dias: 30 },
    5: { nome: "Maio", dias: 31 },
    6: { nome: "Junho", dias: 30 },
    7: { nome: "Julho", dias: 31 },
    8: { nome: "Agosto", dias: 31 },
    9: { nome: "Setembro", dias: 30 },
    10: { nome: "Outubro", dias: 31 },
    11: { nome: "Novembro", dias: 30 },
    12: { nome: "Dezembro", dias: 31 },
};
exports.mesesDoAno = mesesDoAno;

// Conectando ao banco de dados


connection .authenticate()
    .then(() => {
        console.log("Database connected with SUCCESS!")
    })
    .catch((msgErr) => {
        console.log("Datatabase connexion ERROR: ")
    })

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.userName = req.session.userName || null;
    res.locals.userId = req.session.userId || null;
    res.locals.token = req.session.token || null;
    res.locals.TipoConta = req.session.TipoConta
    next();
});

async function testartoken(req, res, next) {
    if (req.session.userId) {
        let usuario = req.session.userId
        let token = req.session.token

        let user = await DB.Cadastros.findOne({
            where: { id: usuario }
        })

        if (user != undefined) {

            if (user.Token == token) {
                next();
            } else { res.redirect("/login") }

        } else { res.redirect("/login") }

    } else

        res.redirect("/login")
}
exports.testartoken = testartoken;



const NodeRoutes = require('./ServerModules/Dependences/RoutesDependences')

//ROTAS

app.get('/login', NodeRoutes.Login)

app.get('/logout', NodeRoutes.Logout)

app.get('/', NodeRoutes.Home)

app.get('/perfil/:id', NodeRoutes.ProfilePage)

app.post('/validarlogin', NodeRoutes.AuthLogin)

app.post ('/cadastrocuidadoso', NodeRoutes.ProfessionalRegister)

app.get('/contrate',  NodeRoutes.ProfessionalListing)

app.get('/contratar', testartoken,  NodeRoutes.HiringProfessional)

app.post('/EnviarMensagem', testartoken, NodeRoutes.SendMensage)

app.post('/pago', testartoken, NodeRoutes.PaidRequest)

app.get('/servico/:id', testartoken, NodeRoutes.ServiceDetail)

app.get('/Pagamento/:idservico', testartoken, NodeRoutes.ServicePayment )

app.get('/aceitarsolicitacao', testartoken, NodeRoutes.AcceptRequest)

app.post('/solicitar', testartoken, NodeRoutes.ServiceSolicition)

app.get('/MeusServicos', testartoken, NodeRoutes.MyServices )

app.get('/Historico', testartoken, NodeRoutes.HistoricServices)

app.post('/deletarpubli', testartoken, NodeRoutes.DeletePublication)

app.post('/negarsolicitacao', testartoken, NodeRoutes.DenyRequest)

app.post('/UploadFTPerfil', testartoken, NodeRoutes.UploadPhotoProfile)

app.post('/uploadpost', testartoken, NodeRoutes.NewPost)

app.post('/updatepost', testartoken, NodeRoutes.UpdatePost)

app.post('/updatedescri', testartoken, NodeRoutes.UpdateDescription)

app.post('/salvarendereco', testartoken, NodeRoutes.SaveNewAddress)

app.post('/AprovarCuidador', testartoken, NodeRoutes.ApproveProfessional)

app.post('/NovaDiaria', testartoken, NodeRoutes.NewValueDaily)

app.get('/CadastroValor', NodeRoutes.UndefinedRouteA)

app.get('/CadastroValor1', NodeRoutes.UndefinedRouteA)





//Aqui eu estou declarando a porta em que esta rodando meu servidor

app.listen(80, function (erro) {
    if (erro) {
        console.log("Ocorreu um erro ao iniciar o Servidor!")
    } else {
        console.log("Servidor iniciado com sucesso")
    }
})


