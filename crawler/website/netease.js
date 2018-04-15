
const cheerio = require('cheerio');
const server = require('../curl');
const Artical = require('../../db/model/artical');
const WEB = require('../../const/web_const');

const website_id = 3;

const MAX_COUNT = 50;

let counter = 0;

const URL = WEB['netease'];

async function analyzeWebsite($) {
    const type_arr = ['hongguan', 'international', 'stock', 'energy', 'comment', 'finance'];
    const type_arr_cn = ['宏观', '国际', '股票', '能源', '评论', '财经'];

    $('.nav_channel .common_wrap span').each(async (index, item) => {
        let $item = $(item);
        $item.children('a').each(async (i, a) => {
            let $a = $(a);
            let p = type_arr_cn.indexOf($a.html());
            if(p !== -1) {
                let type = type_arr[p];
                let href = $a.attr('href');
                await analyzeArticalList(href, type);
                counter = 0;
            }
        });
    });
};

async function analyzeArticalList(url, type) {
    let data = await server.crawler(url);
    let $ = cheerio.load(data);

    let $area_list = $('.area_list .col_l');

    let articals = [];

    let flag = 0;

    $area_list.children('.list_item').each((index, item) => {
        let $item = $(item);
        let $a = $item.children('.item_top').eq(0).children('h2').eq(0).children('a').eq(0);

        let data = {
            title: $a.text(),
            url: $a.attr('href'),
            website_id,
            type
        };

        counter++;
        if (counter > MAX_COUNT) {
            return;
        }
        articals.push(data);
    });

    await Artical.addMultiArticals(articals);

    if (counter > MAX_COUNT) {
        return;
    }
    // 下一页
    let $next = $area_list.children('.list_page').eq(0).children('li').last().prev();

    if (!$next.hasClass('on')) {
        let nextUrl = $next.children('a').eq(0).attr('href');

        await analyzeArticalList(nextUrl, type);
    } else {
        console.info('crawl 163 data over!');
    }
};

async function crawlWebsite (u = URL) {

    let data = await server.crawler(u);

    let $ = cheerio.load(data, {decodeEntities: false});
            
    await analyzeWebsite($);
};

exports.crawlWebsite = crawlWebsite;