const Promise = require('bluebird');
const Executor = require('./executor');
const logger = require('../logger')('app');

const Artical = require('../db/model/artical');
const Netease = require('../crawler/website/netease');
const Tencent = require('../crawler/website/tencent');
const People = require('../crawler/website/people');
const Prcfe = require('../crawler/website/prcfe');
const Wallstreet = require('../crawler/website/wallstreet');
const News10jqka = require('../crawler/website/10jqka');
const Classify = require('../crawler/classify');


class Spider extends Executor {
    constructor(id, executeFun) {
        super(id, executeFun);
        // 每周一 01:00:00定时执行
        this.cronTime = '0 30 18 * * 1/7';
        this.version = '1.0.0';
    }

    async execute(callback) {
        console.info('-------------------- begin spider task --------------------');
        Artical.deleteAllArticals();

        await Netease.crawlWebsite();

        await Tencent.crawlWebsite();

        await People.crawlWebsite();

        await Prcfe.crawlWebsite();

        await Wallstreet.crawlWebsite();

        await News10jqka.crawlWebsite();

        await Classify.classify();

        console.info('-------------------- end spider task --------------------');
        typeof callback === 'function' && callback();
    }
}

module.exports = Spider;