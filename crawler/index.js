
const later = require('later');
const Artical = require('../db/model/artical');
const Sina = require('./website/sina');
const Netease = require('./website/netease');
const Tencent = require('./website/tencent');
const People = require('./website/people');
const Prcfe = require('./website/prcfe');

async function beginCrawl() {
    // await Sina.crawlWebsite();

    Artical.deleteAllArticals();

    await Netease.crawlWebsite();

    await Tencent.crawlWebsite();

    await People.crawlWebsite();

    await Prcfe.crawlWebsite();

    return {
        code: 200,
        msg: `crawl over! ${new Date()}`
    };
};

exports.runCrawl = () => {
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

    beginCrawl()
        .then(data => {
            if (data.code === 200) {
                console.info(data.msg);
            }
        })
        .catch(err => {
            console.info(err);
        });
};


