const userModel = require('../../lib/mysql.js');
const moment = require('moment');

class Article {
    async articleAdd(ctx, next) {
        // console.log(ctx.session,8888)
        // ctx.body='signup'
        const {user, id} = ctx.session;
// console.log(user,id)
        const {title, content} = ctx.request.body;
        await userModel.insertArticle([ user, id, title,content, moment().format('YYYY-MM-DD HH:mm:ss')]).then(async res => {
            ctx.body = {
                code: 200,
                msg: '新增成功',
            }
        });
    }

    async articleDelete(ctx, next) {
        // console.log(ctx.session,8888)
        // ctx.body='signup'
        // const {user, id} = ctx.session;
// console.log(user,id)
        const {id} = ctx.request.body;
        await userModel.deleteArticle( id ).then( res => {
            ctx.body = {
                code: 200,
                msg: '删除成功',
            }
        });
    }

    async articleEdit(ctx, next) {
        const {title, content,id} = ctx.request.body;
        await userModel.editArticle([ title,content, moment().format('YYYY-MM-DD HH:mm:ss'),id]).then(res => {

            ctx.body = {
                code: 200,
                data: res,
                msg: '编辑成功',
            }
        });
    }

    async articleList(ctx, next) {
        // console.log(ctx.session,8888)
        // ctx.body='signup'
        const { user, id } = ctx.session;
        const {current,pageSize = 10} = ctx.query;
        // const {current,pageSize = 10} = ctx.request.body;
        let total=0,data=[];

        await userModel.queryArticle( user, current, pageSize).then(res => {
            data = res
        });
        await userModel.queryArticleCount( user).then(res => {
            total = res[0].count;
        });
        ctx.body = {
            code: 200,
            data:{
                data,
                total
            },
            msg: '查询成功',
        }
    }
    // async signup(ctx, next) {
    //     console.log(ctx.session,8888)
    //     // ctx.body='signup'
    //     let {name, password = '', avatar} = ctx.request.body;
    //     // console.log(name,password)
    //     await userModel.findDataCountByName(name).then(async res => {
    //         console.log(res)
    //         if (res[0].count >= 1) {
    //             ctx.body = {
    //                 code: 500,
    //                 msg: '用户名重复'
    //             }
    //         } else {
    //             if (password.trim() === '') {
    //                 ctx.body = {
    //                     code: 500,
    //                     msg: '密码不能为空'
    //                 }
    //             } else {
    //                 await userModel.insertData([name, password, moment().format('YYYY-MM-DD HH:mm:ss')]).then(async res => {
    //                     ctx.body = {
    //                         code: 200,
    //                         msg: '注册成功',
    //                     }
    //                     // await userModel.findDataByName(name).then(res => {
    //                     //     console.log(res)
    //                     //     ctx.body = {
    //                     //         code: 200,
    //                     //         msg: '注册成功',
    //                     //         data: res[0]
    //                     //     }
    //                     // })
    //                 })
    //             }
    //         }
    //     })
    //
    //
    // }
    //
    // async login(ctx, next) {
    //     let {name, password = ''} = ctx.request.body;
    //     await userModel.findDataByName(name).then(async res => {
    //         if (res.length && name === res[0].name && password === res[0].pass) {
    //             ctx.session = {
    //                 user: res[0]['name'],
    //                 id: res[0]['id']
    //             };
    //             ctx.body = {
    //                 code: 200,
    //                 msg: '登录成功',
    //                 data: res[0]
    //             }
    //         } else {
    //             ctx.body = {
    //                 code: 500,
    //                 msg: '用户名或密码错误'
    //             }
    //         }
    //     });
    // }
    //
    // async logout(ctx, next) {
    //     ctx.session = null;
    //     ctx.body = {
    //         code: 200,
    //         msg: '退出成功'
    //     }
    // }
}

module.exports = new Article();