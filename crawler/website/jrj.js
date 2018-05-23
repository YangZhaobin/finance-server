
const EventProxy = require('eventproxy');
const ep = new EventProxy();
const logger = require('../../logger')('task');
const cheerio = require('cheerio');
const server = require('../curl');
const Artical = require('../../db/model/artical');
const config = require('../../const/web_const');

const website_id = config.jrj.id;
const MAX_COUNT = config.jrj.max;
const URL = config.jrj.url;

async function analyzeWebsite($, type, next) {
    let articals = [];
    $('.w .jrj-clear .lf2.fl .list2 li').each((index, item) => {
        let $item = $(item);
        let $a = $item.children('a');
        let $time = $item.children('i');
        if ($a.length) {
            let data = {
                title: $a.text(),
                url: $a.attr('href'),
                time: $time.text().trim(),
                website_id,
                type
            };
            articals.push(data);
        }
    });
    await Artical.addMultiArticals(articals)
        .catch((error) => {
            logger.info('spider jrj data error', error);
        })
        .finally(() => {
            ep.emit(type);
        });
};

async function crawlWebsite (next) {
    !next && (next = () => {});
    let type_arr = [{
        type: 'international',
        url: 'http://finance.jrj.com.cn/list/guojicj.shtml'
    }, {
        type: 'industry',
        url: 'http://finance.jrj.com.cn/list/industrynews.shtml'
    }];
    let types = type_arr.map((item) => {
        return item.type;
    });
    ep.all(types, next);
    type_arr.forEach(async (item) => {
        let data = await server.crawler(item.url);
        let $ = cheerio.load(data, {decodeEntities: false}); // 加载页面内容          
        await analyzeWebsite($, item.type, next)
            .catch((err) => {
                logger.info('spider jrj data error', error);
            });
    });
};

exports.crawlWebsite = crawlWebsite;