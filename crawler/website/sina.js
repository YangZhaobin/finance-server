
const logger = require('../../logger')('task');
const cheerio = require('cheerio');

const Artical = require('../../db/model/artical');
const config = require('../../const/web_const');

const Promise = require('bluebird');
const http = require('http'); 
const qs = require('querystring');
const iconv = require('iconv-lite');

const website_id = config.sina.id;

const MAX_COUNT = config.sina.max;

const URL = config.sina.url;

async function analyzeWebsite(web, next) {
    let articals = [];
    let { 
        page,
        num,
        pageid,
        lid,
        type,
        callback
    } = web;
    let content = qs.stringify({
        page,
        num,
        pageid,
        lid,
        callback,
        _: +Date()
    }); 
    let options = { 
        hostname: 'feed.mix.sina.com.cn', 
        path: '/api/roll/get?' + content, 
        method: 'GET' 
    }; 
    const req = http.request(options, (res) => {
        let arr = [];
        let l = 0;
        res.on('data', (chunk) => { 
            arr.push(chunk);
            l += chunk.length; 
        });
        res.on('end', async () => {
            let data = Buffer.concat(arr, l);
            let encodeType = 'utf-8';
            data = iconv.decode(data, encodeType);
            let startStr = 'try{feedCardJsonpCallback(';
            let endStr = ');}catch(e){};';
            let start = data.indexOf(startStr);
            let end = data.lastIndexOf(endStr);
            let str = data.substring(startStr.length, end);
            let ret = JSON.parse(str);
            data = ret['result']['data'];
            data.forEach((item) => {
                let ctime = new Date(parseInt(item.ctime + '000'));
                let year = ctime.getFullYear();
                let month = ctime.getMonth() + 1;
                let day = ctime.getDate();
                let hour = ctime.getDate();
                let min = ctime.getMinutes();
                let second = ctime.getSeconds();
                let time = `${year}-${month}-${day} ${hour}:${min}:${second}`;
                let artical = {
                    title: item.title,
                    url: item.url,
                    time,
                    website_id,
                    type
                };
                articals.push(artical);
            });
            await Artical.addMultiArticals(articals)
                .then(() => {
                })
                .catch((error) => {
                    logger.info('spider sina data error', error);
                })
                .finally(() => {
                    if (type === 'finance') {
                        next();
                    }
                });
        });
    });
    req.end();
}

async function crawlWebsite (next) {
    !next && (next = () => {});
    const type_arr = [{
        href: '/chanjing/',
        type: 'industry',
        page: 1,
        num: MAX_COUNT,
        pageid: 164,
        lid: 1693,
        callback: 'feedCardJsonpCallback'
    }, {
        // href: '/world/',
        // type: 'international'
    }, {
        href: '/review/',
        type: 'comment',
        page: 1,
        num: MAX_COUNT,
        pageid: 165,
        lid: 1698,
        callback: 'feedCardJsonpCallback'
    }, {
        href: '/quanshang/',
        type: 'finance',
        page: 1,
        num: MAX_COUNT,
        pageid: 186,
        lid: 1746,
        callback: 'feedCardJsonpCallback'
    }];

    for(let i = 0, len = type_arr.length; i < len; i++) {
        let item = type_arr[i];
        if (item.href) {
            await analyzeWebsite(item, next);
        }
    }
};

exports.crawlWebsite = crawlWebsite;