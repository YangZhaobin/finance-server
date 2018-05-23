
const cheerio = require('cheerio');
const server = require('../curl');
const config = require('../../const/web_const');

const from = config.wallstreet.cn;

function analyzeArtical($, url) {
    let title = $('.main-article .article__heading__title').eq(0).html();
    let content = $('#endText').html();
    let published_at = $('.main-article .article__heading__meta .meta-item__text').eq(0).html();
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