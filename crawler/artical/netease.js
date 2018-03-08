
const cheerio = require('cheerio');
const server = require('../curl');
const Helpers = require('../../utils/helpers/index');

const from = '网易新闻';

function analyzeArtical($) {
    let title = Helpers.unescapeText($('#epContentLeft > h1').html());
    let content = Helpers.unescapeText($('#endText').html());
    let published_at = Helpers.unescapeText($('.post_time_source').html());

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