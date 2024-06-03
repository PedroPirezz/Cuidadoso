const localVariables = (req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.userName = req.session.userName || null;
  res.locals.userId = req.session.userId || null;
  res.locals.token = req.session.token || null;
  res.locals.TipoConta = req.session.TipoConta;
  next();
};

module.exports = localVariables;
