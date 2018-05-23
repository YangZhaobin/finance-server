
const EventProxy = require('eventproxy');
const ep = new EventProxy();
const logger = require('../../logger')('task');
const cheerio = require('cheerio');
const server = require('../curl');
const config = require('../../const/web_const');
const Artical = require('../../db/model/artical');
const Helpers = require('../../utils/helpers/index');

const website_id = config.prcfe.id;

const MAX_COUNT = config.prcfe.max;

const URL = config.prcfe.url;

async function analyzeWebsite($, next) {
    const type_arr = ['hongguan', 'finance', 'industry', 'licai'];
    const type_arr_cn = ['宏观', '金融', '产业', '理财'];

    ep.all(type_arr, next);

    $('.nav-main li').each(async (index, item) => {
        let $item = $(item);
        let $a = $item.children('a').eq(0);
        let tab = Helpers.unescapeText($a.html());
        let p = type_arr_cn.indexOf(tab);
        if(p !== -1) {
            let type = type_arr[p];
            let href = $a.attr('href');
            let articals = [];
            await analyzeArticalList(href, type, 0)
                .catch((error) => {
                    logger.info('spider prcfe data error', error);
                });
        }
    });
};

async function analyzeArticalList(url, type, counter) {
    let data = await server.crawler(url, 'utf-8');
    let $ = cheerio.load(data);
    let isReturnFlag = 0;

    let $area_list = $('.main-left .macroscopic > ul').eq(0);

    let articals = [];

    $area_list.children('li.pr').each((index, item) => {
        let $item = $(item);
        let $a = $item.children('.tab-text').eq(0).children('p').eq(0).children('a').eq(0);
        let $time = $item.children('.tab-text').eq(0).children('.messge').eq(0).children('span').eq(1).children('a').eq(0);

        let data = {
            title: $a.text(),
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
            logger.info('spider prcfe data error', error);
            ep.emit(type);
        })
        .finally(() => {
            isReturnFlag && ep.emit(type);
        });

    if (counter > MAX_COUNT) {
        return;
    }
    // 下一页
    let $next = $('.main-left .pagination').eq(0).children('a').eq(-2);

    if ($next.text() === '下一页') {
        let nextUrl = URL + $next.attr('href');
        await analyzeArticalList(nextUrl, type, counter)
            .catch((error) => {
                logger.info('spider prcfe data error', error);
                ep.emit(type);
            });
    } else {
        ep.emit(type);
    }
    
};

const crawlWebsite = async (next, u = URL) => {
    !next && (next = () => {});
    
    let data = await server.crawler(u, 'utf-8');

    let $ = cheerio.load(data);
            
    await analyzeWebsite($, next);
};

exports.crawlWebsite = crawlWebsite;