const Koa = require('koa');
const router = require('koa-router')();
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const config = require('./config/default.js');
const fs = require('fs');
const path = require('path');
// const bodyParser = require('koa-bodyparser');
const bodyParser = require('koa-body');
const koaStatic = require('koa-static')
// const staticCache = require('koa-static-cache')
// var cors = require('koa-cors');
const app = new Koa();
// let cookie = {
//     maxAge: '', // cookie有效时长
//     expires: '',  // cookie失效时间
//     path: '/', // 写cookie所在的路径
//     domain: '', // 写cookie所在的域名
//     httpOnly: '', // 是否只用于http请求中获取
//     overwrite: '',  // 是否允许重写
//     secure: '',
//     sameSite: '',
//     signed: '',
//
// }

let cookie = {
    httpOnly: true,
    secure: false,
    overwrite: false,
    maxAge: 60 * 60 * 1000,
}
const allowpage = [ '/login','/register','/signup'];

// app.use(cors());
app.use(async (ctx, next) => {
    // ctx.cookies.set(
    //     //     'cid','hello world',{
    //     //         domain:'localhost', // 写cookie所在的域名
    //     //         path:'/',       // 写cookie所在的路径
    //     //         maxAge: 2*60*60*1000,   // cookie有效时长
    //     //         expires:new Date('2019-05-10'), // cookie失效时间
    //     //         httpOnly:false,  // 是否只用于http请求中获取
    //     //         overwrite:false  // 是否允许重写
    //     //     }
    //     // );
    //     // ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:8082');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , sessionId,token');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    ctx.set("Access-Control-Allow-Credentials", true); //可以带cookies
    if (ctx.method == 'OPTIONS') {
        ctx.body = '';
    } else {
        console.log(ctx);
        await next();
    }
});

// session存储配置
const sessionMysqlConfig = {
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    host: config.database.HOST,
    port: config.database.PORT,
};

// 配置session中间件
app.use(session({
    key: 'USER_SID',
    store: new MysqlStore(sessionMysqlConfig),
    cookie
}));
// 配置静态资源加载中间件
app.use(koaStatic(
  path.join(__dirname , './public')
))
// app.use(staticCache(path.join(__dirname, './public'), { dynamic: true }, {
//     maxAge: 365 * 24 * 60 * 60
// }))
// app.use(staticCache(path.join(__dirname, './images'), { dynamic: true }, {
//     maxAge: 365 * 24 * 60 * 60
// }))
app.use(bodyParser({
    multipart: true,
    formLimit: '1mb'
}));

app.use(async (ctx, next) => {
    let url = ctx.originalUrl;
    if (allowpage.includes(url)||(!allowpage.includes(url))&&ctx.session&&ctx.session.user) {
        await next();
    }
    else{
        ctx.body = {
            code: 405,
            msg: '未登录'
        }
    }
});

app.use((ctx, next) => {
    return next().catch(error => {
        console.log(error)
        // if (error.status === 401) {
        //     if (ctx.url === '/auth/check') {
        //         ctx.response.status = 200
        //         ctx.response.body = {
        //             status: 'fail',
        //             msg: '用户未登录',
        //             isLogin: false
        //         }
        //     } else {
        //         ctx.response.status = 401
        //         ctx.response.body = {
        //             status: 'fail',
        //             msg: '无权限（未登录）',
        //             isLogin: false
        //         }
        //     }
        // } else {
        //     throw error
        // }
    })
})
// x-response-time

// app.use(async (ctx, next) => {
//     const start = Date.now();
//     await next();
//     const ms = Date.now() - start;
//     ctx.set('X-Response-Time', `${ms}ms`);
// });

// router.get('/home', async ctx => {
//     ctx.body = 'home'
// })
router.post('/upload', async ctx => {
    const file = ctx.request.files.file; // 上传的文件在ctx.request.files.file
    console.log(file)
    const reader = fs.createReadStream(file.path);
    // 修改文件的名称
    var myDate = new Date();
    var newFilename = myDate.getTime()+'.'+file.name.split('.')[1];
    var targetPath = path.join(__dirname, './public/upload') + `/${newFilename}`;
    //创建可写流
    const upStream = fs.createWriteStream(targetPath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
    //返回保存的路径
    ctx.body = { code: 200, data: { url: 'http://' + ctx.headers.host + '/upload/' + newFilename }, msg: '上传成功' };
});

// response
// app.use(async ctx => {
//     ctx.body = 'Hello World';
// });
app
    .use(router.routes())
    .use(require('./router/user.js').routes())
    .use(require('./router/article.js').routes())
    .use(require('./router/goods.js').routes()).use(router.allowedMethods());

app.listen(config.port);
console.log(`localhost:${config.port}`);