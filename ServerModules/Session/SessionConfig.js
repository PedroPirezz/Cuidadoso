const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const sessionConfig = session({
    secret: 'Cuidadoso', // Chave secreta para assinar os cookies de sessão
    resave: false, // Salva a sessão apenas se modificada
    saveUninitialized: true, // Salva a sessão mesmo que não inicializada
    cookie: {
        expires: true // Cookie expira quando o navegador é fechado
        ,maxAge: 1000 * 60 * 60 * 24 // Tempo de vida do cookie em milissegundos (1 dia)
    }
});
module.exports = sessionConfig;