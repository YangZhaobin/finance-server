
const cheerio = require('cheerio');
const server = require('../curl');
const Helpers = require('../../utils/helpers/index');
const config = require('../../const/web_const');

const from = config.ft.cn;

function analyzeArtical($, url) {
    let title = $('.story-container .story-headline').text().trim();
    let content = $('.main-text.atc-content').html();
    let published_at = $('#pubtime_baidu').html();

    let f = $('#pubtime_baidu').next('.info-sp').html();
    let t = '';
    if ( !content ) {
        t = '原文收费， 了解更多请浏览原文。'; 
    }
    content = `
        ${content}
        <br>
        <br>
        <br>
        <br>
        <br>
        <p>${t}</p>
        <p>原文地址： <a href="${url}" target="_blank">${title}</a></p>
    `;
    return {
        title,
        content,
        url,
        published_at,
        from: f
    };
}

exports.crawlArtical = async (url) => {

    let data = await server.crawler(url, 'utf-8');

    let $ = cheerio.load(data);
            
    let artical = await analyzeArtical($, url);

    return artical;
};