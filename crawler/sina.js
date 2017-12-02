
const cheerio = require('cheerio');
const server = require('./curl');
const WEB = require('../const/web_const');

const website_id = 1;

let url = WEB['sina'];

function analyzeWebsite($) {
    

    return {
        data: 'sina'
    };
}

const crawlWebsite = async (u = url) => {
    
    let data = await server.crawler(u);

    let $ = cheerio.load(data);
            
    await analyzeWebsite($);
};

exports.crawlWebsite = crawlWebsite;