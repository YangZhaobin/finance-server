
const cheerio = require('cheerio');
const server = require('../curl');

function analyzeArtical($) {
    let title = $('#artibodyTitle').html();
    let content = $('#artibody').html();
    let published_at = $('span.time-source').html();

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