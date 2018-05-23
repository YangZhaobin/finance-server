
const EventProxy = require('eventproxy');
const ep = new EventProxy();
const later = require('later');
const Artical = require('../db/model/artical');
const Netease = require('./website/netease');
const Tencent = require('./website/tencent');
const Sina = require('./website/sina');
const Prcfe = require('./website/prcfe');
const Wallstreet = require('./website/wallstreet');
const News10jqka = require('./website/10jqka');
const Caixin = require('./website/caixin');
const Jrj = require('./website/jrj');
const Ft = require('./website/ft');
const Classify = require('./classify');

async function beginCrawl() {
    Artical.deleteAllArticals();
    
    let eventArr = [
        'neteaseSpider',
        'sinaSpider',
        'prcfeSpider',
        'wallstreetSpider',
        '10jqkaSpider',
        'caixinSpider',
        'jrjSpider',
        'ftSpider'
    ];
    // await Tencent.crawlWebsite();

    ep.all(eventArr, () => {
        Classify.classify();
    });
    ep.fail(() => {
        Classify.classify();
    });

    await Netease.crawlWebsite(() => {
        ep.emit('neteaseSpider');
    });

    await Sina.crawlWebsite(() => {
        ep.emit('sinaSpider');
    });

    await Prcfe.crawlWebsite(() => {
        ep.emit('prcfeSpider');
    });

    await Wallstreet.crawlWebsite(() => {
        ep.emit('wallstreetSpider');
    });
    
    await News10jqka.crawlWebsite(() => {
        ep.emit('10jqkaSpider');
    });

    await Caixin.crawlWebsite(() => {
        ep.emit('caixinSpider');
    });

    await Jrj.crawlWebsite(() => {
        ep.emit('jrjSpider');
    });

    await Ft.crawlWebsite(() => {
        ep.emit('ftSpider');
    });

    return {
        code: 200,
        msg: `crawl over! ${new Date()}`
    };
};

function remove(arr, val) {
    var index = arr.indexOf(val);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
};

exports.runCrawl = async () => {
    try {
        let data = await beginCrawl();
        if (data.code === 200) {
            console.info(data.msg);
        }
    } catch (err) {
        console.info(err);
    }
};


