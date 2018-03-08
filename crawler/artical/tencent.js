
const cheerio = require('cheerio');
const server = require('../curl');
const Helpers = require('../../utils/helpers/index');

const from = '腾讯新闻';

function analyzeArtical($) {
    let title = Helpers.unescapeText($('.qq_conent .LEFT h1').html());
    let content = Helpers.unescapeText($('.qq_conent .content-article').html());
    let published_at = Helpers.unescapeText($('.qq_conent .a-src-time').html());

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