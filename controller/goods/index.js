const userModel = require('../../lib/mysql.js');
const moment = require('moment');

class Goods {
    async signup(ctx, next) {
        // ctx.body='signup'
        let {name, password = '', avatar} = ctx.request.body;
        // console.log(name,password)
        await userModel.findDataCountByName(name).then(async res => {
            console.log(res)
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
                    await userModel.insertData([name, password, moment().format('YYYY-MM-DD HH:mm:ss')]).then(async res => {
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
        await userModel.findDataByName(name).then(async res => {
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

    async getList(ctx, next) {
        let {id} = ctx.query;
        if(id){
            await userModel.findGdoosByName(id).then(async res => {
                const data = res.length? res[0]:'';
                ctx.body = {
                    code: 200,
                    msg: '查询成功',
                    data
                }
            });
        }else{
            ctx.body = {
                code: 500,
                msg: '非法参数'
            }
        }
    }
}

module.exports = new Goods();