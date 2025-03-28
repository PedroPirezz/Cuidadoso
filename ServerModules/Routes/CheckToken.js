const DB = require('../DatabaseModels/DatabaseModels');

async function CheckToken(req, res, next) {
  if (req.session.userId) {
      let usuario = req.session.userId;
      let token = req.session.token;
      let user = await DB.Cadastros.findOne({ where: { id: usuario } });

      if (user && user.Token == token) {
          next();
      } else {
          res.redirect("/Login");
      } 
  } else {
      res.redirect("/Login");
  }
}

module.exports = CheckToken

