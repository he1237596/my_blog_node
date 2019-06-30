const router = require('koa-router')();
// import User from '../controller/user'
const User = require('../controller/user');

router.post('/signup',User.signup);//注册
router.post('/login',User.login);//登录
router.post('/getUser',User.getUserInfo);//查询用户信息
router.post('/updateUser',User.updateUserInfo);//更新用户信息
router.get('/logout',User.logout);//登出
module.exports = router;