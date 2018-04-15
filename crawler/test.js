const Runner = require('./index');
const classify = require('./classify');
const C = require('./curl');
const Artical = require('../db/model/artical');

Runner.runCrawl().then(() => {
    console.info('===========================');
    console.info('===========================');
    console.info('===========================');
});

// Artical.deleteAllArticals();
// C.crawler('http://finance.people.com.cn/index2.html#fy01').then(data => {
//     console.info(data);
// });


// classify.classify().then(titles => {
//     console.info(titles);
// });

// const JIEBA = require("nodejieba");

// let str = '新煤电价格联动机制 力挺企业“降成本”';

// let arr = JIEBA.tag(str);

// console.info(arr);