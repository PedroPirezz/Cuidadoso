const express = require('express');
const router = express.Router();
const DB = require('../DatabaseModels/DatabaseModels');

router.get('/', (req, res) => {

  DB.Posts.findAll({ limit: 9, raw: true }).then(posts => { //Estou fazendo uma busca no Banco de dados e trazendo os 9 primeiros posts

      res.render('HomePage.ejs', { posts: posts })

  })
})

module.exports = router