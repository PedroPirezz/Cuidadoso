const session = require('express-session');

const sessionConfig = session({
    secret: 'Cuidadoso', // Chave secreta para assinar os cookies de sessão
    resave: false, // Salva a sessão apenas se modificada
    saveUninitialized: true, // Salva a sessão mesmo que não inicializada
    cookie: {
        expires: false // Cookie expira quando o navegador é fechado
    }
});

module.exports = sessionConfig;
