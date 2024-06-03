const DB = require('../DatabaseModels/DatabaseModels');

function CuidadosoValidade(req, res, next) {
  Logged = req.session.userId;
  
  DB.Cadastros.findOne({ where: { id: Logged } }).then(Register => {

    if (Register.TipoConta == 'Cuidadoso') {
      next();
    }
    else {
      res.redirect('/');
    }
  })
}

module.exports = CuidadosoValidade