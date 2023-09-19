
const express = require('express') // aqui estamos importando o express 
const app = express(); // Iniciando o exepress

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
const connection = require('./database/database')
const Cadastros = require('./database/Cadastros')
const Perfil = require('./database/Perfil')
const Posts = require('./database/Posts')
app.use(express.static('public'))
const axios = require('axios');

const multer = require('multer');
const router = express.Router();

const session = require("express-session")
const bcrypt= require('bcryptjs')
const { raw } = require('mysql2');
const { where } = require('sequelize');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// https://servicodados.ibge.gov.br/api/v1/localidades/estados/mg/distritos
 

app.use(session({
    secret: 'fernando',//É uma string que representa a chave secreta usada para assinar os cookies de sessão. Essa chave é usada para criptografar e descriptografar os dados armazenados na sessão, garantindo que apenas o servidor possa ler e escrever os dados da sessão. A chave secreta deve ser uma sequência de caracteres difícil de ser adivinhada e deve ser mantida em sigilo.
    resave: false, //É um valor booleano que indica se a sessão deve ser salva no servidor mesmo que não tenha sido modificada durante a requisição. Quando resave é false, a sessão só será salva se os dados da sessão foram modificados. Isso ajuda a evitar gravações desnecessárias no servidor e melhora a eficiência.
    saveUninitialized: true,//É um valor booleano que indica se a sessão deve ser salva no servidor, mesmo que não tenha sido inicializada. Quando saveUninitialized é true, a sessão será salva mesmo se ainda não tiver sido modificada, garantindo que uma sessão vazia seja criada para cada cliente. Isso é útil para evitar a criação de cookies desnecessários em algumas situações, mas você pode definir como false para economizar recursos se não precisar de sessões vazias.
    cookie: {
        expires: false //  É um objeto que permite definir configurações específicas para o cookie da sessão. Neste exemplo, estamos usando cookie.expires: false para fazer com que o cookie expire quando o navegador for fechado. Quando o navegador é fechado, o cookie é excluído e, portanto, a sessão também é invalidada. Se não definirmos essa propriedade ou atribuirmos uma data/hora de expiração, o cookie será armazenado em uma sessão de navegador (que geralmente dura até o usuário fechar o navegador) e a sessão permanecerá ativa mesmo que o usuário navegue para outras páginas e volte ao site.
    }
}));


const mesesDoAno = {
    1: { nome: "Janeiro", dias: 31 },
    2: { nome: "Fevereiro", dias: 28 }, // Pode atualizar este valor para 29 em anos bissextos
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

connection
.authenticate()
.then(()=>{
    console.log("Conexão realizada com SUCESSO Com o Banco de Dados")
})
.catch((msgErr)=>{
    console.log("ERRO NA CONEXÃO COM O BANCO DE DADOS")
})




app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.userName = req.session.userName || null;
    res.locals.userId = req.session.userId || null;
    res.locals.token = req.session.token || null;
    next();
  });




  async function testartoken(req, res, next) {
    if (req.session.userId) {
        let usuario = req.session.userId
        let token = req.session.token
        console.log(token)
        
        let user = await Cadastros.findOne({
              where: { id : usuario } 
        })
          
            if (user != undefined) {

                console.log(token + ' ------------------------ '+ user.Token)
              
                if (user.Token == token) {
                    console.log("DEU")
                    next();
                } else{ res.redirect("/login")}

            } else {res.redirect("/login")}
      
    } else
    
    res.redirect("/login")
}






app.get('/',(req, res) => {

    let logado = 'Não logado'
   





    Posts.findAll({limit: 9, order: [['id', 'DESC']],raw:true}).then(posts=>{
       
        res.render('index.ejs', {posts:posts}) 



    })
})

app.get('/login',(req, res) => {
    
     let loginvar = 0
    res.render('login.ejs', {loginvar:loginvar }) 
})

app.get('/contratar', testartoken,(req, res) => {
    
    let id = req.query.cuidadoso

    Cadastros.findOne({where:{id:id}}).then(contratado => {

  
    
   res.render('contratando', {contratado:contratado}) 

   
    })
})

