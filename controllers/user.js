/*
 * @Author: yangzhaobin 
 * @Date: 2018-03-09 15:43:29 
 * @Last Modified by: yangzhaobin
 * @Last Modified time: 2018-05-18 13:29:45
 */

const md = require('md5');
const jwt = require('koa-jwt');
const User = require('../db/model/user');
const Colletion = require('../db/model/collection');

exports.getAllUsers = async(ctx, next) => {
    let data = await User.findAllUser();
    ctx.body = data;
    return next();
}

exports.checkUser = async(ctx, next) => {
    let params = ctx.request.body;
    let { username, password } = params;
    let data = await User.findByUsername(username);
    let ret = {
        code: 200,
        err: '',
        ret: {}
    };
    if (!data) {
        ret.code = 400;
        ret.err = '用户不存在';
    } else if (data.password !== md(password)) {
        ret.code = 401;
        ret.err = '密码错误';
    } else {
        ret.ret.username = data.username;
        const token = jwt.sign(JSON.stringify({ username: data.username, password: data.password,original_at: Date.now()}), 'yangzhaobin');
        ret.ret.token = token;
    }
    ctx.body = ret;
    return next();
}

exports.getUserByToken = async(ctx, next) => {
    let token = ctx.request.headers['x-csrf-token'] || '';
    if (!token) {
        ctx.body = {
            code: 400
        };
        return next();
    }
    let profile = jwt.verify(token, 'yangzhaobin');
    let data = await User.findByUsername(profile.username);
    let ret = {
        code: 200,
        err: '',
        ret: {}
    };
    if (!data) {
        ret.code = 400;
        ret.err = '用户不存在';
    } else if (data.password !== profile.password) {
        ret.code = 401;
        ret.err = '密码错误';
    } else {
        ret.ret.username = data.username;
        ret.ret.token = data.token;
    }
    ctx.body = ret;
    return next();
}

exports.logoutUser = async(ctx, next) => {
    return next();
}

exports.getUserByUsername = async(ctx, next) => {
    let params = ctx.request.query;
    let { username } = params;
    let data = await User.findByUsername(username);
    ctx.body = data;
    return next();
}

exports.getCollectionByUsername = async(ctx, next) => {
    let params = ctx.request.query;
    let { username, limit = 10, offset = 0} = params;
    let data = await User.findCollectionByUsername(username, limit, offset);
    ctx.body = data;
    return next();
}

exports.addUser = async(ctx, next) => {
    let user = {
        username: ctx.request.body.username,
        password: md(ctx.request.body.password)
    };
    let data = await User.addUser(user);
    let ret = {
        code: 200,
        err: '',
        ret: {
            username: data.username
        }
    };
    ctx.body = ret;
    return next();
}

exports.addCollection = async(ctx, next) => {
    let collection = {
        username: ctx.request.body.username,
        artical_id: ctx.request.body.artical_id
    };
    let data = await Colletion.addCollection(collection);
    let ret = {};
    if (data) {
        ret.code = 200;
    } else {
        ret.code = 400;
    }
    ctx.body = ret;
    return next();
}

exports.deleteCollection = async(ctx, next) => {
    let user = {
        username: ctx.request.body.username,
        artical_id: ctx.request.body.artical_id
    };
    let data = await Colletion.delCollection(user.username, user.artical_id);
    let ret = {};
    if (data) {
        ret.code = 200;
    } else {
        ret.code = 400;
    }
    ctx.body = ret;
    return next();
}

exports.updateUser = async(ctx, next) => {
    let {
        username,
        opassword,
        password
    } = ctx.request.body;
    let data = await User.findByUsername(username);
    let ret = {
        code: 200,
        err: '',
        ret: {}
    };
    if (!data) {
        ret.code = 400;
        ret.err = '用户不存在';
    } else if (md(opassword) !== data.password) {
        ret.code = 201;
        ret.err = '密码错误';
    } else {
        password = md(password);
        let user = {
            username,
            password
        };
        let data = await User.updateUser(user);
    }
    ctx.body = ret;
    return next();
}

exports.delAllUsers = async(ctx, next) => {
    let data = await User.deleteAllUsers();
    ctx.body = data;
    return next();
}

exports.delUserByUsername = async(ctx, next) => {
    let username = ctx.request.body.username;
    let data = await User.deleteUserByUsername(username);
    ctx.body = data;
    return next();
}