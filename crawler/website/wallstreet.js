
const Helpers = require('../../utils/helpers/index');
const Artical = require('../../db/model/artical');
const config = require('../../const/web_const');

const Promise = require('bluebird');
const http = require('http'); 
const qs = require('querystring');
const httpRequest = Promise.promisify(http.request);
const iconv = require('iconv-lite');

const website_id = config.wallstreet.id;
const MAX_COUNT = config.wallstreet.max;
const URL = config.wallstreet.url;

let counter = 0;

async function analyzeWebsite(type, type_cn, category, cursor) {
    let data = { 
        category,
        limit: 20,
        platform: 'wscn-platform',
        cursor: cursor || ''
    };
    let content = qs.stringify(data); 
    let options = { 
        hostname: 'api-prod.wallstreetcn.com', 
        path: '/apiv1/content/articles?' + content, 
        method: 'GET' 
    }; 
    let articals = [];
    const req = http.request(options, (res) => {
        let arr = [];
        let l = 0;
        res.on('data', (chunk) => { 
            arr.push(chunk);
            l += chunk.length; 
        });
        res.on('end', async () => {
            let data = Buffer.concat(arr, l);
            let encodeType = 'utf-8';
            data = iconv.decode(data, encodeType);
            data = JSON.parse(data).data;
            if (data.items) {
                let items = data.items;
                for (let i = 0, len = items.length; i < len; i++) {
                    counter++;
                    if (counter > MAX_COUNT) break;
                    let item = items[i];
                    let artical = {
                        title: item.title,
                        url: item.uri,
                        website_id,
                        type
                    }
                    articals.push(artical);
                }
                await Artical.addMultiArticals(articals);
                if (counter < MAX_COUNT) {
                    let cursor = data.next_cursor;
                    await analyzeWebsite(type, type_cn, category, cursor);
                } else {
                    counter = 0;
                }
            }
        });
    });
    req.end();
};


const crawlWebsite = async () => {
    const type_href = ['shares', 'us'];
    const type_arr_cn = ['股票', '国际'];
    const type_arr = ['stock', 'international'];
    const cate_arr = ['forex', 'us'];

    type_href.forEach(async (href, index) => {
        await analyzeWebsite(type_arr[index], type_arr_cn[index], cate_arr[index]);
    });
};

exports.crawlWebsite = crawlWebsite;