app.get('/CadastroValor',(req, res) => {
    
    let loginvar = 1
    res.render('login.ejs', {loginvar:loginvar}) 
})

app.get('/CadastroValor1',(req, res) => {
    
    let loginvar = 2
    res.render('login.ejs', {loginvar:loginvar}) 
})

app.get('/Perfil',(req, res) => {

    

    Perfil.findAll().then(perfis =>{
        res.render('portfolio-details.ejs', {perfis:perfis,}) 
    })
    
}) 

app.post('/deletarpubli',(req, res) => {
    
let id = req.body.id
let cadastro = req.body.idperfil

Posts.destroy({where:{id:id}})

res.redirect(`/Perfil/${cadastro}`)

   
    
}) 




app.post('/validarlogin',(req, res) => {
    
    let email = req.body.email
    let senha = req.body.senha

   

    const salt = bcrypt.genSaltSync(10)
    
 
   
        Cadastros.findOne({where:{Email:email}}).then(cadastros => {

            if(cadastros){

            let testelogin = bcrypt.compareSync(senha, cadastros.Senha)
            if(cadastros && testelogin==true)
            {
                logado = cadastros.Nome
                
                let token = bcrypt.hashSync(email, salt)
               
                cadastros.update({Token : token}).then(console.log("ATUALIZOU"))
 
                req.session.isLoggedIn = true;
                req.session.userName = cadastros.Nome; // Substitua pelo nome real do usuário
                req.session.userId = cadastros.id; // Substitua pelo ID real do usuário
                req.session.token = cadastros.Token; // Substitua pelo ID real do usuário

                 console.log("LOGADO")
                 
            res.redirect('/')
            }
            else{
                console.log("Usuario Não encontrado")
            }
        }else{
            console.log("Usuario Não encontrado")
        }


        })  
    
})


app.post('/cadastrocuidadoso', (req, res) => {
  
  

    let imagemBuffer = require('./public/js/imgpadrao')
   
    let nomeCuidadoso = req.body.nome
    let email = req.body.email
    let senha = req.body.senha
    let cpf = req.body.cpf
    let confirmacaosenha = req.body.confirmacaosenha
    let formacao = req.body.formacao
    let datanascimento = req.body.datanascimento
    let genero = req.body.genero
    let celular = req.body.celular
    let descricao = `Olá, eu sou ${nomeCuidadoso}, e estou à sua inteira disposição para oferecer cuidados excepcionais`
    let imagemantecedentes = req.body.imagemantecedentes    
    let estado = req.body.estado
    let cidade = req.body.cidade
    let bairro = req.body.bairro
    let rua = req.body.rua
    let numero = req.body.numero
    let complemento = req.body.complemento
    let referencia = req.body.referencia
   


    const salt = bcrypt.genSaltSync(10) 
    let hash = bcrypt.hashSync(senha, salt)
    let tokenhash = bcrypt.hashSync(email, salt)

    

 
    
 
    Cadastros.findAll({where:{Email:email}, raw:true}).then(existencia => {

        if(existencia==null)
        {
            res.redirect('/')
        }
        else
        {
            if(senha == confirmacaosenha){

                if(estado == undefined){
                    console.log('Ta entrando')

                    Cadastros.create({
                        Nome:nomeCuidadoso, CPF:cpf, Email:email, TipoConta:'Cliente', Senha:hash, Token:tokenhash,  DataNacimento:datanascimento, Genero:genero,
                        Celular:celular, FotoPerfil:imagemBuffer
                    })
                    res.redirect('/')

                }
                else
                {
                    Cadastros.create({
                        Nome:nomeCuidadoso, CPF:cpf, Email:email,TipoConta:'CuidadosoAspirante', Senha:hash, Token:tokenhash, Formacao:formacao, DataNacimento:datanascimento, Genero:genero,
                        Celular:celular, FotoPerfil:imagemBuffer, BonsAntecedentes:imagemantecedentes, Estado:estado, Cidade:cidade, Bairro:bairro, Rua:rua,
                        Numero:numero, Complemento:complemento, Referencia:referencia, descricao:descricao
                    })
                    res.redirect('/')

                }

            

        }
        }


    })





    
})

