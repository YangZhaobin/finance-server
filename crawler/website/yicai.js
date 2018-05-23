
const logger = require('../../logger')('task');
const cheerio = require('cheerio');

const Artical = require('../../db/model/artical');
const config = require('../../const/web_const');

const http = require('http'); 
const qs = require('querystring');
const iconv = require('iconv-lite');

const website_id = config.caixin.id;

const MAX_COUNT = config.caixin.max;

const URL = config.caixin.url;

let type_count = 0;

async function analyzeWebsite(web, next) {
    let articals = [];
    let { 
        type,
        channel,
        start,
        count,
        picdim,
        callback
    } = web;
    let content = qs.stringify(web); 
    let options = { 
        hostname: 'www.yicai.com',
        path: '/api/ajax/NsList' + content, 
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
            data = data.trim();
            let startStr = 'analyzeData(';
            let endStr = ');';
            let start = data.indexOf(startStr);
            let end = data.lastIndexOf(endStr);
            let str = data.substring(startStr.length, end);
            let ret = JSON.parse(str);
            data = ret['datas'];
            data.forEach((item) => {
                let artical = {
                    title: item.desc,
                    url: item.link,
                    website_id,
                    type
                };
                articals.push(artical);
            });
            await Artical.addMultiArticals(articals)
                .then(() => {
                })
                .catch((error) => {
                    logger.info('spider caixin data error', error);
                })
                .finally(() => {
                    type_count--;
                    if (!type_count) {
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
        type: 'finance',
        page: 1,
        channel: 125
    }, {
        type: 'industry',
        channel: 130,
        start: 0,
        count: MAX_COUNT,
        picdim: '_145_97',
        callback: 'analyzeData'
    }, {
        type: 'comment',
        channel: 126,
        start: 0,
        count: MAX_COUNT,
        picdim: '_145_97',
        callback: 'analyzeData'
    }, {
        type: 'comment',
        channel: 132,
        start: 0,
        count: MAX_COUNT,
        picdim: '_145_97',
        callback: 'analyzeData'
    }];
    type_count = type_arr.length;
    for(let i = 0, len = type_arr.length; i < len; i++) {
        let item = type_arr[i];
        if (item.type) {
            await analyzeWebsite(item, next);
        }
    }
};

exports.crawlWebsite = crawlWebsite;