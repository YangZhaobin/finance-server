const Promise = require('bluebird');
const Executor = require('./executor');
const logger = require('../logger')('app');

const Artical = require('../db/model/artical');
const Runner = require('../crawler/index');


class Spider extends Executor {
    constructor(id, executeFun) {
        super(id, executeFun);
        // 设置每天 01:00:00 定时执行
        this.cronTime = '00 00 01 * * 1-7';
        this.version = '1.0.0';
    }

    async execute(callback) {
        Runner.runCrawl();
        typeof callback === 'function' && callback();
    }
}

module.exports = Spider;