app.get('/perfil/:id',(req, res) => {

    const dataAtual = new Date();
const numeroDoMesAtual = dataAtual.getMonth() + 1;


    
    let id = req.params.id
    
    Cadastros.findOne({where:{id:id}}).then(cadastro =>{

        if(cadastro)
        {
            
            Perfil.findOne({raw:true,where:{IDCadastro:id}}).then(retorno =>{  
                Posts.findAll({ order: [['id', 'DESC']],raw:true, where:{IDCadastro:id}}).then(posts=>{
    
                let diasagendados = 5
    
     
            res.render('portfolio-details.ejs', {cadastro:cadastro, retorno:retorno, diasagendados:diasagendados, posts:posts, agenda:mesesDoAno[numeroDoMesAtual]}) 
        
        
        
        })
        })

        }else{
            res.redirect('/')
        }
        
     
    }) 


    
})

app.get('/contrate',(req, res) => {

    let filtro = req.query.estado
    let cidade = req.query.cidade
    console.log(filtro)
    
    Perfil.findAll({raw:true}).then(fotos => {


        if(filtro){

            if(cidade){

                Cadastros.findAll({where:{TipoConta:'Cuidadoso', Estado:filtro, Cidade:cidade   }}).then(cadastro=>{

    
        
    
        
                    res.render('contrate.ejs', {fotos:fotos, cadastro:cadastro})
                })




            }else{
            
            Cadastros.findAll({where:{TipoConta:'Cuidadoso', Estado:filtro}}).then(cadastro=>{

    
        
    
        
                res.render('contrate.ejs', {fotos:fotos, cadastro:cadastro})
            })
            
        }
        }else{
            console.log("Não tem filtro")
            Cadastros.findAll({where:{TipoConta:'Cuidadoso'}}).then(cadastro=>{

    
        
    
        
                res.render('contrate.ejs', {fotos:fotos, cadastro:cadastro})
            })
            
        }

    
    })
   
})


app.post('/upload', upload.single('imagem'), async (req, res) => {

  

    let id = req.body.id

    
      const { nome, descricao } = req.body;
      const imagem = req.file.buffer; // Dados binários da imagem
    
 

      const certo = imagem.toString('base64')
      
   
      

      Cadastros.update({FotoPerfil:certo}, {where:{id:id}})

      res.redirect('/contrate')
     })



     app.post('/uploadpost', upload.single('imagem'), async (req, res) => {
        const data = new Date();
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0'); // Note que janeiro é 0
        const ano = data.getFullYear();
    
        let data1 = `${dia}/${mes}/${ano}`;

        let id = req.body.id 
        let assunto = req.body.assunto
        
          const { nome, descricao } = req.body;
          const imagem = req.file.buffer; // Dados binários da imagem
     

        let idcerto = id[0]
console.log(idcerto + '---------------------------------------------------------------a qiu')
         Cadastros.findOne({where:{id:idcerto}}).then(cadastro=>{

         
 
    
          const certo = imagem.toString('base64')
          
          
          
    
          Posts.create({IDCadastro:idcerto, NomeCadastro:cadastro.Nome, Data:data1, Assunto:assunto, Foto:certo})
    
          res.redirect('/Perfil/'+idcerto)
        })
         })
          
      
         app.post('/updatepost', (req, res) => {

            let idpost = req.body.idpost
            let novoassunto = req.body.novoassunto
            let idperfil = req.body.idperfil


           Posts.update({Assunto : novoassunto}, {where:{id:idpost}})

           res.redirect(`/Perfil/${idperfil}`)
              
             })

             
         app.post('/updatedescri', (req, res) => {

            let idperfil = req.body.idperfil
            let novadescri = req.body.novadescri
            console.log("---------------------------------------"+ novadescri)


       Cadastros.update({descricao:novadescri}, {where:{id:idperfil}})

           res.redirect(`/Perfil/${idperfil}`)
              
             })

             app.get('/logout', (req, res) => {
                req.session.isLoggedIn = false;
                req.session.token = ''
                res.redirect('/')
              });
              
     
    

app.listen(80, function (erro) {
    if (erro)   {
        console.log("Ocorreu um erro!")
    } else {
        console.log("Servidor iniciado com sucesso")
    }
})


