
const cheerio = require('cheerio');
const server = require('../curl');
const Helpers = require('../../utils/helpers/index');
const config = require('../../const/web_const');

const from = config.prcfe.cn;

function analyzeArtical($, url) {
    let title = $('.main-title').eq(0).text();
    let content = $('.main-text.atc-content').html();
    let published_at = $('#pubtime_baidu').html();

    let f = $('#pubtime_baidu').next('.info-sp').html();
    content = `
        ${content}
        <br>
        <br>
        <br>
        <br>
        <br>
        <p>原文地址： <a href="${url}" target="_blank">${title}</a></p>
    `;
    return {
        title,
        url,
        content,
        published_at,
        from: f
    };
}

exports.crawlArtical = async (url) => {

    let data = await server.crawler(url);

    let $ = cheerio.load(data);
            
    let artical = await analyzeArtical($, url);

    return artical;
};