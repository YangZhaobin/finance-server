const Runner = require('./index');
const C = require('./curl');
const Artical = require('../db/model/artical');

Runner.runCrawl();

// Artical.deleteAllArticals();
// C.crawler('http://finance.people.com.cn/index2.html#fy01').then(data => {
//     console.info(data);
// });