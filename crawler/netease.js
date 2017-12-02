
const cheerio = require('cheerio');
const server = require('./curl');
const WEB = require('../const/web_const');

const website_id = 3;

let url = WEB['netease'];

function analyzeWebsite($) {
    let $stock = $('.newsdata_list li').eq(1).children('.ndi_main').eq(0).children('.news_article');
    let $finance = $('.newsdata_list li').eq(2).children('.ndi_main').children('.news_article');
    let $fund = $('.newsdata_list li').eq(3).children('.ndi_main').children('.news_article');
    let $licai = $('.newsdata_list li').eq(4).children('.ndi_main').children('.news_article');


    console.info($('.newsdata_list').children('.newsdata_item').length);
    console.info($('.newsdata_list').html());
    
    // news_article;
    $stock.each($item => {
        console.info('url');
        let url = $item.children('a').eq(0).attr('href');
        console.info(url);
    });
    return {
        
    };
}

const crawlWebsite = async (u = url) => {
    
    let data = await server.crawler(u);

    let $ = cheerio.load(data);
            
    await analyzeWebsite($);
};

exports.crawlWebsite = crawlWebsite;