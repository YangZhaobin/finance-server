
const cheerio = require('cheerio');
const server = require('../curl');
const WEB = require('../../const/web_const');
const Artical = require('../../db/model/artical');

const website_id = 1;

let url = WEB['sina'];

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
                // await analyzeArticalList(href, type);
            }
        });
    });
};

const crawlWebsite = async (u = url) => {
    
    let data = await server.crawler(u);

    let $ = cheerio.load(data);
            
    await analyzeWebsite($);
};

exports.crawlWebsite = crawlWebsite;