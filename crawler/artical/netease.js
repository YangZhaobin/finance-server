
const cheerio = require('cheerio');
const server = require('../curl');
const Helpers = require('../../utils/helpers/index');
const config = require('../../const/web_const');

const from = config.netease.cn;

function analyzeArtical($, url) {
    let title = Helpers.unescapeText($('#epContentLeft > h1').html());
    let content = Helpers.unescapeText($('#endText').html());
    let published_at = Helpers.unescapeText($('.post_time_source').html());
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
        from
    };
}

exports.crawlArtical = async (url) => {

    let data = await server.crawler(url);

    let $ = cheerio.load(data);
            
    let artical = await analyzeArtical($, url);

    return artical;
};