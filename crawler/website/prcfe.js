
const cheerio = require('cheerio');
const server = require('../curl');
const WEB = require('../../const/web_const');
const Artical = require('../../db/model/artical');
const Helpers = require('../../utils/helpers/index');

const website_id = 6;

let URL = WEB['prcfe'];

const MAX_COUNT = 50;

let counter = 0;

async function analyzeWebsite($) {
    const type_arr = ['hongguan', 'international', 'stock', 'energy', 'comment', 'finance', 'industry', 'licai'];
    const type_arr_cn = ['宏观', '国际', '股票', '能源', '评论', '金融', '产业', '理财'];

    $('.nav-main li').each(async (index, item) => {
        let $item = $(item);
        let $a = $item.children('a').eq(0);
        let tab = Helpers.unescapeText($a.html());
        let p = type_arr_cn.indexOf(tab);
        if(p !== -1) {
            let type = type_arr[p];
            let href = $a.attr('href');
            await analyzeArticalList(href, type);
            counter = 0;
        }
    });
};

async function analyzeArticalList(url, type) {
    let data = await server.crawler(url, 'utf-8');
    let $ = cheerio.load(data);

    let $area_list = $('.main-left .macroscopic > ul').eq(0);

    let articals = [];

    $area_list.children('li.pr').each((index, item) => {
        let $item = $(item);
        let $a = $item.children('.tab-text').eq(0).children('p').eq(0).children('a').eq(0);;

        let data = {
            title: $a.text(),
            url: URL + $a.attr('href'),
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
    let $next = $('.main-left .pagination').eq(0).children('a').eq(-2);

    if ($next.text() === '下一页') {
        let nextUrl = URL + $next.attr('href');

        await analyzeArticalList(nextUrl, type);
    } else {
        console.info('crawl prcfe data over!');
    }
    
};

const crawlWebsite = async (u = URL) => {
    
    let data = await server.crawler(u, 'utf-8');

    let $ = cheerio.load(data);
            
    await analyzeWebsite($);
};

exports.crawlWebsite = crawlWebsite;