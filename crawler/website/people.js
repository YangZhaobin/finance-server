
const cheerio = require('cheerio');

const server = require('../curl');
const Artical = require('../../db/model/artical');
const WEB = require('../../const/web_const');

const URL = WEB['people'];
const website_id = 4;

async function analyzeWebsite($) {
    const type_arr = ['hongguan', 'finance', 'industry', 'comment', 'international'];

    let articals = [];

    type_arr.forEach((type, index) => {
        let $news = $('.headingNews').eq(index + 1).children('.hdNews');

        $news.each(async (i, ele) => {
            let $a = $(ele).find('h5 > a');

            let data = {
                title: $a.text(),
                url: URL + $a.attr('href'),
                website_id,
                type
            };

            articals.push(data);
        });
    });

    Artical.addMultiArticals(articals)
        .then(data => {
        });
    
    let $next = $('.headingNews').eq(0).find('.page_n').children().last();

    if (!$next.hasClass('common_current_page')) {
        let nextUrl = URL + $next.attr('href');

        await crawlWebsite(nextUrl);
    } else {
        console.info('crawl people data over!');
    }
}

async function crawlWebsite (u = URL) {

    let data = await server.crawler(u);

    let $ = cheerio.load(data, {decodeEntities: false});
            
    await analyzeWebsite($);
};

exports.crawlWebsite = crawlWebsite;