
const Sina = require('./sina');

let url = 'http://finance.sina.com.cn/china/bwdt/2017-12-01/doc-ifyphxwa7408984.shtml';

Sina.crawlArtical(url)
    .then(data => {
        console.info(data);
    });