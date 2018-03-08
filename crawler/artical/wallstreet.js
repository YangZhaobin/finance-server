
const cheerio = require('cheerio');
const server = require('../curl');

const from = '华尔街见闻';

function analyzeArtical($) {
    let title = $('.main-article .article__heading__title').eq(0).html();
    let content = $('#endText').html();
    let published_at = $('.main-article .article__heading__meta .meta-item__text').eq(0).html();

    return {
        title,
        content,
        published_at,
        from
    };
}

exports.crawlArtical = async (url) => {

    let data = await server.crawler(url);

    let $ = cheerio.load(data);
            
    let artical = await analyzeArtical($);

    return artical;
};