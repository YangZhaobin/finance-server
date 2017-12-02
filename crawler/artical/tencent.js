
const cheerio = require('cheerio');
const server = require('../curl');

function analyzeArtical($) {
    let title = $('.qq_article .hd h1').html();
    let content = $('#Cnt-Main-Article-QQ').html();
    let published_at = $('.qq_article .a_time').html();

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