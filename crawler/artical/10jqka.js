
const cheerio = require('cheerio');
const server = require('../curl');
const Helpers = require('../../utils/helpers/index');
const config = require('../../const/web_const');

const from = config.prcfe.cn;

function analyzeArtical($) {
    let title = $('.main-title').eq(0).html();
    let content = $('.main-text.atc-content').html();
    let published_at = $('#pubtime_baidu').html();

    let f = $('#pubtime_baidu').next('.info-sp').html();

    return {
        title,
        content,
        published_at,
        from: f
    };
}

exports.crawlArtical = async (url) => {

    let data = await server.crawler(url, 'utf-8');

    let $ = cheerio.load(data);
            
    let artical = await analyzeArtical($);

    return artical;
};