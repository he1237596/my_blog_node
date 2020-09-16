/*
 * @Author: Chris
 * @Date: 2019-06-30 19:30:28
 * @LastEditors: Chris
 * @LastEditTime: 2019-11-26 19:01:02
 * @Descripttion: **
 */
const router = require('koa-router')();
// import User from '../controller/user'
const Article = require('../controller/article');
//
router.post('/article/add',Article.articleAdd);
router.post('/article/delete',Article.articleDelete);
router.post('/article/edit',Article.articleEdit);
router.get('/article/list',Article.articleList);
router.get('/article/detail',Article.articleDetail);

// router.post('/login',User.login);
//
module.exports = router;
