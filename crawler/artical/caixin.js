
const cheerio = require('cheerio');
const server = require('../curl');
const Helpers = require('../../utils/helpers/index');
const config = require('../../const/web_const');

const from = config.caixin.cn;

function analyzeArtical($, url) {
    let title = $('#conTit h1').text().trim();
    let content = $('#Main_Content_Val').html();
    let published_at = $('#artInfo').text().split('来源于')[0].trim();

    content = `
        ${content}
        <br>
        <br>
        <br>
        <br>
        <br>
        <p>原文收费， 了解更多请浏览原文。</p>
        <p>原文地址： <a href="${url}" target="_blank">${title}</a></p>
    `;
    return {
        title,
        url,
        content,
        published_at,
        from
    };
}

exports.crawlArtical = async (url) => {

    let data = await server.crawler(url, 'utf-8');

    let $ = cheerio.load(data);
            
    let artical = await analyzeArtical($, url);

    return artical;
};