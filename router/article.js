const router = require('koa-router')();
// import User from '../controller/user'
const Article = require('../controller/article');
//
router.post('/article/add',Article.articleAdd);
router.post('/article/delete',Article.articleDelete);
router.post('/article/edit',Article.articleEdit);
router.get('/article/list',Article.articleList);
// router.post('/login',User.login);
//
module.exports = router;
