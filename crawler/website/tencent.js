
const cheerio = require('cheerio');
const server = require('../curl');
const Artical = require('../../db/model/artical');
const config = require('../../const/web_const');
const Helpers = require('../../utils/helpers/index');

const website_id = config.tencent.id;

const MAX_COUNT = config.tencent.max;

const URL = config.tencent.url;

let counter = 0;

let pageURL = (pageType, pageNum) => {
    return 'http://finance.qq.com/c/' + pageType + 'llist_' + pageNum + '.htm';
};

async function analyzeWebsite($) {
    const type_arr = ['hongguan', 'international', 'stock', 'energy', 'comment', 'finance'];
    const type_arr_cn = ['宏观', '国际', '股票', '能源', '评论', '金融'];

    $('#channel_nav .ft ul li').each(async (index, item) => {
        let $item = $(item);
        let $a = $item.children('a').eq(0);
        let tab = Helpers.unescapeText($a.html());
        let p = type_arr_cn.indexOf(tab + '');
        if(p !== -1) {
            let type = type_arr[p];
            let href = $a.attr('href');
            await analyzeArticalListPage(href, type);
        }
    });
};

async function analyzeArticalListPage(url, type) {
    let data = await server.crawler(url);
    let $ = cheerio.load(data);

    let pageCount = 9;

    for(let i = 0; i <= pageCount; i++) {
        let pageType = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
        await analyzeArticalList(pageURL(pageType, i), type);
        counter = 0;
    }
};

async function analyzeArticalList(url, type) {
    let data = await server.crawler(url);
    let $ = cheerio.load(data);

    let $area_list = $('#listZone');

    let articals = [];

    $area_list.children('.Q-tpWrap').each((index, item) => {
        let $item = $(item);
        let $a = $item.children('em').eq(0).children('a').eq(0);

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
}

const crawlWebsite = async (u = URL) => {
    
    let data = await server.crawler(u);

    let $ = cheerio.load(data);
            
    await analyzeWebsite($);
};

exports.crawlWebsite = crawlWebsite;