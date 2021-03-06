
const cheerio = require('cheerio');
const config = require('../../const/web_const');
const server = require('../curl');
const Helpers = require('../../utils/helpers/index');

const from = config.tencent.cn;

function analyzeArtical($, url) {
    let title = Helpers.unescapeText($('.qq_conent .LEFT h1').html());
    let content = Helpers.unescapeText($('.qq_conent .content-article').html());
    let published_at = Helpers.unescapeText($('.qq_conent .a-src-time').html());
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