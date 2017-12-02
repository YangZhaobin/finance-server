
const cheerio = require('cheerio');
const server = require('../curl');

function analyzeArtical($) {
    let title = $('#epContentLeft > h1').html();
    let content = $('#endText').html();
    let published_at = $('.post_time_source').html();

    return {
        title,
        content,
        published_at
    };
}

exports.crawlArtical = async (url) => {

    let data = await server.crawler(url);

    let $ = cheerio.load(data);
            
    let artical = await analyzeArtical($);

    return artical;
};