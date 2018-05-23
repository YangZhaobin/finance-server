
const EventProxy = require('eventproxy');
const ep = new EventProxy();
const logger = require('../../logger')('task');
const cheerio = require('cheerio');
const server = require('../curl');
const Artical = require('../../db/model/artical');
const config = require('../../const/web_const');

const website_id = config.ft.id;
const MAX_COUNT = config.ft.max;
const URL = config.ft.url;

async function analyzeWebsite($, type, href, counter) {
    let articals = [];
    let isReturnFlag = 0;
    $('.content-inner .items .item-container').each(async (index, item) => {
        let $item = $(item).children('.item-inner').children('.item-headline');
        let $time = $(item).children('.item-inner').children('.item-time');
        let $a = $item.children('a');
        let data = {
            title: $a.text().trim(),
            url: URL + $a.attr('href'),
            time: $time.text().trim(),
            website_id,
            type
        };
        counter++;
        if (counter > MAX_COUNT) {
            isReturnFlag = 1;
            return;
        }
        articals.push(data);
    });

    await Artical.addMultiArticals(articals)
        .catch((error) => {
            logger.info('spider ft data error', error);
            ep.emit(type);
        })
        .finally(() => {
            isReturnFlag && ep.emit(type);
        });

    if (counter > MAX_COUNT) {
        return;
    }
    // 下一页
    let $current = $('.pagination-container .pagination-inner span.current');
    if ($current.length) {
        let cur = $current.text().trim();
        let nextUrl = URL + href + '?page=' + (parseInt(cur) + 1);
        let data = await server.crawler(nextUrl, 'utf-8');
        let $ = cheerio.load(data);
        await analyzeWebsite($, type, href, counter)
            .catch((err) => {
                ep.emit(type);
            });
    } else {
        ep.emit(type);
    }
};

const crawlWebsite = async (next) => {
    !next && (next = () => {});
    const type_arr = [{
        type: 'international',
        href: '/channel/world.html'
    }, {
        type: 'finance',
        href: '/channel/finance.html'
    }, {
        type: 'comment',
        href: '/channel/comment.html'
    }];
    let types = type_arr.map((item) => {
        return item.type;
    });
    ep.all(types, next);

    type_arr.forEach(async (item, index) => {
        let url = URL + item.href;
        let data = await server.crawler(url, 'utf-8').catch(() => {
                            ep.emit(item.type);
                        });
        let $ = cheerio.load(data);
        await analyzeWebsite($, item.type, item.href, 0)
            .catch(() => {
                ep.emit(item.type);
            });
    });
};

exports.crawlWebsite = crawlWebsite;