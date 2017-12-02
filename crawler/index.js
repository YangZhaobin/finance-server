
const later = require('later');

const Sina = require('./sina');
const Netease = require('./netease');
const Tencent = require('./tencent');
const People = require('./people');


async function beginCrawl() {
    // await Sina.crawlWebsite();

    // await Netease.crawlWebsite();

    // await Tencent.crawlWebsite();

    await People.crawlWebsite();

    console.info('crawl over!');
    return {
        code: 200,
        msg: `crawl over! ${new Date()}`
    };
}

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


