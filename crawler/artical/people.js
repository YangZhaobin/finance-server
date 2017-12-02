
const cheerio = require('cheerio');
const server = require('../curl');

function analyzeArtical($) {
    let title = $('h1').html();
    let content = $('#rwb_zw').html();
    let published_at = $('.box01 .fl').html();

    return {
        title,
        content,
        published_at
    };
}

exports.crawlArtical = async (url) => {

    let data = await server.crawler(url);

    let $ = cheerio.load(data, {decodeEntities: false});
            
    let artical = await analyzeArtical($);

    return artical;
};