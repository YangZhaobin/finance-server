
const later = require('later');
const Artical = require('../db/model/artical');
const Netease = require('./website/netease');
const Tencent = require('./website/tencent');
const People = require('./website/people');
const Prcfe = require('./website/prcfe');
const Wallstreet = require('./website/wallstreet');
const News10jqka = require('./website/10jqka');
const Classify = require('./classify');

async function beginCrawl() {
    Artical.deleteAllArticals();

    await Netease.crawlWebsite();

    await Tencent.crawlWebsite();

    await People.crawlWebsite();

    await Prcfe.crawlWebsite();

    await Wallstreet.crawlWebsite();
    
    await News10jqka.crawlWebsite();

    await Classify.classify();

    return {
        code: 200,
        msg: `crawl over! ${new Date()}`
    };
};

exports.runCrawl = async () => {
    //设置每天凌晨执行
    later.parse.recur().on(7).dayOfWeek().on('00:00:00').time();

    later.date.localTime();  //设置本地时区

    // let timer = later.setInterval(function(){
    //     beginCrawl()
    //         .then(data => {
    //             if (data.code === 200) {
    //                 console.info(data.msg);
    //             }
    //         })
    //         .catch(err => {
    //             console.info(err);
    //         });
    // }, sched);

    try {
        let data = await beginCrawl();
        if (data.code === 200) {
            console.info(data.msg);
        }
    } catch (err) {
        console.info(err);
    }
};


