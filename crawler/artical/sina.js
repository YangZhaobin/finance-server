
const cheerio = require('cheerio');
const server = require('../curl');

const from = '新浪财经';

function analyzeArtical($) {
    let title = $('#artibodyTitle').html();
    let content = $('#artibody').html();
    let published_at = $('span.time-source').eq(0).html();

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