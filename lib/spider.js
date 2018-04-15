const Promise = require('bluebird');
const Executor = require('./executor');
const logger = require('../logger')('app');

const Artical = require('../db/model/artical');
const Sina = require('../crawler/website/sina');
const Netease = require('../crawler/website/netease');
const Tencent = require('../crawler/website/tencent');
const People = require('../crawler/website/people');
const Prcfe = require('../crawler/website/prcfe');
const Classify = require('../crawler/classify');


class Spider extends Executor {
    constructor(id, executeFun) {
        super(id, executeFun);
        // 每周一 01:00:00定时执行
        this.cronTime = '0 0 01 * * 1';
        this.version = '1.0.0';
    }

    async execute(callback) {
        Artical.deleteAllArticals();

        await Netease.crawlWebsite();

        await Tencent.crawlWebsite();

        await People.crawlWebsite();

        await Prcfe.crawlWebsite();

        await Classify.classify();

        typeof callback === 'function' && callback();
    }
}

module.exports = Spider;