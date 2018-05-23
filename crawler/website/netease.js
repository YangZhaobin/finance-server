
const EventProxy = require('eventproxy');
const ep = new EventProxy();
const logger = require('../../logger')('task');
const cheerio = require('cheerio');
const server = require('../curl');
const Artical = require('../../db/model/artical');
const config = require('../../const/web_const');

const website_id = config.netease.id;

const MAX_COUNT = config.netease.max;

const URL = config.netease.url;

async function analyzeWebsite($, next) {
    const type_arr = ['hongguan', 'international', 'energy'];
    const type_arr_cn = ['宏观', '国际', '能源'];

    ep.all(type_arr, next);

    // 开始解析出不同版块url
    $('.nav_channel .common_wrap span').each(async (index, item) => {
        let $item = $(item);
        $item.children('a').each(async (i, a) => {
            let $a = $(a);
            let p = type_arr_cn.indexOf($a.html());
            if(p !== -1) {
                let type = type_arr[p];
                let href = $a.attr('href');
                await analyzeArticalList(href, type, 0)
                    .catch(() => {
                        logger.info('spider netease data error', error);
                        ep.emit(type);
                    });
            }
        });
    });
};

async function analyzeArticalList(url, type, counter) {
    let data = await server.crawler(url);
    let $ = cheerio.load(data);
    let $area_list = $('.area_list .col_l');
    let articals = [];
    let isReturnFlag = 0;
    // 解析文章列表
    $area_list.children('.list_item').each((index, item) => {
        let $item = $(item);
        let $a = $item.children('.item_top').eq(0).children('h2').eq(0).children('a').eq(0);
        let $time = $item.children('.item_top').eq(0).children('p').eq(0).children('.time').eq(0);
        let data = {
            title: $a.text(),
            url: $a.attr('href'),
            time: $time.text().trim(),
            website_id,
            type
        };
        counter++;
        if (counter > MAX_COUNT) { // 如果文章数大于指定额度，定制解析
            isReturnFlag = 1;
            return;
        }
        articals.push(data);
    });
    // 将数据添加至数据库
    await Artical.addMultiArticals(articals)
        .catch((error) => {
            logger.info('spider netease data error', error);
            ep.emit(type);
        })
        .finally(() => {
            isReturnFlag && ep.emit(type);
        });

    if (counter > MAX_COUNT) {
        ep.emit(type);
        return;
    }
    // 下一页
    let $next = $area_list.children('.list_page').eq(0).children('li').last().prev();
    if (!$next.hasClass('on')) {  // 判断是否有下一页
        let nextUrl = $next.children('a').eq(0).attr('href');
        await analyzeArticalList(nextUrl, type, counter)
            .catch(() => {
                logger.info('spider netease data error', error);
                ep.emit(type);
            });
    } else {
        ep.emit(type);
    }
};

async function crawlWebsite (next, u = URL) {
    !next && (next = () => {});
    let data = await server.crawler(u);
    let $ = cheerio.load(data, {decodeEntities: false}); // 加载页面内容          
    await analyzeWebsite($, next);  // 解析页面内容
};

exports.crawlWebsite = crawlWebsite;