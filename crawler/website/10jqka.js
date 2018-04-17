
const cheerio = require('cheerio');
const server = require('../curl');
const Artical = require('../../db/model/artical');
const config = require('../../const/web_const');

const website_id = config.new10jqka.id;

const MAX_COUNT = config.new10jqka.max;

const URL = config.new10jqka.url;

let counter = 0;

async function analyzeWebsite($, type, type_cn) {
    let articals = [];
    
    $('.content-1200 .list-con ul li').each(async (index, item) => {
        let $item = $(item);
        let $title = $item.children('span').children('a');
        let $a = $item.children('a');

        let data = {
            title: $title.text().trim(),
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

    // 下一页
    let $next = $('.num-container').eq(0).children('.next').eq(0);
    if ($next.length !== 0 && counter < MAX_COUNT) {
        let nextUrl = $next.attr('href');
        let data = await server.crawler(nextUrl);
        let $ = cheerio.load(data);
        await analyzeWebsite($, type, type_cn);
    }
};

const crawlWebsite = async () => {
    const type_href = ['cjzx_list/index.shtml', 'guojicj_list/index.shtml', 'jrsc_list/index.shtml', 'fortune_list/index.shtml', 'cjkx_list/index.shtml'];
    const type_arr_cn = ['宏观', '国际', '金融', '评论', '产业'];
    const type_arr = ['hongguan', 'international', 'finance', 'comment', 'industry'];

    type_href.forEach(async (href, index) => {
        let url = URL + href;
        let data = await server.crawler(url);
        let $ = cheerio.load(data);
        await analyzeWebsite($, type_arr[index], type_arr_cn[index]);
        counter = 0;
    });
};

exports.crawlWebsite = crawlWebsite;