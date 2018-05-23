
const cheerio = require('cheerio');
const server = require('../curl');
const config = require('../../const/web_const');

const from = config.wallstreet.cn;

async function analyzeArtical($, url, flag) {
    let title = $('.main-article .article__heading__title').eq(0).html();
    console.info(title);
    if (!title) {
        new_url = url.replace('wallstreetcn', 'weexcn');
        let data = await server.crawler(new_url);
        console.info(new_url);
        
        let $ = cheerio.load(data);
        let title = $('.article .article__heading__title').eq(0).html();
        let content = $('.article__content').html();
        let published_at = $('.article .article__heading__meta .article__heading__meta__createdtime').eq(0).html();
    
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
    } else {
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
}

exports.crawlArtical = async (url) => {
    url = url.replace('https', 'http');
    let data = await server.crawler(url);

    let $ = cheerio.load(data);
            
    let artical = await analyzeArtical($, url);

    return artical;
};