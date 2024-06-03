const DB = require('../DatabaseModels/DatabaseModels');

function AdmValidade(req, res, next) {
  Logged = req.session.userId;

  DB.Cadastros.findOne({ where: { id: Logged } }).then(Register => {

    if (Register.TipoConta == 'Administrador') {
      next();
    }
    else {
      res.redirect('/');
    }
  })
}

module.exports = AdmValidade