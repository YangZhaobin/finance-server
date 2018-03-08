
const cheerio = require('cheerio');
const server = require('../curl');

const from = '人民网';

function analyzeArtical($) {
    let title = $('h1').eq(0).html();
    let content = $('#rwb_zw').html();
    let published_at = $('.box01 .fl').eq(0).html();

    return {
        title,
        content,
        published_at,
        from
    };
}

exports.crawlArtical = async (url) => {

    let data = await server.crawler(url);

    let $ = cheerio.load(data, {decodeEntities: false});
            
    let artical = await analyzeArtical($);

    return artical;
};