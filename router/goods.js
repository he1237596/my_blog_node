const router = require('koa-router')();
// import User from '../controller/user'
const Goods = require('../controller/goods');

// router.post('/signup',User.signup);
// router.post('/login',User.login);
router.get('/goods/list',Goods.getList);
module.exports = router;