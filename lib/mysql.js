var mysql = require('mysql');
var config = require('../config/default.js');
var pool = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    port: config.database.PORT
});

let query = (sql, values) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })

};
let users =
    `create table if not exists users(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '用户名',
     pass VARCHAR(100) NOT NULL COMMENT '密码',
     nickname VARCHAR(100) NOT NULL DEFAULT '' COMMENT '用户昵称',
     avatar VARCHAR(100) NOT NULL DEFAULT '' COMMENT '头像',
     moment VARCHAR(100) NOT NULL COMMENT '注册时间',
     update_time VARCHAR(100) NOT NULL COMMENT '修改时间',
     PRIMARY KEY ( id )
    );`;
// let goods =
//     `create table if not exists goods(
//      id INT NOT NULL AUTO_INCREMENT,
//      name VARCHAR(100) NOT NULL COMMENT '商品名称',
//      price VARCHAR(100) NOT NULL COMMENT '价格',
//      inventory VARCHAR(100) NOT NULL COMMENT '库存',
//      main_image VARCHAR(100) NOT NULL COMMENT '主图',
//      sub_image VARCHAR(200) NOT NULL COMMENT '次图',
//      detail VARCHAR(200) NOT NULL COMMENT '详情',
//      create_time VARCHAR(100) NOT NULL DEFAULT '' COMMENT '创建时间',
//      PRIMARY KEY ( id )
//     );`;
let articles =
    `
    create table if not exists articles(
     id INT NOT NULL AUTO_INCREMENT,
     auth VARCHAR(100) NOT NULL COMMENT '作者(用户名)',
     title VARCHAR(100) NOT NULL COMMENT '标题',
     uid VARCHAR(40) NOT NULL COMMENT '用户id',
     content TEXT(0) NOT NULL COMMENT '内容',
     comments VARCHAR(100) NOT NULL DEFAULT 0 COMMENT '评论数',
     moment VARCHAR(40) NOT NULL COMMENT '发布时间',
     avatar VARCHAR(100) NOT NULL DEFAULT '' COMMENT '用户头像',
     PRIMARY KEY(id) 
    );`;
let comments =
    `
     create table if not exists comment(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '用户名称',
     content TEXT(0) NOT NULL COMMENT '评论内容',
     moment VARCHAR(40) NOT NULL COMMENT '评论时间',
     article_id VARCHAR(40) NOT NULL COMMENT '文章id',
     user_id VARCHAR(100) NOT NULL COMMENT '用户id',
     PRIMARY KEY(id) 
    );`;

let createTable = (sql) => {
    return query(sql, [])
};

// 建表
createTable(users);
// createTable(goods);
createTable(articles);
createTable(comments);
// 注册用户
exports.insertData = (value) => {
    let _sql = "insert into users set name=?,pass=?,moment=?,update_time=?;";
    // let _sql = "insert into users(name,pass,avatar,moment) values (?,?,?,?)";
    return query(_sql, value)
};
// 通过账号查找用户数量判断是否已经存在
exports.findDataCountByName = (name) => {
    let _sql = `select count(*) as count from users where name="${name}";`;
    return query(_sql)
};
// 通过账号查找用户
exports.findDataByName = (name) => {
    let _sql = `select * from users where name="${name}";`;
    return query(_sql)
};
// 修改用户信息
exports.updateUser = (values) => {
    let _sql = `update users set nickname=?,avatar=?,update_time=? where name=?`;
    return query(_sql, values)
}

// 通过id查找商品
// exports.findGdoosByName = (id) => {
//     let _sql = `select * from goods where id="${id}";`
//     return query(_sql)
// };

// 发布文章
exports.insertArticle = (value) => {
    let _sql = "insert into articles set auth=?,uid=?,title=?,content=?,moment=?;";
    // let _sql = "insert into users(name,pass,avatar,moment) values (?,?,?,?)";
    return query(_sql, value)
};
// update posts set title=?,content=?,md=? where id=?
// 删除文章
exports.deleteArticle = (id) => {
    let _sql = `delete from articles where id=${id}`;
    return query(_sql)
}
// 编辑文章
exports.editArticle = (value) => {
    let _sql = "update articles set title=?,content=?,moment=? where id=?;";
    // let _sql = "insert into users(name,pass,avatar,moment) values (?,?,?,?)";
    return query(_sql, value)
};
//查询文章数量
exports.queryArticleCount = (name) => {
    let _sql = `select count(*) as count from articles where auth="${name}";`;
    return query(_sql)
};
// 查询文章分页
exports.queryArticle = (name, current, size) => {
    let _sql = `select * from articles where auth="${name}" order by id desc limit ${(current - 1) * 10},${size};`;
    return query(_sql)
};
//查询文章评论数
exports.queryCommentsCount = (name) => {
    let _sql = `select count(*) as count from comments where article_id="${name}";`;
    return query(_sql)
};
//删除文章评论
exports.queryCommentsCount = (article_id) => {
    let _sql = `delete from comments where article_id=${article_id}`;
    return query(_sql)
};
//删除某条评论
exports.queryCommentsCount = (id) => {
    let _sql = `delete from comments where id=${id}`;
    return query(_sql)
};
//文章添加评论
exports.insertComments = (value) => {
    let _sql = "insert into comments set name=?,article_id=?,user_id=?,content=?,moment=?;";
    // let _sql = "insert into users(name,pass,avatar,moment) values (?,?,?,?)";
    return query(_sql, value)
};
// 查询文章评论列表
exports.queryCommentsList = (article_id, current, size) => {
    let _sql = `select * from comments where article_id="${article_id}" order by id desc;`;
    if(size){
        _sql =`select * from comments where article_id="${article_id}" order by id desc limit ${(current - 1) * 10},${size};`;
    }
    return query(_sql)
};