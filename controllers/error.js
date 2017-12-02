/**
 * Error handler controller
 * 
 * @author yangzb0922@163.com
 * @date 2017/11/30
 * @version 1.0.0
 */

'use strict';

const pkg = require('../package.json');

module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        switch (ctx.accepts('html', 'json')) {
            case 'html':
                ctx.status = 500;
                ctx.type = 'html';
                ctx.body = `<div style="font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei','WenQuanYi Micro Hei',Arial,sans-serif;">
                                <h2>Oops! Server Error</h2>
                                <p style="color: #aaa; font-style: italic;">${err}</p>
                                <p>请联系<strong style="color: green;">${pkg.author}</strong>处理</p>
                            </div>`;
                break;
            case 'json':
                ctx.status = 500;
                ctx.type = 'application/json';
                ctx.body = {
                    err: err.toString()
                };
                break;
            default:
                ctx.status = 500;
                ctx.type = 'text';
                ctx.body = err;
        }
    }
};
