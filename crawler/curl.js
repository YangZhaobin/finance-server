
const http = require("http");
const iconv = require('iconv-lite') 

// Utility function that downloads a URL and invokes
// callback with the data.
async function crawler(url) {
    return new Promise((resolve, reject) => {
        http.get(url, res => {
            let arr = [];
            let length = 0;

            res.on('data', chunk => {
                arr.push(chunk);

                length += chunk.length; 
            });

            res.on('end', () => {
                let data = Buffer.concat(arr, length);

                let change_data = iconv.decode(data, 'GB2312');  

                resolve(change_data.toString());
            });
        }).on('error', err => {
            reject(err);
        });
    });
}

exports.crawler = crawler;