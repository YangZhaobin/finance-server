

const cheerio = require('cheerio');
const server = require('./curl');

function analyzeWebsite($) {

    return {
        
    };
}

exports.crawlWebsite = async (url) => {

    let data = await server.crawler(url);

    let $ = cheerio.load(data);
            
    let artical = await analyzeWebsite($);

    return artical;
};