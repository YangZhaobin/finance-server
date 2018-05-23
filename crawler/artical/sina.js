
const cheerio = require('cheerio');
const server = require('../curl');
const config = require('../../const/web_const');

const from = config.sina.cn;

function analyzeArtical($, url) {
    let title = $('h1.main-title').eq(0).html().trim();
    let content = $('#artibody').html();
    let published_at = $('#top_bar .date').eq(0).html();
    let f = $('#top_bar .source.ent-source').eq(0).html();
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
        content,
        url,
        published_at,
        from: f
    };
}

exports.crawlArtical = async (url) => {

    let data = await server.crawler(url, 'utf-8');

    let $ = cheerio.load(data, {decodeEntities: false});
            
    let artical = await analyzeArtical($, url);

    return artical;
};