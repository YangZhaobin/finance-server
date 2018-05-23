
const cheerio = require('cheerio');
const server = require('../curl');
const Helpers = require('../../utils/helpers/index');
const config = require('../../const/web_const');

const from = config.jrj.cn;

function analyzeArtical($, url) {
    let title = $('.main.jrj-clear .titmain h1').text().trim();
    let content = $('.main.jrj-clear .titmain  .texttit_m1').html();
    let published_at = $('.main.jrj-clear .titmain .inftop span').eq(0).text().trim();
    let f = $('.main.jrj-clear .titmain .inftop span').eq(1).text().trim().split('：')[1];
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
        from : f
    };
}

exports.crawlArtical = async (url) => {

    let data = await server.crawler(url);

    let $ = cheerio.load(data);
            
    let artical = await analyzeArtical($, url);

    return artical;
};