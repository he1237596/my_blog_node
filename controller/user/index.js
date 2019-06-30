const userModel = require('../../lib/mysql.js');
const moment = require('moment');

class User {
    async signup(ctx, next) {
        console.log(ctx.session,8888)
        // ctx.body='signup'
        let {name, password = '', avatar} = ctx.request.body;
        // console.log(name,password)
        await userModel.findDataCountByName(name).then(async res => {
            if (res[0].count >= 1) {
                ctx.body = {
                    code: 500,
                    msg: '用户名重复'
                }
            } else {
                if (password.trim() === '') {
                    ctx.body = {
                        code: 500,
                        msg: '密码不能为空'
                    }
                } else {
                    const time = moment().format('YYYY-MM-DD HH:mm:ss');
                    await userModel.insertData([name, password, time, time]).then(async res => {
                        ctx.body = {
                            code: 200,
                            msg: '注册成功',
                        }
                        // await userModel.findDataByName(name).then(res => {
                        //     console.log(res)
                        //     ctx.body = {
                        //         code: 200,
                        //         msg: '注册成功',
                        //         data: res[0]
                        //     }
                        // })
                    })
                }
            }
        })


    }

    async login(ctx, next) {
        let {name, password = ''} = ctx.request.body;
        await userModel.findDataByName(name).then(res => {
            if (res.length && name === res[0].name && password === res[0].pass) {
                ctx.session = {
                    user: res[0]['name'],
                    id: res[0]['id']
                };
                ctx.body = {
                    code: 200,
                    msg: '登录成功',
                    data: res[0]
                }
            } else {
                ctx.body = {
                    code: 500,
                    msg: '用户名或密码错误'
                }
            }
        });
    }
    async getUserInfo(ctx, next){
        const { user, id } = ctx.session;
        await userModel.findDataByName(user).then( res=>{
            if (res.length) {
                ctx.body = {
                    code: 200,
                    msg: '查询成功',
                    data: res[0]
                }
            } else {
                ctx.body = {
                    code: 500,
                    msg: '用户不存在'
                }
            }
        })
    }

    async updateUserInfo(ctx, next){
        const { user, id } = ctx.session;
        const { nickname,avatar } = ctx.request.body;
        await userModel.findDataByName(user).then( async res=>{
            await userModel.updateUser([ nickname, avatar, moment().format('YYYY-MM-DD HH:mm:ss'),user]).then(res=>{

            });
            ctx.body={
                code: 200,
                msg:'查询成功',
                data: res[0]
            }
        })
    }

    async logout(ctx, next) {
        ctx.session = null;
        ctx.body = {
            code: 200,
            msg: '退出成功'
        }
    }
}

module.exports = new User();