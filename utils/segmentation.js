/*
 * @Author: yangzhaobin 
 * @Date: 2018-03-09 14:47:54 
 * @Last Modified by: yangzhaobin
 * @Last Modified time: 2018-03-09 19:27:26
 */

'use strict';

let NPL_CONFIG = require("../config/npl_config");

let AipNlpClient = require("baidu-aip-sdk").nlp;

let client = new AipNlpClient(NPL_CONFIG.APP_ID, NPL_CONFIG.API_KEY, NPL_CONFIG.SECRET_KEY);

const POS = [
    'n',   // 普通名词
    'nr',   // 人名
    'nz',   // 其他专名
    'f',   // 方位名词
    'ns',   // 地名
    's',   // 处所名词
    'nt',   // 机构团体名
    'nw'   // 作品名
];

exports.segText = async (text) => {
    let ret = await client.lexer(text);
    let classify = [];
    ret.items.forEach((item) => {
        let pos = item.pos;
        if (POS.indexOf(pos) !== -1) {
            classify.push(item.item);
        }
    });
    return classify;
};

// const JIEBA = require("nodejieba");

// const POS = [
//     'n'   // 名词
// ];

// exports.segText = (text) => {
//     let ret = JIEBA.tag(text);
//     let words = [];
//     ret.forEach((item) => {
//         let tag = item.tag;
//         if (POS.indexOf(tag) !== -1) {
//             words.push(item.word);
//         }
//     });
//     return words;
// };

